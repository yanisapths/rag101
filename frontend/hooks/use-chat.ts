/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { UIMessage, UIPart } from "@/components/chat-message";

type Status = "idle" | "submitted" | "streaming" | "error";
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useChat = () => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const sendMessage = async ({ text }: { text: string }) => {
    const userMessage: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text }],
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setStatus("submitted");

    try {
      const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      const assistantId = crypto.randomUUID();

      const payload = json.data ?? json;
      const type: string = json.type ?? payload.type ?? "text";

      let part: UIPart;

      if (type === "sql") {
        part = {
          type: "sql",
          text: payload.sql ?? "",
          query: payload.sql ?? "",
          reasoning: payload.reasoning ?? "",
        } as UIPart;
      } else if (type === "api_spec") {
        part = {
          type: "api_spec",
          text: "",
          title: payload.title ?? "",
          version: payload.version ?? "",
          method: (payload.method ?? "GET").toUpperCase(),
          endpoint: payload.endpoint ?? "",
          description: payload.description ?? "",
          auth: payload.auth ?? "",
          parameters: payload.parameters ?? [],
          responses: payload.responses ?? {},
          componentSchemas: payload.componentSchemas ?? {},
          notes: payload.notes ?? [],
        } as UIPart;
      } else {
        part = {
          type: "text",
          text:
            typeof payload.text === "string"
              ? payload.text
              : JSON.stringify(payload, null, 2),
        } as UIPart;
      }

      setStatus("streaming");

      if (part.type === "text" && part.text) {
        const words = part.text.split(" ");
        for (let i = 0; i < words.length; i++) {
          setMessages([
            ...nextMessages,
            {
              id: assistantId,
              role: "assistant",
              parts: [{ ...part, text: words.slice(0, i + 1).join(" ") }],
            },
          ]);
          await sleep(20);
        }
      } else {
        setMessages([
          ...nextMessages,
          { id: assistantId, role: "assistant", parts: [part] },
        ]);
      }

      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return { messages, sendMessage, status };
};
