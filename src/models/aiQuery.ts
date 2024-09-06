interface MessageContentText {
    type: string;
    text: string;
  }
  
  interface MessageContentImage {
    type: string;
    image_url: {
      url: string;
    };
  }
  
  type MessageContent = MessageContentText | MessageContentImage;
  
  interface Message {
    role: "user" | "system" | "assistant";
    content: MessageContent[];
  }
  
  interface GPTRequest {
    model: string;
    messages: Message[];
    temperature: number;
  }
  


  
  {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `tell me what is this item, how much does it cost and how much i should sell it for. just an estimate is needed provide reasoning as well.`,
          },
          {
            type: "image_url",
            image_url: {
              url: photo,
            },
          },
        ],
      },
    ],
    temperature: 0.7,
  }