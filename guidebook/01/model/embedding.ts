import { OllamaEmbeddings } from "@langchain/ollama";

export const embeddingModel = new OllamaEmbeddings({
  model: "nomic-embed-text",
});
