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
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          toast.error(error.message || "OAuth callback failed.");
          setLoading(false);
          return;
        }

        if (data?.session) {
          const session = data.session;
          if (session.access_token) {
            localStorage.setItem("access_token", session.access_token);
          }
          if (session.refresh_token) {
            localStorage.setItem("refresh_token", session.refresh_token);
          }
          if (session.user?.id) {
            localStorage.setItem("user_id", session.user.id);
          }
          if (session.user?.email) {
            localStorage.setItem("user_email", session.user.email);
          }

          toast.success("Logged in via OAuth");
          router.push("/chat");
          return;
        }

        toast.error("OAuth callback did not return a valid session.");
      } catch (err) {
        toast.error("Error completing OAuth callback.");
      } finally {
        setLoading(false);
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
