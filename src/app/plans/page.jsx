"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { getAuthSession } from "@/lib/supabaseClient";

const FALLBACK_PLANS = [
  {
    tier: "pirate",
    name: "Pirate",
    description: "Perfect for getting started and learning the ropes.",
    features: ["15 messages per week", "Standard AI models"],
  },
  {
    tier: "warlord",
    name: "Warlord",
    description: "For the serious navigator needing consistent power.",
    features: ["50 messages per week", "Advanced AI models", "Priority support"],
    prices: [{ currency: "INR", unit_amount: 9900, interval: "month", region: "IN", type: "recurring" }],
  },
  {
    tier: "emperor",
    name: "Emperor",
    description: "Enterprise solutions for large fleets and organizations.",
    features: ["Custom message limits", "Dedicated account manager", "Custom integrations"],
  },
];

const formatPrice = (price) => {
  if (!price) return "Custom";
  const amount = (price.unit_amount || 0) / 100;
  const formatted = new Intl.NumberFormat(price.currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: price.currency || "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  return price.interval ? `${formatted}/${price.interval}` : formatted;
};

const pickDisplayPrice = (product) => {
  const prices = product?.prices || [];
  return (
    prices.find((price) => price.region === "IN" && price.type === "recurring") ||
    prices.find((price) => price.region === "IN") ||
    prices[0]
  );
};

export default function PlansPage() {
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [loadingTier, setLoadingTier] = useState("");

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const res = await apiClient("/billing/elixpo/catalog");
        if (!res.ok) return;
        const data = await res.json();
        setCatalogProducts(data.products || data.data?.products || []);
      } catch {
        // The static fallback keeps pricing readable if the public catalog is temporarily unavailable.
      }
    };
    loadCatalog();
  }, []);

  const plans = useMemo(() => {
    return FALLBACK_PLANS.map((fallback) => {
      const live = catalogProducts.find((product) => product.tier === fallback.tier);
      return { ...fallback, ...live, features: fallback.features };
    });
  }, [catalogProducts]);

  const startCheckout = async (tier) => {
    setStatus("");
    setLoadingTier(tier);
    try {
      const session = await getAuthSession();
      if (!session?.userId) {
        window.location.href = "/login";
        return;
      }

      const res = await apiClient("/billing/elixpo/checkout", {
        method: "POST",
        body: JSON.stringify({ user_id: session.userId, tier, region: "IN", recurring: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkout_url) throw new Error(data.detail || "Unable to start checkout");
      window.location.href = data.checkout_url;
    } catch (error) {
      setStatus(error.message || "Unable to start checkout");
    } finally {
      setLoadingTier("");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Pricing Plans</h2>
          <p className="mt-2 text-4xl leading-10 font-extrabold text-white sm:text-5xl">
            Choose your journey with LogPose AI
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted mx-auto">
            Plans are rendered from the live Elixpo Pay catalog.
          </p>
          {status && <p className="mt-4 text-sm text-rose-300">{status}</p>}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = pickDisplayPrice(plan);
            const isPaid = plan.tier !== "pirate";
            const isFeatured = plan.tier === "warlord";
            return (
              <div
                key={plan.tier}
                className={`relative flex flex-col rounded-lg border bg-panel p-8 shadow-sm transition-colors ${
                  isFeatured ? "border-accent shadow-xl md:-translate-y-4" : "border-muted/20 hover:border-accent/50"
                }`}
              >
                {isFeatured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase text-white">
                    Most Popular
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
                    {plan.tier === "pirate" ? "Free" : formatPrice(price)}
                  </p>
                  <p className="mt-6 text-muted">{plan.description}</p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-gray-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isPaid ? (
                  <button
                    onClick={() => startCheckout(plan.tier)}
                    disabled={loadingTier === plan.tier}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-accent px-6 py-3 text-center font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
                  >
                    {plan.tier === "emperor" ? <Sparkles className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    {loadingTier === plan.tier ? "Opening..." : plan.tier === "emperor" ? "Request Emperor" : "Buy Warlord"}
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    className="mt-8 flex w-full items-center justify-center rounded-md border border-accent px-6 py-3 text-center font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                  >
                    Start Free
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
