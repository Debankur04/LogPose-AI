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
      <div className="max-w-3xl mx-auto relative flex items-end shadow-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full max-h-50 bg-transparent resize-none overflow-y-auto px-5 py-4 focus:outline-none text-slate-100 placeholder:text-slate-500 text-[15px]"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2">
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className="h-10 w-10 rounded-full transition-all bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 disabled:bg-slate-700 disabled:text-slate-300"
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
