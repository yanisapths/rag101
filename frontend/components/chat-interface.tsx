"use client";

import { useRef, useEffect } from "react";
import { ChatInput, sendButtonVariants } from "@/components/chat-input";
import { useChat } from "@/hooks/use-chat";
import { Button } from "./ui/Button";
import { Code, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage, TypingIndicator } from "./chat-message";

const onboardingTags = [
  { icon: <Code size={14} />, message: "SQL query" },
  { icon: <FileText size={14} />, message: "API Spec" },
];

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <div className="max-w-6xl mx-auto py-6">
            {messages.map((message, i) => (
              <div key={message.id} className="msg-enter">
                <ChatMessage
                  message={message}
                  isStreaming={
                    status === "streaming" &&
                    i === messages.length - 1 &&
                    message.role === "assistant"
                  }
                />
              </div>
            ))}

            {/* Typing indicator while waiting for first token */}
            {status === "submitted" && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 msg-enter">
            <h1 className="text-3xl font-light text-muted-foreground/30 mb-12">
              What shall we think through?
            </h1>

            <div className="w-full max-w-3xl mb-12">
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>

            <div className="flex gap-2">
              {onboardingTags.map((tag, i) => (
                <AnimatePresence key={i}>
                  <motion.div
                    variants={sendButtonVariants}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleSend(tag.message)}
                    >
                      {tag.icon}
                      {tag.message}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          </div>
        )}
      </main>

      {hasMessages && (
        <div className="bg-background/50 backdrop-blur-sm p-4 msg-enter">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="Write a message..."
          />
        </div>
      )}
    </div>
  );
}
