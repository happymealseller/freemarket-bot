import { Bot, InputFile } from "grammy";
import { onStart } from "./inline-buttons/onStartButton";
import OpenAI from "openai";
import { config } from "dotenv";
import { inlineKeyboard } from "./features/telegram-bot/inlineKeyboards";
import sharp from "sharp";
import axios from "axios";
import Redis from "ioredis";

async function downloadImage(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data, "binary");
}

// Function to resize the image buffer to a square
async function resizeImageBuffer(imageBuffer, size) {
  return sharp(imageBuffer).resize(size, size).toBuffer();
}

// === inject env variables ========
config();
// =================================
const redis = new Redis({
  password: process.env.REDIS_PW,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Expiration time for the cached image (in seconds)
const IMAGE_CACHE_EXPIRATION = 300; // 5 minutes

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiResponse = async (photo) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "ItemName = Tell me what is this item. (Max 15 Chars)",
          },
          {
            type: "text",
            text: "Price = I no long want it, estimate how much i should sell this for in Singapore. (Max 15 Chars)",
          },
          {
            type: "text",
            text: "Reason = Give me the reasoning as well. (Max 100 Chars)",
          },
          {
            type: "image_url",
            image_url: {
              url: photo,
            },
          },
          {
            type: "text",
            text: "",
          },
          {
            type: "text",
            text: "Double Check if the reply is in JSON format. If it is, send me the JSON Obj",
          },
        ],
      },
    ],
    temperature: 0.7,
  });

  return res;
};

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Bot(botToken);

bot.command("start", (ctx) => ctx.reply("Welcome to the freemarket!", onStart));
// Handle other messages.
bot.on("message:text", (ctx) => {
  console.log(ctx.update);
  ctx.reply("Got a text from you!", onStart);
});

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === "switch_to_buy") {
    await ctx.reply("In Progress");
  } else if (data === "switch_to_sell") {
    // TODO: handle if no image
    const userId = ctx.update.callback_query.from.id;
    const base64Image = await redis.get(`image_${userId}`);
    // console.log("base64Image-start", base64Image, "base64Image-end");
    const imageBuffer = Buffer.from(base64Image, "base64");
    // console.log("imageBuffer-start", imageBuffer, "imageBuffer-end");
    const inputFile = new InputFile(imageBuffer);
    console.log("inputFile-start", inputFile, "inputFile-end");

    //

    await ctx.replyWithPhoto(inputFile);
  }
});

bot.on("message:photo", async (ctx) => {
  const photo = await ctx.getFile();
  const photoUrl = `https://api.telegram.org/file/bot${botToken}/${photo.file_path}`;
  const generate = await aiResponse(photoUrl);

  const reply = generate.choices[0].message.content;

  await ctx.reply(
    `${reply}
    What would you like to do today?`,
    {
      reply_markup: inlineKeyboard,
    }
  );

  const imageBuffer = await downloadImage(photoUrl);
  const userId = ctx.update.message.from.id;
  console.log(ctx.update.message.from.id);

  //   const userId = ctx.update.callback_query.from.id;
  const imageKey = `image_${userId}`;
  await redis.set(
    imageKey,
    imageBuffer.toString("base64"),
    "EX",
    IMAGE_CACHE_EXPIRATION
  );

  console.log(`Image saved in Redis with key: ${imageKey}`);
});

//   // Optionally, resize the image and store it again in Redis
//   const resizedImageBuffer = await resizeImageBuffer(imageBuffer, 500);
//   const resizedImageKey = `resized_${Date.now()}`;
//   await redis.set(
//     resizedImageKey,
//     resizedImageBuffer.toString("base64"),
//     "EX",
//     IMAGE_CACHE_EXPIRATION
//   );

//   console.log(`Resized image saved in Redis with key: ${resizedImageKey}`);

//   // Send resized image back to user
//   const base64Image = await redis.get(resizedImageKey);
//   const imageBuffer2 = Buffer.from(base64Image, "base64");
//   const inputFile = new InputFile(imageBuffer2);
//   await ctx.replyWithPhoto(inputFile);

//   // Optionally, delete keys from Redis after use if needed
//   await redis.del(imageKey);
//   await redis.del(resizedImageKey);
// });

// Function to download image from URL as a buffer

// });

// bot.on("callback_query", (ctx) => {
//   const message = ctx.message;
//   const chatId = ctx.message.chat.id;

//   // Send a message back when the button is clicked
//   if (callbackQuery.data === "sell") {
//     bot.sendMessage(chatId, "You clicked the sell button! 🎉");
//   }

//   // Optionally, answer the callback to remove the "waiting" animation on the button
//   bot.answerCallbackQuery(callbackQuery.id);
// });

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();

//   const photoKey = { [ctx.update.message.chat.id]: photoUrl };

//   imageQ.push(photoKey)

// generate response in parrallel
//   const generate = await aiResponse(photoUrl);

// convert image size in parrallel

// webscrape carousell for listing prices

// generate listing

// serve editable

// convert to json

// validate with zod

// post to db

// console.log();

//   ctx.reply(generate.choices[0].message.content);
//   ctx.replyWithPhoto(ctx.update.message.photo[1].file_id);
