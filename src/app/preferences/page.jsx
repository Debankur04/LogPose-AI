"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/apiClient";

// Safely parse a FastAPI error response into a plain string
const parseError = (data) => {
  if (!data) return "Something went wrong";
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) return data.detail[0]?.msg || "Validation error";
  if (typeof data.detail === "object") return JSON.stringify(data.detail);
  return "Something went wrong";
};

// Default empty dietary object
const DEFAULT_DIETARY = { budget: "", food_type: "" };

export default function PreferencesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  // dietary_preference is always a dict / JS object
  const [dietary, setDietary] = useState(DEFAULT_DIETARY);
  const [customPref, setCustomPref] = useState("");

  // Extra key-value pairs the user may add
  const [extraKeys, setExtraKeys] = useState([]);

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ─── INIT ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("user_id");
    if (!stored) { router.push("/login"); return; }
    setUserId(stored);
    fetchPreferences(stored);
  }, [router]);

  // ─── FETCH ───────────────────────────────────────────────────────────────────
  const fetchPreferences = async (uid) => {
    setIsFetching(true);
    try {
      const res = await apiClient(`/see_preference`, {
        method: "POST",
        body: JSON.stringify({ user_id: uid }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(parseError(err));
      }

      const data = await res.json();
      const prefs = Array.isArray(data) ? data[0] : data;

      if (prefs && (prefs.dietary_preference || prefs.custom_preference)) {
        // dietary_preference comes back as an object from Supabase
        const diet = prefs.dietary_preference || {};
        const { budget = "", food_type = "", ...rest } = typeof diet === "object" ? diet : {};

        setDietary({ budget, food_type });

        // Put any extra keys the user saved previously into the extra rows
        setExtraKeys(Object.entries(rest).map(([k, v]) => ({ key: k, value: v })));

        setCustomPref(prefs.custom_preference || "");
        setIsExisting(true);
      } else {
        setIsExisting(false);
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to load preferences" });
    } finally {
      setIsFetching(false);
    }
  };

  // ─── BUILD PAYLOAD ───────────────────────────────────────────────────────────
  const buildDietaryObject = () => {
    const obj = {};
    if (dietary.budget.trim())    obj.budget    = dietary.budget.trim();
    if (dietary.food_type.trim()) obj.food_type = dietary.food_type.trim();
    extraKeys.forEach(({ key, value }) => {
      if (key.trim()) obj[key.trim()] = value.trim();
    });
    return obj;
  };

  // ─── SAVE ────────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    const dietObj = buildDietaryObject();

    if (Object.keys(dietObj).length === 0 && !customPref.trim()) {
      setStatus({ type: "error", message: "Please add at least one preference." });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const endpoint = isExisting ? "/edit_preference" : "/add_preference";
    try {
      const res = await apiClient(endpoint, {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          dietary_preference: dietObj,
          custom_preference: customPref,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(parseError(data));

      setIsExisting(true);
      setStatus({
        type: "success",
        message: `✅ Preferences ${isExisting ? "updated" : "saved"} successfully!`,
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to save" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── DELETE ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await apiClient(`/delete_preference`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(parseError(data));

      // Reset UI
      setDietary(DEFAULT_DIETARY);
      setExtraKeys([]);
      setCustomPref("");
      setIsExisting(false);
      setShowDeleteConfirm(false);
      setStatus({ type: "success", message: "✅ Preferences deleted." });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to delete" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── EXTRA KEY HELPERS ───────────────────────────────────────────────────────
  const addExtraKey = () => setExtraKeys((prev) => [...prev, { key: "", value: "" }]);
  const updateExtraKey = (idx, field, val) =>
    setExtraKeys((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: val } : e)));
  const removeExtraKey = (idx) =>
    setExtraKeys((prev) => prev.filter((_, i) => i !== idx));

  // ─── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Settings &amp; Preferences</h1>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Travel Profile</h2>
            {isExisting && !isFetching && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                Delete Preferences
              </Button>
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Help the AI tailor better itineraries for you. Your dietary preferences are saved as structured data.
          </p>

          {/* Delete confirm banner */}
          {showDeleteConfirm && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                Are you sure? This will permanently delete all your preferences.
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border-zinc-300 dark:border-zinc-700 text-black"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isLoading ? "Deleting…" : "Yes, Delete"}
                </Button>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {isFetching ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 rounded-md bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-10 rounded-md bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-20 rounded-md bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">

              {/* ── Dietary preferences (structured) ── */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Dietary / Travel Preferences
                </legend>

                {/* Budget */}
                <div className="flex gap-3 items-center">
                  <span className="w-28 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">Budget</span>
                  <input
                    className="flex-1 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    placeholder="e.g. cheap, mid-range, luxury"
                    value={dietary.budget}
                    onChange={(e) => setDietary((prev) => ({ ...prev, budget: e.target.value }))}
                  />
                </div>

                {/* Food type */}
                <div className="flex gap-3 items-center">
                  <span className="w-28 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">Food type</span>
                  <input
                    className="flex-1 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    placeholder="e.g. street food, vegetarian, halal"
                    value={dietary.food_type}
                    onChange={(e) => setDietary((prev) => ({ ...prev, food_type: e.target.value }))}
                  />
                </div>

                {/* Dynamic extra keys */}
                <AnimatePresence>
                {extraKeys.map((entry, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex gap-3 items-center"
                  >
                    <input
                      className="w-28 shrink-0 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                      placeholder="key"
                      value={entry.key}
                      onChange={(e) => updateExtraKey(idx, "key", e.target.value)}
                    />
                    <input
                      className="flex-1 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                      placeholder="value"
                      value={entry.value}
                      onChange={(e) => updateExtraKey(idx, "value", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraKey(idx)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
                </AnimatePresence>

                {/* Add field button */}
                <button
                  type="button"
                  onClick={addExtraKey}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add custom field
                </button>
              </fieldset>

              {/* ── Additional details ── */}
              <div className="space-y-2">
                <label htmlFor="custom" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Additional Details (interests, accessibility…)
                </label>
                <textarea
                  id="custom"
                  className="w-full border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm min-h-[100px] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 resize-y"
                  placeholder="e.g. I love museums, need wheelchair-accessible routes…"
                  value={customPref}
                  onChange={(e) => setCustomPref(e.target.value)}
                />
              </div>

              {/* Status banner */}
              {status.message && (
                <div className={`p-3 rounded-md text-sm transition-all ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {status.message}
                </div>
              )}

              {/* Save button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="gap-2 min-w-[160px]">
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isExisting ? "Update Preferences" : "Save Preferences"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}