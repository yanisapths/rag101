import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";

export const chatModel = new ChatOllama({
  model: "qwen3.5",
});

export const chatAgent = createAgent({ model: chatModel });
