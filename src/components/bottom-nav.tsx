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
      className="flex shrink-0 bg-brand-dark"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-3 font-condensed text-xs font-bold uppercase tracking-wide transition-colors ${
              isActive ? "text-white" : "text-white/40"
            }`}
          >
            <span
              className={`absolute top-0 h-0.5 w-10 bg-brand-green transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
            <Icon className="h-7 w-7" strokeWidth={isActive ? 2.25 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
