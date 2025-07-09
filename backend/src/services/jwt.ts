import Elysia from "elysia";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export const jwtService = new Elysia().decorate("jwt", {
  async sign(payload: object, expireAt: string = "15m", options: object = {}) {
    const jwt = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expireAt)
      .sign(new TextEncoder().encode(JWT_SECRET));
    return jwt;
  },
  async verify(token: string) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      return payload;
    } catch (error) {
      return false;
    }
  },
  async getAccessToken(payload: JWTPayload) {
    return {
      access_token: await this.sign(payload, "15m"),
      refresh_token: await this.sign(payload, "7d"),
    };
  },
});
