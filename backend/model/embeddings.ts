import { OllamaEmbeddings } from "@langchain/ollama";

export const embeddings = new OllamaEmbeddings({
  model: process.env.OLLAMA_EMBED_MODEL,
  baseUrl: process.env.OLLAMA_URL,
});
