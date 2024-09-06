import { InlineKeyboard } from "grammy";

export const inlineKeyboard = new InlineKeyboard()
  .text("Buy", "switch_to_buy")
  .text("Sell", "switch_to_sell");

// if (ctx.callbackQuery.data === 'switch_to_reply') {
//     // Create a reply keyboard
//     const replyKeyboard = new Keyboard()
//       .text('Option 1')
//       .text('Option 2')
//       .row(); // creates a new row for the button
