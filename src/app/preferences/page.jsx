"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function PreferencesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [dietary, setDietary] = useState("");
  const [customPref, setCustomPref] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      router.push("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      // Using add_preference for both create and update as defined in backend schema
      const response = await fetch(`${apiUrl}/add_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          dietary_preference: dietary,
          custom_preference: customPref,
        }),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Preferences saved successfully!" });
        setTimeout(() => setStatus({ type: "", message: "" }), 3000);
      } else {
        const data = await response.json();
        setStatus({ type: "error", message: data.detail || "Failed to save preferences." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Settings & Preferences</h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Travel Profile</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Help the AI agent tailor your itineraries perfectly by saving your preferences below.
          </p>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="dietary" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Dietary Preferences
              </label>
              <Input
                id="dietary"
                placeholder="e.g., Vegetarian, Vegan, Halal, No Peanuts"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="custom" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Additional Details (Interests, Accessibility)
              </label>
              <textarea
                id="custom"
                className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 min-h-[120px] resize-y"
                placeholder="e.g., I mostly enjoy visiting museums, I need wheelchair-accessible locations..."
                value={customPref}
                onChange={(e) => setCustomPref(e.target.value)}
              />
            </div>

            {status.message && (
              <div className={`p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {status.message}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? <span className="animate-spin truncate h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
