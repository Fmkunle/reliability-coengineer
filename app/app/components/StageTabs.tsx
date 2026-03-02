"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
};

const tabs: Tab[] = [
  { href: "/", label: "Home" },
  { href: "/fmea-dummy", label: "Stage 0: Dummy rows" },
  { href: "/fmea-generator", label: "Stage 1: Generator" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function StageTabs() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = isActive(pathname, t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={[
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                  "border",
                  active
                    ? "bg-sky-500/15 border-sky-500/40 text-sky-200"
                    : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-900/60 hover:text-slate-100",
                ].join(" ")}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

