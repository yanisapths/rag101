"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "./ui/Button";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const sendButtonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -15 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.4, rotate: -15 },
};

export function ChatInput({ onSend, isLoading, placeholder }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full ">
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-2xl border border-[#716D65]/20 bg-white shadow-[6px_2px_35px_rgba(0,0,0,0.05)] overflow-hidden">
          <textarea
            placeholder={placeholder ?? "How can I help you today?"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full min-h-[120px] resize-none border-0 bg-transparent outline-none ring-0 p-4 text-foreground placeholder:text-muted-foreground block"
            style={{ boxShadow: "none" }}
          />

          <AnimatePresence>
            {input && (
              <motion.div
                className="absolute bottom-3 right-3"
                variants={sendButtonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Button
                  variant="icon"
                  size="sm"
                  className="bg-pink-300 text-white hover:bg-pink-400 rounded-lg"
                >
                  <ArrowUp size={18} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
