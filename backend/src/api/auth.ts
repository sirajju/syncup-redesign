import Elysia, { status, t } from "elysia";
import { dbService } from "../services/db";
import { cacheService } from "../services/cache";
import { jwtService } from "../services/jwt";

export const auth = new Elysia({
  name: "Auth api",
  prefix: "/auth",
})
  .use(cacheService)
  .use(dbService)
  .use(jwtService)
  .post(
    "/login",
    async ({ body, db, jwt, server, request, set }) => {
      const { email, password } = body;
      const user = await db.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          status: 404,
          message: "Invalid email or password",
        };
      }

      const isPasswordMatched = Bun.password.verifySync(
        password,
        user.passwordHash
      );

      if (isPasswordMatched) {
        return {
          status: 401,
          message: "Invalid email or password",
        };
      }

      await db.session.create({
        data: {
          ipAddress: `${server!.requestIP(request)}`,
          expiresAt: new Date(),
          userAgent: request.headers.get("user-agent"),
          isActive: true,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const { access_token, refresh_token } = await jwt.getAccessToken({
        id: user.id,
        email: user.email,
      });

      set.headers["set-cookie"] =
        `access_token=${access_token}; HttpOnly; Path=/; Max-Age=900000; SameSite=Strict`;
      

      return {
        success: true,
        refresh_token,
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );
