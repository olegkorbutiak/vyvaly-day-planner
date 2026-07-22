"use client";

import { useSyncExternalStore } from "react";
import { BellIcon } from "./icons";

function getPermission(): NotificationPermission | "unsupported" {
  return "Notification" in window ? Notification.permission : "unsupported";
}

function subscribe(onChange: () => void) {
  if (!("permissions" in navigator)) return () => {};
  let status: PermissionStatus | null = null;
  navigator.permissions
    .query({ name: "notifications" as PermissionName })
    .then((s) => {
      status = s;
      s.addEventListener("change", onChange);
      onChange();
    })
    .catch(() => {});
  return () => status?.removeEventListener("change", onChange);
}

export function NotificationBanner() {
  const permission = useSyncExternalStore(subscribe, getPermission, () => "unsupported" as const);

  if (permission !== "default") return null;

  return (
    <button
      type="button"
      onClick={() => Notification.requestPermission()}
      className="mb-3 flex w-full items-center gap-3 rounded-md bg-brand-dark p-3 text-left text-white transition-all duration-200 active:scale-[0.99]"
    >
      <BellIcon className="h-5 w-5 shrink-0 text-brand-green" />
      <span className="flex-1 text-sm">
        Дозволити нагадування про задачі з часом (поки застосунок відкрито)
      </span>
    </button>
  );
}
