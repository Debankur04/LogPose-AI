"use client";

import { Settings, PanelLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatHeader({ activeTitle, onToggleSidebar, isSidebarOpen }) {
  return (
    <header className="flex h-14 items-center justify-between bg-white px-4 border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 z-10 w-full relative">
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
      <Link href="/preferences">
        <Button variant="ghost" size="icon" title="Preferences" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
          <Settings className="h-5 w-5" />
        </Button>
      </Link>
    </header>
  );
}
