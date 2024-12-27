import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  async *chatStream(content, history) {
    const result = await openai.chat.completions.create({
      model: this.#model,
      messages: [...history, { role: "user", content }],
      stream: true,
    });

    for await (const response of result) {
      yield response.choices[0].delta?.content || "";
    }
  }
}
