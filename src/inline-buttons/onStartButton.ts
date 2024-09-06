export const onStart = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Buy!",
          callback_data: "buy",
        },
        {
          text: "Sell!",
          callback_data: "sell",
        },
        {
          text: "Manage!",
          callback_data: "manage",
        },
      ],
    ],
  },
};

export const testKB = {
  reply_keyboard_markup: {
    keyboard: [
      [
        {
          text: "Instant Sell",
        },
        {
          text: "Price Match",
          callback_data: "sell",
        },
        {
          text: "Manage!",
          callback_data: "manage",
        },
      ],
    ],
  },
};
