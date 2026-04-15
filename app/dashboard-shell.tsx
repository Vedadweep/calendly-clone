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
      <ScrollShadowHeader className="sticky top-0 z-40 border-b border-white/70 bg-white/82 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4 lg:items-center">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
                Calendly Clone
              </p>
              <h1 className="text-xl font-semibold text-slate-950 sm:text-[1.35rem]">
                Scheduling Dashboard
              </h1>
            </div>
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="dashboard-navigation"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:bg-slate-50 lg:hidden"
            >
              <MenuGlyph open={isMobileMenuOpen} />
            </button>
          </div>

          <div className="hidden lg:block">
            <nav
              id="dashboard-navigation"
              aria-label="Dashboard navigation"
              className="flex w-full flex-col gap-2 rounded-[22px] border border-slate-200/70 bg-white/80 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:w-auto lg:flex-row lg:flex-wrap"
            >
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <InteractiveShell key={item.href} className="lg:min-w-[8.5rem]">
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                        isActive
                          ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.22)]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </InteractiveShell>
                );
              })}
            </nav>
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
                className="flex w-full flex-col gap-2 overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/80 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:hidden"
              >
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <InteractiveShell key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                          isActive
                            ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.22)]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </InteractiveShell>
                  );
                })}
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
