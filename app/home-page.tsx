"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatedPage,
  HoverCard,
  InteractiveShell,
  MotionButton,
  Reveal,
  ScrollShadowHeader,
  interactionTransition,
} from "@/app/motion-provider";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/event-types", label: "Event Types" },
  { href: "/availability", label: "Availability" },
  { href: "/meetings", label: "Meetings" },
];

const featureCards = [
  {
    title: "Create event types",
    description:
      "Design one-on-ones, demos, and intro calls with polished durations and friendly booking details.",
    icon: CalendarPlusIcon,
  },
  {
    title: "Set availability",
    description:
      "Open the right hours for meetings and keep your booking windows aligned with your schedule.",
    icon: ClockWindowIcon,
  },
  {
    title: "Share booking link",
    description:
      "Send one clean link and let guests pick the best time without email back-and-forth.",
    icon: ShareLinkIcon,
  },
];

const workflowSteps = [
  {
    step: "Step 1",
    title: "Create event",
    description: "Choose a meeting type, add a title, and define how long each session lasts.",
  },
  {
    step: "Step 2",
    title: "Set availability",
    description: "Pick the days and hours you want to offer so guests only see valid times.",
  },
  {
    step: "Step 3",
    title: "Share link",
    description: "Send your booking page anywhere and let invitees schedule instantly.",
  },
];

const integrations = [
  {
    name: "Google Calendar",
    description: "Keep upcoming bookings aligned with the calendar your team already relies on every day.",
    icon: GoogleCalendarIcon,
    accentClassName:
      "from-[#eef5ff] via-white to-[#f8fbff] ring-[#d6e6ff] shadow-[0_18px_36px_rgba(66,133,244,0.12)]",
  },
  {
    name: "Microsoft Teams",
    description: "Bring meeting coordination into your team workflow with a familiar collaboration layer.",
    icon: TeamsIcon,
    accentClassName:
      "from-[#f1f0ff] via-white to-[#f7f6ff] ring-[#dfdcff] shadow-[0_18px_36px_rgba(91,95,199,0.12)]",
  },
  {
    name: "Zoom",
    description: "Prepare video calls with conferencing tools that feel seamless from booking to join time.",
    icon: ZoomIcon,
    accentClassName:
      "from-[#edf4ff] via-white to-[#f7fbff] ring-[#d7e8ff] shadow-[0_18px_36px_rgba(11,92,255,0.12)]",
  },
  {
    name: "Slack",
    description: "Keep scheduling updates close to your conversations so teams can move faster together.",
    icon: SlackIcon,
    accentClassName:
      "from-[#fff3fb] via-white to-[#fffaf3] ring-[#f2dce9] shadow-[0_18px_36px_rgba(74,21,75,0.12)]",
  },
];

const primaryCtaClassName =
  "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,107,255,0.24)] transition hover:-translate-y-0.5 hover:text-white hover:shadow-[0_24px_45px_rgba(0,107,255,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff] focus-visible:ring-offset-2";

const secondaryCtaClassName =
  "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(2,6,23,0.34)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b4fd6]";

export function HomePage() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);

  useEffect(() => {
    if (!activeIntegration) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setActiveIntegration(null);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [activeIntegration]);

  function scrollToFeatures() {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <AnimatedPage className="min-h-screen text-white">
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="mx-auto h-[34rem] max-w-7xl bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_26%),linear-gradient(180deg,rgba(8,20,36,0.92)_0%,rgba(8,20,36,0)_78%)]" />
      </div>

      <ScrollShadowHeader className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="rounded-full px-1 py-1 text-lg font-semibold tracking-[0.18em] text-white transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            Cal Studio
          </Link>

          <nav className="nav-shell hidden items-center gap-2 rounded-full p-1.5 md:flex">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.22)]"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <InteractiveShell>
              <Link
                href="/event-types"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,107,255,0.24)] transition hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_38px_rgba(0,107,255,0.28)]"
              >
                Get Started
              </Link>
            </InteractiveShell>
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="marketing-navigation"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="theme-toggle h-11 w-11 md:hidden"
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isMobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={interactionTransition}
              className="overflow-hidden border-t border-slate-800 bg-slate-950 md:hidden"
            >
              <nav
                id="marketing-navigation"
                className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6"
              >
                <div className="rounded-[22px] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-6 text-slate-300">
                  Navigate the product quickly and jump into your scheduling setup from one clean mobile menu.
                </div>
                {navigationItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_28px_rgba(0,107,255,0.2)]"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <InteractiveShell className="mt-2">
                  <Link
                    href="/event-types"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,107,255,0.24)] hover:text-white"
                  >
                    Get Started
                  </Link>
                </InteractiveShell>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ScrollShadowHeader>

      <main>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-center lg:gap-16 lg:px-8 lg:pb-28"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
              Smarter scheduling for every meeting
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-[-0.05em] text-white sm:text-6xl">
              Easy scheduling ahead
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Let guests book time in seconds with a polished scheduling page,
              clear availability, and meeting flows that feel effortless.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <InteractiveShell>
                <Link
                  href="/event-types"
                  className={primaryCtaClassName}
                >
                  Get Started
                </Link>
              </InteractiveShell>
              <InteractiveShell>
                <button
                  type="button"
                  onClick={scrollToFeatures}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3.5 text-sm font-semibold text-gray-300 transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900 hover:text-white hover:shadow-[0_14px_28px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                >
                  Explore features
                </button>
              </InteractiveShell>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-300">
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white">
                  3 steps
                </span>
                to launch booking
              </div>
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white">
                  24/7
                </span>
                shareable scheduling
              </div>
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white">
                  1 link
                </span>
                for every invite
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 hidden h-28 w-28 rounded-full bg-blue-100 blur-2xl sm:block" />
            <div className="absolute -right-6 bottom-4 hidden h-24 w-24 rounded-full bg-sky-100 blur-2xl sm:block" />

            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
              className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/90 p-4 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:p-6"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 4.8,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                }}
                className="rounded-[26px] bg-[linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(11,18,32,0.98)_100%)] p-5 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      30 Minute Intro Call
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      Choose a date and pick a time that works for you.
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-blue-300 shadow-sm">
                    Live preview
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-300">
                      <span>April 2026</span>
                      <span>Tue - Thu</span>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-300">
                      {[
                        "", "", "1", "2", "3", "4", "5",
                        "6", "7", "8", "9", "10", "11", "12",
                        "13", "14", "15", "16", "17", "18", "19",
                        "20", "21", "22", "23", "24", "25", "26",
                        "27", "28", "29", "30", "", "", "",
                      ].map((day, index) => (
                        <div
                          key={`${day}-${index}`}
                          className={`flex h-10 items-center justify-center rounded-2xl ${
                            day === "16"
                              ? "bg-[linear-gradient(135deg,#006bff,#5aa2ff)] font-semibold text-white shadow-[0_12px_24px_rgba(0,107,255,0.24)]"
                              : day
                                ? "bg-slate-900"
                                : ""
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-4 text-white shadow-sm">
                    <p className="text-sm font-semibold text-white">
                      Thursday, Apr 16
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      Available times
                    </p>
                    <div className="mt-4 space-y-3">
                      {["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"].map((slot, index) => (
                        <motion.div
                          key={slot}
                          whileHover={{
                            scale: 1.04,
                            y: -2,
                            backgroundColor: "rgba(239, 246, 255, 0.95)",
                            borderColor: "rgba(96, 165, 250, 0.6)",
                            color: "#1d4ed8",
                          }}
                          transition={interactionTransition}
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            index === 1
                              ? "border-blue-400/40 bg-blue-500/10 text-blue-300"
                            : "border-slate-800 bg-slate-950 text-gray-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300"
                          }`}
                        >
                            {slot}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-[22px] bg-slate-950 px-4 py-4 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                        Booking summary
                      </p>
                      <p className="mt-2 text-sm text-white">
                        Intro Call with Calendly Clone
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <Reveal>
          <section
            id="features"
            className="mx-auto max-w-7xl px-4 py-20 text-white sm:px-6 lg:px-8"
          >
          <div className="mx-auto max-w-2xl text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything you need to start scheduling
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              A clean homepage, clear booking flows, and familiar scheduling tools that help guests book faster.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <HoverCard key={feature.title}>
                  <article className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-7 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-shadow">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(0,107,255,0.12),rgba(90,162,255,0.18))] text-blue-600">
                      <Icon />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-gray-300">
                      {feature.description}
                    </p>
                  </article>
                </HoverCard>
              );
            })}
          </div>
          </section>
        </Reveal>

        <Reveal delay={0.04}>
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 rounded-[36px] border border-slate-800 bg-[linear-gradient(180deg,rgba(10,19,35,0.96)_0%,rgba(14,28,49,0.94)_100%)] px-6 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">
                  Connect your tools
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Bring your calendar and meeting apps into one polished workflow
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-300">
                  Preview the integrations that will make scheduling feel more connected across your calendar, video, and team communication tools.
                </p>
              </div>

              <div className="rounded-[24px] border border-blue-400/20 bg-blue-500/10 px-5 py-4 text-sm leading-6 text-blue-100 shadow-[0_12px_28px_rgba(0,107,255,0.08)]">
                Professional integrations, designed to fit naturally into the booking flow your team already uses.
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {integrations.map((integration) => {
                const Icon = integration.icon;

                return (
                  <HoverCard key={integration.name}>
                    <article
                      className={`group rounded-[28px] border border-slate-800 bg-[linear-gradient(180deg,var(--tw-gradient-stops))] p-6 text-white ring-1 transition-shadow ${integration.accentClassName}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 shadow-sm">
                          <Icon />
                        </div>
                        <span className="rounded-full border border-blue-400/20 bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                          Popular
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
                        {integration.name}
                      </h3>
                      <p className="mt-3 min-h-20 text-sm leading-7 text-gray-300">
                        {integration.description}
                      </p>

                      <MotionButton
                        type="button"
                        onClick={() => setActiveIntegration(integration.name)}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-blue-400/20 bg-slate-900 px-4 py-3 text-sm font-semibold text-blue-300 shadow-[0_10px_24px_rgba(0,107,255,0.08)] transition hover:border-blue-300 hover:bg-blue-500/10"
                      >
                        Connect
                      </MotionButton>
                    </article>
                  </HoverCard>
                );
              })}
            </div>
          </div>
          </section>
        </Reveal>

        <Reveal delay={0.06}>
          <section className="border-y border-slate-800 bg-slate-950/50 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">
                How It Works
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Launch your scheduling flow in minutes
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <HoverCard key={step.title}>
                  <article className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-7 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                        {step.step}
                      </span>
                      <span className="text-4xl font-semibold tracking-tight text-gray-300">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-gray-300">
                      {step.description}
                    </p>
                  </article>
                </HoverCard>
              ))}
            </div>
          </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[36px] bg-[linear-gradient(135deg,#0f172a_0%,#0b4fd6_54%,#53a2ff_100%)] px-6 py-14 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:px-10 lg:px-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Ready to start
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Start scheduling now
                </h2>
                <p className="mt-4 text-lg leading-8 text-white">
                  Create your first event type, open your availability, and share your booking page in a few clicks.
                </p>
              </div>

              <InteractiveShell>
                <Link
                  href="/event-types"
                  className={secondaryCtaClassName}
                >
                  Get Started
                </Link>
              </InteractiveShell>
            </div>
          </div>
          </section>
        </Reveal>
      </main>

      <AnimatePresence>
        {activeIntegration ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={interactionTransition}
            className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-[24px] border border-blue-400/20 bg-slate-950 p-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <SparkIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{activeIntegration}</p>
                  <p className="mt-1 text-sm text-gray-300">Integration coming soon</p>
                </div>
                <MotionButton
                  type="button"
                  aria-label="Dismiss integration message"
                  onClick={() => setActiveIntegration(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl text-gray-300 transition hover:bg-slate-900 hover:text-white"
                >
                  <CloseIcon />
                </MotionButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AnimatedPage>
  );
}

function MenuIcon({ open }: { open: boolean }) {
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

function CalendarPlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
      <path d="M12 14v5" />
      <path d="M9.5 16.5h5" />
    </svg>
  );
}

function ClockWindowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="13" r="5" />
      <path d="M12 10.5v3l2 1.5" />
      <path d="M7 2v3" />
      <path d="M17 2v3" />
      <path d="M4 6h16" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v13A2.5 2.5 0 0 1 17.5 20H16" />
    </svg>
  );
}

function ShareLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10.6 5.3" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-1.41 1.41a5 5 0 1 0 7.07 7.07l.83-.83" />
    </svg>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
      <rect x="4" y="5" width="16" height="15" rx="3" fill="#ffffff" stroke="#d7e3f4" />
      <path d="M7 3.5v3" stroke="#34a853" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 3.5v3" stroke="#4285f4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 9h16" stroke="#ea4335" strokeWidth="1.6" />
      <rect x="7.5" y="11.5" width="4" height="4" rx="1" fill="#fbbc05" />
      <rect x="12.5" y="11.5" width="4" height="4" rx="1" fill="#4285f4" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
      <rect x="4" y="7" width="9" height="10" rx="2" fill="#5b5fc7" />
      <rect x="12" y="5" width="8" height="12" rx="3" fill="#7b83eb" />
      <circle cx="17.5" cy="8" r="2" fill="#8b92f7" />
      <path d="M7.5 10.5h4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 10.5v5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
      <rect x="3.5" y="7" width="11" height="10" rx="3" fill="#0b5cff" />
      <path d="M14.5 10.2 20 7.8v8.4l-5.5-2.4Z" fill="#63a5ff" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
      <rect x="10.3" y="2.8" width="3.8" height="7.6" rx="1.9" fill="#36c5f0" />
      <rect x="13.6" y="10.3" width="7.6" height="3.8" rx="1.9" fill="#2eb67d" />
      <rect x="9.9" y="13.6" width="3.8" height="7.6" rx="1.9" fill="#ecb22e" />
      <rect x="2.8" y="9.9" width="7.6" height="3.8" rx="1.9" fill="#e01e5a" />
      <circle cx="8.3" cy="8.3" r="1.9" fill="#36c5f0" />
      <circle cx="15.7" cy="8.3" r="1.9" fill="#2eb67d" />
      <circle cx="15.7" cy="15.7" r="1.9" fill="#ecb22e" />
      <circle cx="8.3" cy="15.7" r="1.9" fill="#e01e5a" />
    </svg>
  );
}

function SparkIcon() {
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
      <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
