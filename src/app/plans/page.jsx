"use client";

import React from "react";
import Link from "next/link";

export default function PlansPage() {

  const buttonClass =
  "mt-8 w-full py-3 px-6 border rounded-md text-center font-medium transition-colors duration-300 flex items-center justify-center";

  const handleBuyWarlord = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/buy_warlord_plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: session.user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to purchase plan");
      }

      alert("Warlord plan request submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to submit Warlord request.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-base text-accent font-semibold tracking-wide uppercase">
            Pricing Plans
          </h2>

          <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-white sm:text-5xl">
            Choose your journey with LogPose AI
          </p>

          <p className="mt-4 max-w-2xl text-xl text-muted mx-auto">
            Whether you're exploring the basics or commanding a fleet, we have
            a tier designed for you.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Pirate */}
          <div className="relative p-8 bg-panel border border-muted/20 rounded-2xl shadow-sm flex flex-col hover:border-accent/50 transition-colors duration-300">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-white">Pirate</h3>

              <p className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">
                  Free
                </span>
              </p>

              <p className="mt-6 text-muted">
                Perfect for getting started and learning the ropes.
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    15 messages per week
                  </span>
                </li>

                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    Standard AI Models
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className={`${buttonClass} border-accent text-accent hover:bg-accent hover:text-white`}
            >
              Start Free
            </Link>
          </div>

          {/* Warlord */}
          <div className="relative p-8 bg-panel border border-accent rounded-2xl shadow-xl flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 py-1.5 px-4 bg-accent rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2 left-1/2 -translate-x-1/2">
              Most Popular
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-white">Warlord</h3>

              <p className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">
                  ₹99
                </span>

                <span className="ml-1 text-xl font-medium text-muted">
                  /month
                </span>
              </p>

              <p className="mt-6 text-muted">
                For the serious navigator needing consistent power.
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    50 messages per week
                  </span>
                </li>

                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    Advanced AI Models
                  </span>
                </li>

                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    Priority Support
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleBuyWarlord}
              className={`${buttonClass} border-accent text-accent hover:bg-accent hover:text-white`}
            >
              Buy Warlord
            </button>
          </div>

          {/* Emperor */}
          <div className="relative p-8 bg-panel border border-muted/20 rounded-2xl shadow-sm flex flex-col hover:border-accent/50 transition-colors duration-300">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-white">Emperor</h3>

              <p className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">
                  Custom
                </span>
              </p>

              <p className="mt-6 text-muted">
                Enterprise solutions for large fleets and organizations.
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    Custom message limits
                  </span>
                </li>

                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    Dedicated Account Manager
                  </span>
                </li>

                <li className="flex">
                  <span className="text-accent-2 mr-3">✓</span>
                  <span className="text-gray-300">
                    Custom Integrations
                  </span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:debankurdutta04@gmail.com?subject=LogPose Emperor Plan Inquiry"
              className={`${buttonClass} border-accent text-accent hover:bg-accent hover:text-white`}
            >
              Contact Sales
            </a>
          </div>
        </div>

        {/* Patreon */}
        <div className="mt-16 bg-panel border border-muted/20 rounded-2xl p-8 lg:p-12 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">
            Are you a Patreon Supporter?
          </h3>

          <p className="text-muted max-w-2xl mx-auto mb-8">
            Link your Patreon account to automatically unlock premium features
            and receive exclusive benefits directly in LogPose AI.
          </p>

          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#FF424D] hover:bg-[#e03a44] focus:outline-none transition-colors duration-300">
            Connect Patreon
          </button>
        </div>
      </div>
    </div>
  );
}