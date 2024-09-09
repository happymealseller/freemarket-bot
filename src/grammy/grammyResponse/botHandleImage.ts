import { botToken, tgBotClient } from "@/grammy/grammyClient";
import { aiImageQuery } from "@/openai/openaiQuery";
import { imageMenu } from "@/grammy/grammyMenu";
import { redisCacheExpiration, redisClient } from "@/redis/redisClient";
import { downloadImage } from "@/utils/downloadImage";

const botHandleImage = () => {
  tgBotClient.on("message:photo", async (ctx) => {
    const userId = ctx.update.message.from.id;
    const imageRedisKey = `image_${userId}`;
    const imageFile = await ctx.getFile();
    const imageUrl = `https://api.telegram.org/file/bot${botToken}/${imageFile.file_path}`;

    try {
      const [chatCompletion, imageBuffer] = await Promise.all([
        aiImageQuery(imageUrl),
        downloadImage(imageUrl),
      ]);

      const aiResponse = chatCompletion.choices[0].message.content;

      if (aiResponse) {
        await ctx.reply(aiResponse, imageMenu);
      } else {
        await ctx.reply(
          "Error generating AI response, please send me another image!"
        );
      }

      await redisClient.set(
        imageRedisKey,
        imageBuffer,
        "EX",
        redisCacheExpiration
      );
    } catch (err) {
      console.error("An error occurred:", err);
    }
  });
};

export { botHandleImage };
