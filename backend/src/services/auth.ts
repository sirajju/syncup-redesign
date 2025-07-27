import Elysia from "elysia";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
const JWT_SECRET = process.env.JWT_SECRET;

export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
  TEMP = "TEMP",
}

class authServiceImplementation {
  constructor() {}

  async sign(payload: object, expireAt: string = "15m", options: object = {}) {
    const jwt = await new SignJWT({ sub: "syncup_validation", ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expireAt)
      .sign(new TextEncoder().encode(JWT_SECRET));
    return jwt;
  }
  async verify(
    token: string,
    type?: TokenType
  ): Promise<JWTPayload | undefined> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      if (type && payload.type !== type) return;
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return;

      return payload;
    } catch (error) {}
  }
  async getTempToken(payload: JWTPayload, exp: string = "5m") {
    return await this.sign(
      {
        type: TokenType.TEMP,
        ...payload,
      },
      exp
    );
  }
  async getAccessToken(payload: JWTPayload) {
    return {
      access_token: await this.sign(
        {
          type: TokenType.ACCESS,
          ...payload,
        },
        "15m"
      ),
      refresh_token: await this.sign(
        {
          type: TokenType.REFRESH,
          ...payload,
        },
        "7d"
      ),
    };
  }
}

export const authService = new Elysia().decorate(
  "auth",
  new authServiceImplementation()
);

export const authenticationService = new Elysia().use(authService).resolve(
  {
    as: "global",
  },
  async ({ cookie, auth, status }) => {
    const { a_t } = cookie;
    let session = null;
    if (a_t) session = await auth.verify(`${a_t.value}`, TokenType.ACCESS);
    if (!session) {
      status(401);
      return {
        success: false,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        status: 401,
      };
    }
    return {
      session,
    };
  }
);
