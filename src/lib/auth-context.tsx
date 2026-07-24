"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      Promise.resolve().then(() => setIsLoading(false));
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Google only returns a refresh token on the very first consent, so
      // capture it here once and store it for the calendar-sync API route.
      if (session?.provider_refresh_token && session.user) {
        supabase
          ?.from("user_google_tokens")
          .upsert({ user_id: session.user.id, refresh_token: session.provider_refresh_token })
          .then(({ error }) => error && console.error("Failed to store Google token", error));
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(() => {
    supabase?.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        scopes: "https://www.googleapis.com/auth/calendar",
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }, []);

  const signOut = useCallback(() => {
    supabase?.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
