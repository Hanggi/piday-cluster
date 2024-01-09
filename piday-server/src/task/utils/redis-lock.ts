import { Redis } from "ioredis";

export async function acquireLock(
  redis: Redis,
  lockKey: string,
  lockTimeout: number,
) {
  const lock = await redis.set(lockKey, "locked", "EX", lockTimeout, "NX");
  return lock === "OK";
}

export async function releaseLock(redis: Redis, lockKey: string) {
  await redis.del(lockKey);
}
