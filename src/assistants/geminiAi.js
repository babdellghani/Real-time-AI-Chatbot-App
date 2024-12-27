import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export class Assistant {
  #chat;

  constructor(model = "gemini-1.5-flash") {
    const gemini = genAI.getGenerativeModel({ model });
    this.#chat = gemini.startChat({ history: [] });
  }

  async *chatStream(content) {
    const result = await this.#chat.sendMessageStream(content);
    for await (const response of result.stream) {
      yield response.text();
    }
  }
}
