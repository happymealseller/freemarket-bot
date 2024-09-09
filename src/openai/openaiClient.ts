import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error(
    "Missing necessary environment variables for OpenAI connection."
  );
}

let openaiClient: OpenAI;

try {
  openaiClient = new OpenAI({
    apiKey: openaiKey,
  });
  console.log("Connected to OpenAI successfully");
} catch (err) {
  console.error("Failed to initialize OpenAI:", err);
}

export { openaiClient };
