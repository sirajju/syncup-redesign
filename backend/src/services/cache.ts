import Redis from "ioredis";
import logger from "./logger";
import Elysia from "elysia";

const connection = new Redis(process.env.REDIS!);

connection.on("connect", () => {
  logger.info("Connected to Redis");
});

connection.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

class cacheImplementation {
  constructor(private redis: Redis) {
    this.redis = redis;
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async getByPattern(pattern: string): Promise<string[]> {
    const keys = await this.redis.keys(pattern);
    const values = await Promise.all(keys.map((key) => this.redis.get(key)));
    return values.filter((value) => value !== null) as string[];
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, "EX", ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async getWithCallback(
    key: string,
    callback: () => Promise<any>,
    ttl?: number
  ): Promise<string> {
    const cachedValue = await this.get(key);
    if (cachedValue) {
      return cachedValue;
    }
    let value = await callback();
    if (!value) return value;
    if (typeof value == "object") value = JSON.stringify(value);
    await this.set(key, value, ttl);
    return value;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }
  async setex(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, "EX", ttl);
  }
}

export const cacheService = new Elysia().decorate(
  "cache",
  new cacheImplementation(connection)
);
