import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "cheerio"; // web scraping library, html transformation
import { vectorStore } from "./model/datastore";
import { agent } from "./model/rag-agent";

const indexing = async () => {
  // 1. load
  const pTagSelector = "p";
  const cheerioloader = new CheerioWebBaseLoader(
    "https://lilianweng.github.io/posts/2023-06-23-agent/",
    {
      selector: pTagSelector,
    },
  );
  const docs = await cheerioloader.load();

  // 2. split
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const allSplits = await splitter.splitDocuments(docs);
  console.log("Total splits:", allSplits.length);
  console.log("First split length:", allSplits[0]?.pageContent.length);

  // 3. embedding and store
  try {
    await vectorStore.addDocuments(allSplits);
    console.log("✅ Documents sent to vector store");
  } catch (err) {
    console.error("❌ addDocuments failed:", err);
  }
};

const chat = async () => {
  let inputMessage = `What is Task Decomposition?`;

  let agentInputs = { messages: [{ role: "user", content: inputMessage }] };

  for await (const step of await agent.stream(agentInputs, {
    streamMode: "values",
  })) {
    const lastMessage = step.messages[step.messages.length - 1];
    console.log(lastMessage);
    console.log("-----\n");
  }
};

chat();
