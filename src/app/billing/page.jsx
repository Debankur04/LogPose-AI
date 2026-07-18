"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { getAuthSession } from "@/lib/supabaseClient";

const parseError = (data) => {
  if (!data) return "Something went wrong";
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) return data.detail[0]?.msg || "Validation error";
  if (typeof data.detail === "object") return JSON.stringify(data.detail);
  return "Something went wrong";
};

export default function BillingPage() {
  const [planStatus, setPlanStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isOpeningCheckout, setIsOpeningCheckout] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [isActivatingDemo, setIsActivatingDemo] = useState(false);

  const loadPlanStatus = async () => {
    const session = await getAuthSession();
    if (!session?.userId) {
      window.location.href = "/login";
      return null;
    }

    const res = await apiClient(`/quota/status?user_id=${encodeURIComponent(session.userId)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(parseError(data));
    setPlanStatus(data);
    return session;
  };

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true);
      try {
        await loadPlanStatus();
      } catch (error) {
        setStatus(error.message || "Failed to fetch billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const openElixpoCheckout = async () => {
    setIsOpeningCheckout(true);
    setStatus("");
    try {
      const session = await getAuthSession();
      if (!session?.userId) {
        window.location.href = "/login";
        return;
      }

      const res = await apiClient("/billing/elixpo/checkout", {
        method: "POST",
        body: JSON.stringify({ user_id: session.userId, tier: "warlord", region: "IN", recurring: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkout_url) throw new Error(parseError(data));
      window.location.href = data.checkout_url;
    } catch (error) {
      setStatus(error.message || "Unable to open Elixpo Pay checkout");
    } finally {
      setIsOpeningCheckout(false);
    }
  };

  const activateDemoWarlord = async () => {
    if (!demoCode.trim()) {
      setStatus("Enter the demo activation code.");
      return;
    }

    setIsActivatingDemo(true);
    setStatus("");
    try {
      const session = await getAuthSession();
      if (!session?.userId) {
        window.location.href = "/login";
        return;
      }

      const res = await apiClient("/billing/demo/activate-warlord", {
        method: "POST",
        body: JSON.stringify({ user_id: session.userId, activation_code: demoCode.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(parseError(data));
      setStatus(data.message || "Demo Warlord entitlement activated.");
      setDemoCode("");
      await loadPlanStatus();
    } catch (error) {
      setStatus(error.message || "Unable to activate demo entitlement");
    } finally {
      setIsActivatingDemo(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Billing &amp; Subscription</h1>
          <p className="mt-2 text-muted">Manage your plan through Elixpo Pay.</p>
          {status && <p className="mt-3 text-sm text-rose-300">{status}</p>}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-48 rounded-lg border border-muted/20 bg-panel" />
            <div className="h-40 rounded-lg border border-muted/20 bg-panel" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-muted/20 bg-panel p-6 shadow-lg md:flex-row md:items-center lg:p-8">
              <div>
                <h2 className="mb-2 text-xl font-semibold text-white">Current Plan</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-accent">{planStatus?.tier || "Pirate"}</span>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {planStatus?.billing_status || "free"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted">Weekly Usage</p>
                    <p className="text-lg font-medium text-white">
                      {planStatus?.used ?? 0}/{planStatus?.limit ?? 15}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Next Reset</p>
                    <p className="text-lg font-medium text-white">
                      {planStatus?.reset_at ? new Date(planStatus.reset_at).toLocaleDateString() : "Weekly"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto">
                <button
                  onClick={openElixpoCheckout}
                  disabled={isOpeningCheckout || planStatus?.tier === "Warlord"}
                  className="flex items-center justify-center gap-2 rounded-md border border-accent px-6 py-2 text-center font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
                >
                  <CreditCard className="h-4 w-4" />
                  {planStatus?.tier === "Warlord" ? "Warlord Active" : isOpeningCheckout ? "Opening..." : "Upgrade with Elixpo Pay"}
                </button>
                <Link
                  href="/plans"
                  className="flex items-center justify-center gap-2 rounded-md border border-muted/30 px-6 py-2 text-center font-medium text-slate-200 transition-colors hover:border-accent hover:text-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Plans
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-muted/20 bg-panel p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Invoices</h3>
              <p className="mt-2 text-sm text-muted">
                Elixpo Pay is the billing source of truth. Receipts and mandate details are available from the hosted payment flow.
              </p>
            </div>

            <div className="rounded-lg border border-muted/20 bg-panel p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Demo Entitlement</h3>
              <p className="mt-2 text-sm text-muted">
                For interviews and local demos, activate Warlord with a server-side demo code instead of processing a real payment.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="password"
                  value={demoCode}
                  onChange={(event) => setDemoCode(event.target.value)}
                  placeholder="Demo activation code"
                  className="min-h-10 flex-1 rounded-md border border-muted/30 bg-black/20 px-3 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={activateDemoWarlord}
                  disabled={isActivatingDemo}
                  className="rounded-md border border-accent px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
                >
                  {isActivatingDemo ? "Activating..." : "Activate Demo Warlord"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
