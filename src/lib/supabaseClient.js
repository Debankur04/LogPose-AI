"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const setCookie = (name, value, maxAge = AUTH_COOKIE_MAX_AGE) => {
  if (typeof document === "undefined" || !value) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
};

const deleteCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const persistAuthSession = (session, fallbackEmail = "") => {
  if (typeof window === "undefined" || !session) return null;

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;
  const userId = session.user_id || session.user?.id;
  const userEmail = session.user_email || session.user?.email || fallbackEmail;

  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
    setCookie("access_token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  if (userId) {
    localStorage.setItem("user_id", userId);
  }

  if (userEmail) {
    localStorage.setItem("user_email", userEmail);
  }

  return { accessToken, refreshToken, userId, userEmail };
};

export const clearAuthSession = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
  }

  deleteCookie("access_token");

  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase sign-out failed.", err);
  }
};

export const getStoredAuthSession = () => {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const userId = localStorage.getItem("user_id");
  const userEmail = localStorage.getItem("user_email");

  if (!accessToken && !refreshToken && !userId) return null;

  if (accessToken) {
    setCookie("access_token", accessToken);
  }

  return { accessToken, refreshToken, userId, userEmail };
};

export const getSupabaseAuthSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.warn("Could not read Supabase auth session.", error);
    return null;
  }

  return data?.session ? persistAuthSession(data.session) : null;
};

export const getAuthSession = async () => {
  const stored = getStoredAuthSession();

  if (stored?.accessToken) {
    return stored;
  }

  return getSupabaseAuthSession();
};
