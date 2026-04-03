"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 shadow-sm pt-1">
          {/* AI avatar */}
          <span className="text-xs font-bold -mt-1">AI</span>
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl",
          isUser
            ? "bg-zinc-900 text-white rounded-br-sm dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-white text-zinc-900 border border-zinc-200 shadow-sm rounded-bl-sm dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
            {content}
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert prose-zinc max-w-none 
                          prose-headings:mt-4 prose-headings:font-bold prose-headings:mb-2 
                          prose-h3:text-lg prose-p:leading-relaxed prose-p:mb-2 
                          prose-ul:my-2 prose-li:my-1 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-3 shadow-sm pt-1">
          <span className="text-xs font-bold tracking-tight -mt-1">US</span>
        </div>
      )}
    </div>
  );
}
