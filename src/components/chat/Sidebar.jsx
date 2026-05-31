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
      className="h-full flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 relative z-20 shrink-0 origin-left"
    >
      <div className="flex h-14 items-center justify-between px-3 border-b border-slate-800">
        {isOpen && (
          <Button
            variant="ghost"
            className="flex-1 justify-start overflow-hidden whitespace-nowrap px-2 font-semibold text-cyan-300 hover:text-cyan-200"
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
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} title="Close Sidebar" className="ml-1 shrink-0 text-cyan-300 hover:text-cyan-200">
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        )}
      </div>

      {!isOpen && (
        <div className="flex justify-center p-3">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} title="Open Sidebar" className="text-cyan-300 hover:text-cyan-200">
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
                ? "bg-slate-900 text-cyan-200 font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"
            )}
            title={convo.title}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
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
