"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InboxIcon, MicIcon, TodayIcon } from "./icons";

const TABS = [
  { href: "/", label: "Занотувати", Icon: MicIcon },
  { href: "/inbox", label: "Inbox", Icon: InboxIcon },
  { href: "/today", label: "Сьогодні", Icon: TodayIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex shrink-0 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
              isActive
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-400 dark:text-neutral-500"
            }`}
          >
            <Icon className="h-7 w-7" strokeWidth={isActive ? 2.25 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
