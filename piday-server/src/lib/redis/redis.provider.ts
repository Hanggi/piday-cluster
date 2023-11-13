import config from "config";
import { Redis } from "ioredis";

export const redisProvider = [
  {
    provide: "REDIS_CLIENT",
    useFactory: async () => {
      const redis = new Redis({
        host: config?.get<string>("redis.host"),
        port: config?.get<number>("redis.port"),
      });
      return redis;
    },
  },
];
