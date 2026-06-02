"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_email", email);
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        const successMessage = "Login successful!";
        toast.success(successMessage);
        router.push("/chat");
      } else {
        const errorMessage = data.error || data.detail || "Login failed. Please check your credentials.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "An error occurred connecting to the server.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async () => {
    const provider = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDER || "google";
    const redirectTo = `${window.location.origin}/auth/callback`;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#02060d] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 rounded-3xl bg-slate-950 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] border border-slate-800"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-slate-200 bg-clip-text text-transparent">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Enter your secure credentials to access your travel AI.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className='text-slate-950 caret-black'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password" >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className='text-slate-950 caret-black placeholder:text-slate-500 pr-10'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-black hover:text-slate-700 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-center text-red-500">{error}</div>}

          <Button type="submit" className="w-full bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-semibold shadow-lg transition-all" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="mt-4">
            <Button type="button" onClick={handleOAuth} className="w-full bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-slate-950 font-semibold shadow-lg">
              Continue with OAuth Provider
            </Button>
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
