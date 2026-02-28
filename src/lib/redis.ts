import { createClient } from "redis";
import "dotenv/config"
const redisClient = await createClient({
  url: `${process.env.REDIS_URL}`
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

await redisClient.set("key", "value");
const value = await redisClient.get("key");

export { redisClient }