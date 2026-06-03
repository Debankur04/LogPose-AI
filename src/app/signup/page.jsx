"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const authInputClass =
  "auth-field !text-slate-950 !caret-slate-950 placeholder:!text-slate-400 selection:!bg-cyan-200 selection:!text-slate-950";

const authPasswordInputClass = `${authInputClass} pr-10`;
const authConfirmPasswordInputClass = `${authInputClass} pr-14`;
const passwordToggleClass =
  "absolute right-3 top-1/2 -translate-y-1/2 text-slate-950 hover:text-slate-700 transition-colors";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      const errorMessage = "Passwords do not match. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage = "Signup successful! Check your email for confirmation mail.";
        setMessage(successMessage);
        toast.success(successMessage);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorMessage = data.detail || data.error || "Signup failed. Please try again.";
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = "An error occurred connecting to the server.";
      setMessage(errorMessage);
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
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-slate-200 bg-clip-text text-transparent">Create an account</h2>
          <p className="mt-2 text-sm text-slate-400">Join LogPose and unlock smarter travel planning.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className={authInputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={authPasswordInputClass}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={passwordToggleClass}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="text-slate-950" size={18} /> : <Eye className="text-slate-950" size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${authConfirmPasswordInputClass} ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}`}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={passwordToggleClass}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="text-slate-950" size={18} /> : <Eye className="text-slate-950" size={18} />}
                </button>
                {password && confirmPassword && password !== confirmPassword && (
                  <AlertCircle className="absolute right-10 top-3 text-red-500" size={18} />
                )}
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <Button type="submit" className="w-full bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-semibold shadow-lg transition-all" disabled={loading || (password && confirmPassword && password !== confirmPassword)}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <div className="mt-4">
            <Button type="button" onClick={handleOAuth} className="w-full bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-slate-950 font-semibold shadow-lg">
              Continue with OAuth Provider
            </Button>
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
