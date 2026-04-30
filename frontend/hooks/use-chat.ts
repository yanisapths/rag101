import { useState } from "react";
import { UIMessage } from "@/service/api";

type Status = "idle" | "submitted" | "streaming" | "error";
const MOCK_RESPONSE =
  "This is a mock response from the assistant. It streams in word by word to simulate a real API response with a natural typing feel.";

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

    // try {
    //   const apiBase = process.env.NEXT_PUBLIC_API;
    //   if (!apiBase) throw new Error("Missing NEXT_PUBLIC_API");

    //   real
    //   const url = new URL("/api/chat", apiBase).toString();

    //   const res = await fetch(url, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ messages: nextMessages }),
    //   });

    //   if (!res.ok) throw new Error("API error");

    //   const data = await res.json();

    //   setMessages((prev) => [...prev, data.message]);
    //   setStatus("idle");
    // } catch (err) {
    //   console.error(err);
    //   setStatus("error");
    // }
    try {
      // 1s delay before streaming starts
      await sleep(1000);

      const assistantId = crypto.randomUUID();
      const words = MOCK_RESPONSE.split(" ");

      setStatus("streaming");

      for (let i = 0; i < words.length; i++) {
        const partial = words.slice(0, i + 1).join(" ");
        setMessages([
          ...nextMessages,
          {
            id: assistantId,
            role: "assistant",
            parts: [{ type: "text", text: partial }],
          },
        ]);
        await sleep(60);
      }

      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return {
    messages,
    sendMessage,
    status,
  };
};
