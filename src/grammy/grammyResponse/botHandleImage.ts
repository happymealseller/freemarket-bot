import { botToken, tgBotClient } from "@/grammy/grammyClient";
import { aiImageQuery } from "@/openai/openaiQuery";
import { imageMenu } from "@/grammy/grammyMenu";
import { redisCacheExpiration, redisClient } from "@/redis/redisClient";
import { downloadImage } from "@/utils/downloadImage";

const botHandleImage = () => {
  tgBotClient.on("message:photo", async (ctx) => {
    const userId = ctx.update.message.from.id;

    try {
      const imageFile = await ctx.getFile();
      const imageUrl = `https://api.telegram.org/file/bot${botToken}/${imageFile.file_path}`;

      const [chatCompletion, imageBuffer] = await Promise.all([
        aiImageQuery(imageUrl),
        downloadImage(imageUrl),
      ]);

      if (imageBuffer) {
        const imageRedisKey = `itemImage_${userId}`;
        await redisClient.set(
          imageRedisKey,
          imageBuffer,
          "EX",
          redisCacheExpiration
        );
      } else {
        await ctx.reply(
          "Error retrieving image, please send me another image!"
        );
      }

      if (chatCompletion) {
        const aiResponse = chatCompletion.choices[0].message.content;
        const itemInfo = aiResponse?.split("|");
        const itemInfoRedisKey = [
          `itemName_${userId}`,
          `itemDesc_${userId}`,
          `itemPrice_${userId}`,
          `itemReason_${userId}`,
        ];

        itemInfo?.forEach(async (item, index) => {
          await redisClient.set(
            itemInfoRedisKey[index],
            item,
            "EX",
            redisCacheExpiration
          );
        });
      } else {
        await ctx.reply(
          "Error generating AI response, please send me another image!"
        );
      }

      //TODO: replace image reply with web url
      await ctx.reply("*link to edit listing page", imageMenu);
    } catch (err) {
      console.error("An error occurred:", err);
    }
  });
};

export { botHandleImage };
