import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { redisClient } from "@/redis/redisClient";

const app = new Hono();

const startHono = () => {
  app.use(
    "/api/*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "ngrok-skip-browser-warning",
      ],
    })
  );

  app.get("/api/v1/listing/draft", async (c) => {
    const userId = c.req.query("id");
    try {
      const name = await redisClient.get(`itemName_${userId}`);
      const desc = await redisClient.get(`itemDesc_${userId}`);
      const price = await redisClient.get(`itemPrice_${userId}`);
      const reason = await redisClient.get(`itemReason_${userId}`);
      const imageUrl = await redisClient.get(`itemImageUrl_${userId}`);

      return c.json({
        name: name || "No name",
        desc: desc || "No desc",
        price: price || "No price",
        reason: reason || "No reason",
        imageUrl: imageUrl || "No image url",
      });
    } catch (err) {
      return c.json({ message: "Error fetching data from Redis" }, 500);
    }
  });

  serve({
    fetch: app.fetch,
    port: 8787,
  });
  console.log("Hono initialized...");
};

export { startHono };
