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
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Calendly Clone
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">
                Scheduling Dashboard
              </h1>
            </div>
            <nav
              aria-label="Dashboard navigation"
              className="flex flex-wrap gap-2 rounded-2xl bg-slate-100/80 p-1"
            >
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-[var(--primary)] shadow-sm"
                        : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
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
