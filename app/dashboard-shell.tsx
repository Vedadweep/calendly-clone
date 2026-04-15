"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardShellProps = {
  children: React.ReactNode;
};

const navigationItems = [
  {
    href: "/event-types",
    label: "Event Types",
  },
  {
    href: "/availability",
    label: "Availability",
  },
  {
    href: "/meetings",
    label: "Meetings",
  },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/82 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
                Calendly Clone
              </p>
              <h1 className="text-[1.35rem] font-semibold text-slate-950">
                Scheduling Dashboard
              </h1>
            </div>
            <nav
              aria-label="Dashboard navigation"
              className="flex w-full flex-wrap gap-2 rounded-[22px] border border-slate-200/70 bg-white/80 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:w-auto"
            >
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex-1 rounded-2xl px-4 py-2.5 text-center text-sm font-semibold transition sm:flex-none ${
                      isActive
                        ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.22)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
