"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchange = async () => {
      try {
        let sessionData = null;
        
        // Supabase v2 handles PKCE code exchange or implicit flow parsing automatically 
        // in many cases, but if there's a code, we might need to exchange it manually 
        // if SSR was configured, or we can just get the session if the client already parsed it.
        const { data, error } = await supabase.auth.getSession();

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
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              if (session.access_token) localStorage.setItem("access_token", session.access_token);
              if (session.refresh_token) localStorage.setItem("refresh_token", session.refresh_token);
              if (session.user?.id) localStorage.setItem("user_id", session.user.id);
              if (session.user?.email) localStorage.setItem("user_email", session.user.email);
              
              toast.success("Logged in via OAuth");
              router.push("/chat");
            }
          });
          
          // Wait a moment to see if it resolves, but usually getSession() works if hash is present
          // For safety, we will just return here if we added the listener, 
          // or we can just proceed.
        }

        if (sessionData) {
          if (sessionData.access_token) {
            localStorage.setItem("access_token", sessionData.access_token);
          }
          if (sessionData.refresh_token) {
            localStorage.setItem("refresh_token", sessionData.refresh_token);
          }
          if (sessionData.user?.id) {
            localStorage.setItem("user_id", sessionData.user.id);
          }
          if (sessionData.user?.email) {
            localStorage.setItem("user_email", sessionData.user.email);
          }

          toast.success("Logged in via OAuth");
          router.push("/chat");
          return;
        }
        
        // If we reach here and there is a hash, the listener might pick it up.
        // Otherwise, it's a failure.
        // We won't show an error immediately if there's a hash, to give the listener a chance.
        if (!window.location.hash) {
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
