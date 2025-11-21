import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

// Initialize the client with the API key from the environment
// Note: process.env.API_KEY is expected to be injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export class GeminiService {
  private chatSession: Chat | null = null;

  constructor() {
    this.startNewChat();
  }

  public startNewChat() {
    this.chatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "You are a helpful, concise, and friendly AI assistant. You use Markdown to format your responses for better readability.",
      },
    });
  }

  public async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.chatSession) {
      this.startNewChat();
    }

    if (!this.chatSession) {
      throw new Error("Failed to initialize chat session.");
    }

    try {
      const result = await this.chatSession.sendMessageStream({ message });

      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
          yield responseChunk.text;
        }
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
