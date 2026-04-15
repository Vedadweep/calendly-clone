"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  InteractiveShell,
  ScrollShadowHeader,
  interactionTransition,
} from "@/app/motion-provider";

type DashboardShellProps = {
  children: React.ReactNode;
};

const navigationItems = [
  {
    href: "/",
    label: "Home",
  },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollShadowHeader className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/68 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4 lg:items-center">
            <div className="space-y-1">
              <Link
                href="/"
                className="inline-flex rounded-full px-1 py-0.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                Cal Studio
              </Link>
              <h1 className="text-xl font-bold text-white sm:text-[1.35rem]">
                Scheduling Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="dashboard-navigation"
                aria-label="Toggle navigation menu"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="theme-toggle h-11 w-11 lg:hidden"
              >
                <MenuGlyph open={isMobileMenuOpen} />
              </button>
            </div>
          </div>

          <div className="hidden items-center justify-between gap-4 lg:flex">
            <nav
              id="dashboard-navigation"
              aria-label="Dashboard navigation"
              className="nav-shell flex w-full flex-col gap-2 rounded-[22px] p-1.5 lg:w-auto lg:flex-row lg:flex-wrap"
            >
              {navigationItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <InteractiveShell key={item.href} className="lg:min-w-[8.5rem]">
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                        isActive
                          ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.22)]"
                          : "text-gray-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </InteractiveShell>
                );
              })}
            </nav>
            <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100">
              Smooth scheduling, clearer decisions
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isMobileMenuOpen ? (
              <motion.nav
                id="dashboard-navigation"
                aria-label="Dashboard navigation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={interactionTransition}
                className="nav-shell flex w-full flex-col gap-3 overflow-hidden rounded-[22px] p-3 lg:hidden"
              >
                {navigationItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <InteractiveShell key={item.href}>
                      <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                        isActive
                            ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.22)]"
                          : "text-gray-300 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </InteractiveShell>
                  );
                })}
                <div className="rounded-[20px] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-6 text-gray-300">
                  Jump home quickly and manage bookings from a cleaner mobile menu.
                </div>
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </ScrollShadowHeader>

      {children}
    </div>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}
