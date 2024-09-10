import { tgBotClient } from "@/grammy/grammyClient";
import { appListingSearch, appListingDraft } from "@/grammy/grammyMenu";

const botHandleCallback = () => {
  tgBotClient.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    console.log(ctx.update.callback_query.from.id);
    if (data === "user_buy") {
      await ctx.reply("Click to view results", appListingSearch());
    } else if (data === "user_sell") {
      const userId = ctx.update.callback_query.from.id;
      await ctx.reply("Draft has been generated", appListingDraft(userId));
    } else {
      await ctx.reply(
        "Image is missing in cache, please send me another image!"
      );
    }
  });
};

export { botHandleCallback };
