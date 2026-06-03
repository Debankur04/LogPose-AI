"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { persistAuthSession, supabase } from "@/lib/supabaseClient";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchange = async () => {
      try {
        let sessionData = null;
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            toast.error(error.message || "OAuth callback failed.");
            setLoading(false);
            return;
          }

          sessionData = data?.session || null;
        }
        
        const { data, error } = sessionData
          ? { data: null, error: null }
          : await supabase.auth.getSession();

        if (error) {
          toast.error(error.message || "OAuth callback failed.");
          setLoading(false);
          return;
        }

        if (data?.session) {
          sessionData = data.session;
        } else {
          // If no session is immediately available, check for auth state change
          // because parsing the hash could be asynchronous
          let authSubscription = null;
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              persistAuthSession(session);
              
              toast.success("Logged in via OAuth");
              authSubscription?.unsubscribe();
              router.push("/chat");
            }
          });
          authSubscription = authListener.subscription;
          
          // Wait a moment to see if it resolves, but usually getSession() works if hash is present
          // For safety, we will just return here if we added the listener, 
          // or we can just proceed.
        }

        if (sessionData) {
          persistAuthSession(sessionData);

          toast.success("Logged in via OAuth");
          router.push("/chat");
          return;
        }
        
        // If we reach here and there is a hash, the listener might pick it up.
        // Otherwise, it's a failure.
        // We won't show an error immediately if there's a hash, to give the listener a chance.
        if (!window.location.hash && !code) {
          toast.error("OAuth callback did not return a valid session.");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        toast.error("Error completing OAuth callback.");
      } finally {
        // We don't stop loading if we might still be waiting for the listener
        if (!window.location.hash) {
          setLoading(false);
        }
      }
    };

    exchange();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#02060d] px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-slate-950 p-10 shadow-lg border border-slate-800 text-center">
        {loading ? <p className="text-slate-200">Completing OAuth sign-in…</p> : <p className="text-red-400">OAuth failed. Check console and server logs.</p>}
      </div>
    </div>
  );
}
