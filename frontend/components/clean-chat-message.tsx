/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIMessage } from "@/service/api";

interface ChatMessageProps {
  message: UIMessage;
}

function MessagePart({ part }: any) {
  // 🧠 CODE BLOCK
  if (part.type === "code") {
    return (
      <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
        <code>{part.text}</code>
      </pre>
    );
  }

  // 🧠 TEXT (with line breaks)
  if (part.type === "text") {
    return part.text.split("\n").map((line: string, i: number) => (
      <p key={i} className={cn("mb-2 last:mb-0", !line && "h-4")}>
        {line}
      </p>
    ));
  }

  return null;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {/* 🤖 Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      {/* 💬 Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 space-y-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-card-foreground",
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.parts?.map((part, i) => (
            <MessagePart key={i} part={part} />
          ))}
        </div>
      </div>

      {/* 👤 User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
