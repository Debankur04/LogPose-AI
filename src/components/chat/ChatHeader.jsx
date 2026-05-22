"use client";

import { Settings, PanelLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatHeader({ activeTitle, onToggleSidebar, isSidebarOpen, onSignOut }) {
  return (
    <header className="flex h-14 items-center justify-between bg-white dark:bg-zinc-900 px-4 border-b border-orange-200 dark:border-orange-700 z-10 w-full relative shadow-sm">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-zinc-500 dark:text-zinc-400 md:hidden">
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate max-w-[200px] sm:max-w-md">
          {activeTitle || "Select a conversation"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/preferences">
          <Button variant="ghost" size="icon" title="Preferences" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 bg-orange-100 dark:bg-orange-900/40 hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          title="Sign out"
          onClick={onSignOut}
          className="text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
