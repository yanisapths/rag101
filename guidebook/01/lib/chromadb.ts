import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddingModel } from "../model/embedding";

export const vectorStore = new Chroma(embeddingModel, {
  collectionName: process.env.CHROMA_COLLECTION,
  chromaCloudAPIKey: process.env.CHROMA_API_KEY,
  clientParams: {
    host: "api.trychroma.com",
    port: 8000,
    ssl: true,
    tenant: process.env.CHROMA_TENANT,
    database: process.env.CHROMA_DATABASE,
  },
});
