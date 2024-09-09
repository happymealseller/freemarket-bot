import { InputFile } from "grammy";
import { redisClient } from "@/redis/redisClient";
import { tgBotClient } from "@/grammy/grammyClient";

const botHandleCallback = () => {
  tgBotClient.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data === "user_buy") {
      await ctx.reply("In Progress");
    } else if (data === "user_sell") {
      const userId = ctx.update.callback_query.from.id;

      try {
        const imageBuffer: Buffer | null = await redisClient.getBuffer(
          `itemImage_${userId}`
        );

        if (imageBuffer) {
          const inputFile = new InputFile(imageBuffer);
          await ctx.replyWithPhoto(inputFile);
        } else {
          await ctx.reply(
            "Image is missing in cache, please send me another image!"
          );
        }
      } catch (err) {
        console.error("Error occurred:", err);
      }
    }
  });
};

export { botHandleCallback };
