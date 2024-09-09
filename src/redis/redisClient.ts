import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const redisCacheExpiration = 300;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PW;

if (!redisHost || !redisPort || !redisPassword) {
  throw new Error(
    "Missing necessary environment variables for Redis connection."
  );
}

let redisClient: Redis;

try {
  redisClient = new Redis({
    host: redisHost,
    port: parseInt(redisPort, 10),
    password: redisPassword,
  });

  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  redisClient.on("connect", () => {
    console.log("Connected to Redis successfully");
  });
} catch (err) {
  console.error("Failed to initialize Redis:", err);
}

export { redisClient, redisCacheExpiration };
