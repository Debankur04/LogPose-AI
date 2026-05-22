"use client";

import { motion } from "framer-motion";
import { Plus, MessageSquare, PanelLeftClose, PanelLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar({
  isOpen,
  setIsOpen,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteChat
}) {
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 250 : 70 }}
      className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-r border-orange-200 dark:border-orange-700 transition-all duration-300 relative z-20 flex-shrink-0 origin-left"
    >
      <div className="flex h-14 items-center justify-between px-3 border-b border-orange-200 dark:border-orange-700">
        {isOpen && (
          <Button
            variant="ghost"
            className="flex-1 justify-start overflow-hidden whitespace-nowrap px-2 font-semibold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
            onClick={onNewChat}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        )}
        {!isOpen && (
          <Button variant="ghost" size="icon" onClick={onNewChat} title="New Chat" className="mx-auto">
            <Plus className="h-5 w-5" />
          </Button>
        )}
        {isOpen && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} title="Close Sidebar" className="ml-1 flex-shrink-0 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        )}
      </div>

      {!isOpen && (
        <div className="flex justify-center p-3">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} title="Open Sidebar" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full p-2 space-y-1">
        {conversations.map((convo) => (
          <button
            key={convo.id}
            onClick={() => onSelectConversation(convo.id)}
            className={cn(
              "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors group relative",
              activeConversationId === convo.id
                ? "bg-gradient-to-r from-orange-200 to-amber-100 dark:from-orange-700/60 dark:to-amber-700/60 text-orange-900 dark:text-orange-50 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-orange-100 dark:hover:bg-orange-800/30 hover:text-orange-700 dark:hover:text-orange-300"
            )}
            title={convo.title}
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="truncate flex-1 text-left">{convo.title}</span>
                <Trash2
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(convo.id);
                  }}
                />
              </>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
