import { openaiClient } from "@/openai/openaiClient";

const aiImageQuery = async (photo: string) => {
  const res = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "name = Tell me what is this item. (Max 15 Chars)",
          },
          {
            type: "text",
            text: "desc = Give me a short description of this item. (Max 100 Chars)",
          },
          {
            type: "text",
            text: "price = I no long want it, estimate how much i should sell this for in Singapore. (Max 15 Chars)",
          },
          {
            type: "text",
            text: "reason = Give me the reasoning as well. (Max 100 Chars)",
          },
          {
            type: "image_url",
            image_url: {
              url: photo,
            },
          },
          {
            type: "text",
            text: "Please return the response in the following format using a pipe | as a delimiter: field1|field2|field3|field4. The fields are: name, desc, price, reason.",
          },
        ],
      },
    ],
    temperature: 0.7,
  });

  return res;
};

export { aiImageQuery };
