import dotenv from "dotenv";
import { Bot } from "grammy";

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  throw new Error(
    "Missing necessary environment variables for bot initialization."
  );
}

let tgBotClient: Bot;

try {
  tgBotClient = new Bot(botToken);
  console.log("Initialized telegram bot successfully");
} catch (err) {
  console.log("Failed to initialize bot:", err);
}

export { tgBotClient, botToken };
