export const startMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Manage Listings",
          callback_data: "manage",
        },
      ],
    ],
  },
};

export const imageMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Buy",
          callback_data: "user_buy",
        },
        {
          text: "Sell",
          callback_data: "user_sell",
        },
      ],
    ],
  },
};

export const appListingDraft = (userId: number) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "View",
            web_app: {
              url: `https://freemarket-web-z5lr.vercel.app/listing/draft?id=${userId}`,
            },
          },
        ],
      ],
    },
  };
};

export const appListingSearch = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Search Results",
            web_app: {
              url: `www.google.com`,
            },
          },
        ],
      ],
    },
  };
};

// export const mainMenu = {
//   reply_keyboard_markup: {
//     keyboard: [
//       [
//         {
//           text: "Instant Sell",
//         },
//         {
//           text: "Price Match",
//         },
//         {
//           text: "Manage!",
//           callback_data: "manage",
//         },
//       ],
//     ],
//   },
// };
