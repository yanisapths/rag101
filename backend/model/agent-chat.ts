import { agent } from "./rag-agent";

export type AgentChatMessage = { role: "user" | "assistant"; content: string };

function contentToText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          const t = (part as { text?: unknown }).text;
          return typeof t === "string" ? t : "";
        }
        return "";
      })
      .join("");
  }
  return "";
}

export async function runAgentChat(
  messages: AgentChatMessage[],
): Promise<string> {
  const agentInputs = { messages };

  let lastText = "";
  for await (const step of await agent.stream(agentInputs, {
    streamMode: "values",
  })) {
    const lastMessage = step.messages?.[step.messages.length - 1];
    lastText = contentToText(lastMessage?.content);
  }

  return lastText;
}
