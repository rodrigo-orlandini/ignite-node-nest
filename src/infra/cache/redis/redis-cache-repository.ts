import { Injectable } from "@nestjs/common";

import { CacheRepository } from "../cache-repository";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private cache: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.cache.set(key, value, "EX", 60 * 15); // 15 minutes
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
