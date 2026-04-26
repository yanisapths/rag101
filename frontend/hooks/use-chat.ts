import { useState } from "react";
import { UIMessage } from "@/service/api";

type Status = "idle" | "submitted" | "streaming" | "error";

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
      const apiBase = process.env.NEXT_PUBLIC_API;
      if (!apiBase) throw new Error("Missing NEXT_PUBLIC_API");

      const url = new URL("/api/chat", apiBase).toString();

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      setMessages((prev) => [...prev, data.message]);
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
