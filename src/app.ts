import "tsconfig-paths/register";
import { tgBotClient } from "@/grammy/grammyClient";
import { botHandleImage } from "@/grammy/grammyResponse/botHandleImage";
import { botHandleStart } from "@/grammy/grammyResponse/botHandleStart";
import { botHandleCallback } from "@/grammy/grammyResponse/botHandleCallback";

botHandleStart();
botHandleImage();
botHandleCallback();
tgBotClient.start();
