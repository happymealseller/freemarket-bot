import { tgBotClient } from "@/grammy/grammyClient";
import { startMenu } from "@/grammy/grammyMenu";

const botHandleStart = () => {
  tgBotClient.command(
    "start",
    async (ctx) =>
      await ctx.reply(
        "Welcome to the FreeMarket, send me an image to get started!",
        startMenu
      )
  );
};

export { botHandleStart };
