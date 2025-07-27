import Elysia from "elysia";
import * as jose from "jose";

class CryptoService {
  async encrypt(text: string, jwk: Record<string, any>): Promise<string> {
    const publicKey = await jose.importJWK(jwk, "RSA-OAEP-256");

    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(text))
      .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A128CBC-HS256" })
      .encrypt(publicKey);

    return jwe;
  }
}

export const cryptoService = new Elysia().decorate(
  "crypto",
  new CryptoService()
);
