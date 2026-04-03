"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-transparent w-full">
      <div className="max-w-3xl mx-auto relative flex items-end shadow-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-50">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full max-h-[200px] bg-transparent resize-none overflow-y-auto px-5 py-4 focus:outline-none text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 text-[15px]"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2">
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className="h-10 w-10 rounded-full transition-all"
            variant={text.trim() && !isLoading ? "default" : "secondary"}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-zinc-500">
        AI can make mistakes. Please verify important information.
      </div>
    </div>
  );
}
