"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { isSupabaseConfigured } from "@/lib/supabase";
import { UserIcon } from "./icons";

export function AccountButton() {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isSupabaseConfigured || isLoading) return <div className="h-9 w-9 shrink-0" />;

  if (!user) {
    return (
      <button
        type="button"
        onClick={signInWithGoogle}
        aria-label="Увійти через Google, щоб зберігати задачі в хмарі"
        title="Увійти через Google"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand-muted shadow-card transition-all duration-200 active:scale-90"
      >
        <UserIcon className="h-4 w-4" />
      </button>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const label = (user.user_metadata?.full_name as string) || user.email || "";

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Акаунт"
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-dark text-white shadow-card transition-all duration-200 active:scale-90"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-condensed text-xs font-bold">
            {label.slice(0, 1).toUpperCase()}
          </span>
        )}
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute top-11 right-0 z-20 w-48 animate-fade-up rounded-md bg-brand-surface p-2 shadow-card-hover">
            <p className="truncate px-2 py-1 text-xs text-brand-muted">{label}</p>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-600 transition active:scale-95"
            >
              Вийти
            </button>
          </div>
        </>
      )}
    </div>
  );
}
