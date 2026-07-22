"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "./date-utils";

const noopSubscribe = () => () => {};

// Current date differs between the build-time server snapshot and the
// client's real clock, so it's read as a hydration-safe external value.
export function useTodayISO() {
  return useSyncExternalStore(noopSubscribe, todayISO, todayISO);
}
