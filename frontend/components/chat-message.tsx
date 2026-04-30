"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIMessage } from "@/service/api";

interface ChatMessageProps {
  message: UIMessage;
}

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-card-foreground",
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {text.split("\n").map((line, i) => (
            <p key={i} className={cn("mb-2 last:mb-0", !line && "h-4")}>
              {line}
            </p>
          ))}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
