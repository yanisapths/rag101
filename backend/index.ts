import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "cheerio"; // web scraping library, html transformation
import { vectorStore } from "./model/datastore";
import { runAgentChat } from "./model/agent-chat";
import express from "express";

export const indexing = async () => {
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

export const chat = async ({ inputMessage }: { inputMessage: string }) => {
  const reply = await runAgentChat([{ role: "user", content: inputMessage }]);
  console.log(reply);
};

type UIMessage = {
  id: string;
  role: "user" | "assistant";
  parts: { type: "text"; text: string }[];
};

export function createApp() {
  const app = express();

  const allowedOrigins = new Set(
    (process.env.CORS_ORIGINS ?? "http://localhost:3000")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] ??
        "Content-Type, Authorization",
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages }: { messages: UIMessage[] } = req.body ?? {};
      if (!Array.isArray(messages)) {
        return res.status(400).send("Invalid request");
      }

      const agentMessages = messages.map((m) => ({
        role:
          m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: Array.isArray(m.parts)
          ? m.parts.map((p) => p.text).join("")
          : "",
      }));

      const replyText = await runAgentChat(agentMessages);
      const response: UIMessage = {
        id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
        role: "assistant",
        parts: [{ type: "text", text: replyText }],
      };

      return res.json({ message: response });
    } catch {
      return res.status(400).send("Invalid request");
    }
  });

  // Optional: trigger indexing via API when you want to build/update the store.
  app.post("/api/index", async (_req, res) => {
    try {
      await indexing();
      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ ok: false, error: String(err) });
    }
  });

  return app;
}

export async function startServer(port = Number(process.env.PORT ?? 3001)) {
  const app = createApp();
  return new Promise<void>((resolve) => {
    app.listen(port, () => {
      console.log(`Express API listening on http://localhost:${port}`);
      resolve();
    });
  });
}

if (import.meta.main) {
  await startServer();
}
