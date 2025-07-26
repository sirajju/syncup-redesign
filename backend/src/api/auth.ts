import Elysia, { status, t } from "elysia";
import { dbService } from "../services/db";
import { cacheService } from "../services/cache";
import { generateOtp } from "../utils/basic";
import { mailService } from "../services/mail";
import { authService, TokenType } from "../services/auth";

const OTP_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const OTP_EXPIRATION_STRING = "5m";

export const auth = new Elysia({
  name: "Auth api",
  prefix: "/auth",
})
  .use(cacheService)
  .use(dbService)
  .use(mailService)
  .use(authService)
  .post(
    "/login",
    async ({
      body,
      db,
      mailer,
      request,
      server,
      cookie,
      cache,
      path,
      auth,
      set,
    }) => {
      const { email, password } = body;
      const user = await db.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        set.status = 401;
        return {
          message: "Invalid email or password",
          code: "INVALID_EMAIL_OR_PASSWORD",
          success: false,
        };
      }

      const isPasswordValid = await Bun.password.verify(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        set.status = 401;
        return {
          message: "Invalid email or password",
          code: "INVALID_EMAIL_OR_PASSWORD",
          success: false,
        };
      }

      if (user.isBanned)
        return {
          status: 403,
          message: user.banReason || "You are banned from this platform",
          code: "USER_BANNED",
          success: false,
        };

      if (user.twoFactorEnabled) {
        const isAlreadySent = await cache.exists(`login:otp:${user.id}`);

        if (isAlreadySent) {
          set.status = 429;
          return {
            status: 429,
            message: "OTP already sent, please wait before requesting again",
            code: "OTP_ALREADY_SENT",
            success: false,
          };
        }

        let code = generateOtp().toString();

        await cache.setex(
          `login:otp:${user.id}`,
          JSON.stringify({
            code,
            attempts: 0,
            expiresAt: Date.now() + OTP_EXPIRATION,
          }),
          OTP_EXPIRATION
        );

        mailer.sendMail({
          to: user.email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${code}. It is valid for ${OTP_EXPIRATION_STRING}.`,
        });

        const access_token = await auth.getTempToken(
          {
            id: user.id,
            email: user.email,
          },
          OTP_EXPIRATION_STRING
        );

        cookie.t_t.set({
          value: access_token,
          expires: new Date(Date.now() + OTP_EXPIRATION),
          httpOnly: true,
          sameSite: true,

          path: path.replace("/login", "/verify-otp"),
        });

        return {
          success: false,
          message: "OTP sent to your email",
          code: "OTP_SENT",
        };
      }

      const { access_token, refresh_token } = await auth.getAccessToken({
        id: user.id,
        email: user.email,
      });

      cookie.a_t.set({
        value: access_token,
        expires: new Date(Date.now() + 1000 * 60 * 15),
        httpOnly: true,
        sameSite: true,
      });

      cookie.r_t.set({
        value: refresh_token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        sameSite: true,
        httpOnly: true,
        path: path.replace("/login", "/refresh"),
      });

      await db.session.create({
        data: {
          userId: user.id,
          ipAddress: `${server!.requestIP(request)?.address}`,
          expiresAt: new Date(),
          userAgent: request.headers.get("user-agent"),
          isActive: true,
        },
      });

      return {
        success: true,
        message: "Welcome back!",
        code: "LOGIN_SUCCESS",
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
        code: t.String(),
        status: t.Optional(t.Number()),
      }),
    }
  )
  .post(
    "/register",
    async ({ body, db, mailer, set, auth, cookie }) => {
      const { email, password, username } = body;
      const existingUser = await db.user.findFirst({
        where: { email },
      });
      if (existingUser) {
        set.status = 409;
        return {
          status: 409,
          message: "Email already registered",
          code: "EMAIL_ALREADY_REGISTERED",
          success: false,
        };
      }
      const passwordHash = await Bun.password.hash(password);
      const newUser = await db.user.create({
        data: {
          email,
          passwordHash,
          username,
          emailVerified: false,
          twoFactorEnabled: true,
        },
      });
      mailer.sendMail({
        to: email,
        subject: "Welcome to Syncup",
        text: `Hello ${username}, welcome to Syncup! Your account has been created successfully. Please verify your email to start using the platform.`,
      });

      return {
        success: true,
        message: "User registered successfully",
        code: "USER_REGISTERED",
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        username: t.String(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
        code: t.String(),
        user: t.Optional(
          t.Object({
            id: t.String(),
            email: t.String(),
            username: t.String(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
          })
        ),
        status: t.Optional(t.Number()),
      }),
    }
  )
  .put(
    "/verify-otp",
    async ({ body, cache, db, auth, cookie, server, request, set }) => {
      const { t_t } = cookie;
      const { code } = body;
      const sendResponse = (status: number, message: string, code: string) => {
        set.status = status;
        return {
          status,
          message,
          code,
          success: false,
        };
      };

      if (!t_t.value) return sendResponse(401, "Unauthorized", "UNAUTHORIZED");
      const payload = await auth.verify(`${t_t.value}`, TokenType.TEMP);

      if (!payload || !payload.id)
        return sendResponse(401, "Unauthorized", "UNAUTHORIZED");

      const { id } = payload;
      const cachedCode = await cache.get(`login:otp:${id}`);

      if (!cachedCode)
        return sendResponse(400, "OTP expired or not found", "OTP_NOT_FOUND");

      const {
        code: cachedCodeValue,
        attempts,
        expiresAt,
      } = JSON.parse(cachedCode);

      if (expiresAt <= Date.now()) {
        cache.delete(`login:otp:${id}`);
        return sendResponse(400, "OTP expired or not found", "OTP_NOT_FOUND");
      }

      if (cachedCodeValue !== code) {
        if (attempts >= 3) {
          await cache.delete(`login:otp:${id}`);
          return sendResponse(
            429,
            "Too many attempts, please request a new OTP",
            "TOO_MANY_ATTEMPTS"
          );
        }
        await cache.setex(
          `login:otp:${id}`,
          JSON.stringify({
            code: cachedCodeValue,
            attempts: attempts + 1,
          }),
          OTP_EXPIRATION
        );
        return sendResponse(
          400,
          `Invalid OTP, attemptes left ${3 - attempts}`,
          "INVALID_OTP"
        );
      }
      await cache.delete(`login:otp:${id}`);
      const user = await db.user.findUnique({ where: { id: id as string } });
      if (!user) return sendResponse(404, "User not found", "USER_NOT_FOUND");
      if (user.isBanned)
        return sendResponse(
          403,
          user.banReason || "You are banned from this platform",
          "USER_BANNED"
        );
      const { access_token, refresh_token } = await auth.getAccessToken({
        id: user.id,
        email: user.email,
      });
      cookie.a_t.set({
        value: access_token,
        expires: new Date(Date.now() + 1000 * 60 * 5),
        httpOnly: true,
        sameSite: true,
      });
      cookie.r_t.set({
        value: refresh_token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
        sameSite: true,
      });

      cookie.t_t.maxAge = 0;

      await db.session.create({
        data: {
          userId: user.id,
          ipAddress: `${server!.requestIP(request)?.address}`,
          expiresAt: new Date(),
          userAgent: request.headers.get("user-agent"),
          isActive: true,
        },
      });

      return {
        success: true,
        message: "Welcome back!",
        code: "LOGIN_SUCCESS",
      };
    },
    {
      body: t.Object({
        code: t.String(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
        code: t.String(),
        status: t.Optional(t.Number()),
      }),
    }
  )
  .post("/refresh", async ({ request, cookie, auth, path, set }) => {
    const { a_t, r_t } = cookie;
    if (!a_t.value && !r_t.value) {
      set.status = 401;
      return {
        status: 401,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        success: false,
      };
    }
    const payload = await auth.verify(`${r_t.value}`, TokenType.REFRESH);
    if (!payload || !payload.id) {
      set.status = 401;
      return {
        status: 401,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        success: false,
      };
    }
    const { access_token, refresh_token } = await auth.getAccessToken({
      id: payload.id,
      email: payload.email,
    });
    cookie.a_t.set({
      value: access_token,
      expires: new Date(Date.now() + 1000 * 60 * 15),
      httpOnly: true,
      sameSite: true,
    });
    cookie.r_t.set({
      value: refresh_token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: true,
      sameSite: true,
      path: "/refresh",
    });
    cookie.t_t.maxAge = 0;
    return 200;
  })
  .get("/get-session", async ({ auth, cookie, db, set }) => {
    const { a_t } = cookie;

    if (!a_t.value) {
      set.status = 401;
      return {
        status: 401,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        success: false,
      };
    }
    const payload = await auth.verify(`${a_t.value}`);
    if (!payload || !payload.id) {
      set.status = 401;
      return {
        status: 401,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        success: false,
      };
    }
    const user = await db.user.findUnique({
      where: { id: `${payload.id}` },
    });

    if (!user) {
      set.status = 404;
      return {
        status: 404,
        message: "User not found",
        code: "USER_NOT_FOUND",
        success: false,
      };
    }

    if (user.isBanned) {
      set.status = 403;
      return {
        status: 403,
        message: user.banReason || "You are banned from this platform",
        code: "USER_BANNED",
        success: false,
      };
    }

    if (!user) {
      set.status = 404;
      return {
        status: 404,
        message: "User not found",
        code: "USER_NOT_FOUND",
        success: false,
      };
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  })
  .delete("/logout", async ({ cookie, db, auth, server, request, set }) => {
    const { a_t, r_t } = cookie;
    if (!a_t.value && !r_t.value) {
      set.status = 401;
      return {
        status: 401,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        success: false,
      };
    }
    const payload = await auth.verify(`${a_t.value}`, TokenType.ACCESS);
    if (!payload || !payload.id) {
      set.status = 401;
      return {
        status: 401,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        success: false,
      };
    }
    await db.session.updateMany({
      where: { userId: payload.id },
      data: { isActive: false },
    });
    cookie.a_t.value = "";
    cookie.r_t.value = "";

    cookie.a_t.expires = new Date();
    cookie.a_t.maxAge = 0;
    cookie.r_t.expires = new Date();
    cookie.r_t.maxAge = 0;

    cookie.a_t.remove();
    cookie.r_t.remove();

    return {
      status: 200,
      message: "Logged out successfully",
      code: "LOGOUT_SUCCESS",
      success: true,
    };
  });
