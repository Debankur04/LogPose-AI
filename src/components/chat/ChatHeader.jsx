"use client";

import { Settings, PanelLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatHeader({ activeTitle, onToggleSidebar, isSidebarOpen, onSignOut }) {
  return (
    <header className="flex h-14 items-center justify-between bg-slate-950 px-4 border-b border-slate-800 z-10 w-full relative shadow-sm">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-slate-400 hover:text-cyan-300 md:hidden transition-colors">
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="font-semibold text-slate-100 truncate max-w-50 sm:max-w-md">
          {activeTitle || "Select a conversation"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/preferences">
          <Button variant="ghost" size="icon" title="Preferences" className="text-slate-200 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 transition-colors">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          title="Sign out"
          onClick={onSignOut}
          className="text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
