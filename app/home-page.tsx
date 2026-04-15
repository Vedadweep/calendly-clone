"use client";

import Link from "next/link";
import { useState } from "react";

const navigationItems = [
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
    description: "Keep upcoming bookings in sync with the calendar you already use every day.",
    icon: GoogleCalendarIcon,
  },
  {
    name: "Microsoft Teams",
    description: "Pair meetings with your team workflow and bring invites into one familiar place.",
    icon: TeamsIcon,
  },
  {
    name: "Zoom",
    description: "Prepare for video meetings with a simple conferencing connection preview.",
    icon: ZoomIcon,
  },
];

export function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="mx-auto h-[34rem] max-w-7xl bg-[radial-gradient(circle_at_top_left,rgba(0,107,255,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,146,255,0.14),transparent_26%),linear-gradient(180deg,#f8fbff_0%,rgba(255,255,255,0)_78%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-950"
          >
            Calendly Clone
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/event-types"
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,107,255,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(0,107,255,0.28)]"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="marketing-navigation"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav
              id="marketing-navigation"
              className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/event-types"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,107,255,0.24)]"
              >
                Get Started
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-center lg:gap-16 lg:px-8 lg:pb-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              Smarter scheduling for every meeting
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
              Easy scheduling ahead
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Let guests book time in seconds with a polished scheduling page,
              clear availability, and meeting flows that feel effortless.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/event-types"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,107,255,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(0,107,255,0.28)]"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Explore features
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <div>
                <span className="block text-2xl font-semibold tracking-tight text-slate-950">
                  3 steps
                </span>
                to launch booking
              </div>
              <div>
                <span className="block text-2xl font-semibold tracking-tight text-slate-950">
                  24/7
                </span>
                shareable scheduling
              </div>
              <div>
                <span className="block text-2xl font-semibold tracking-tight text-slate-950">
                  1 link
                </span>
                for every invite
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 hidden h-28 w-28 rounded-full bg-blue-100 blur-2xl sm:block" />
            <div className="absolute -right-6 bottom-4 hidden h-24 w-24 rounded-full bg-sky-100 blur-2xl sm:block" />

            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:p-6">
              <div className="rounded-[26px] bg-[linear-gradient(180deg,#f8fbff_0%,#f2f7ff_100%)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      30 Minute Intro Call
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose a date and pick a time that works for you.
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                    Live preview
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[24px] border border-white bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                      <span>April 2026</span>
                      <span>Tue - Thu</span>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm font-medium text-slate-600">
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
                                ? "bg-slate-50"
                                : ""
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      Thursday, Apr 16
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Available times
                    </p>
                    <div className="mt-4 space-y-3">
                      {["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"].map(
                        (slot, index) => (
                          <div
                            key={slot}
                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                              index === 1
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            {slot}
                          </div>
                        ),
                      )}
                    </div>
                    <div className="mt-5 rounded-[22px] bg-slate-950 px-4 py-4 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                        Booking summary
                      </p>
                      <p className="mt-2 text-sm text-slate-200">
                        Intro Call with Calendly Clone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to start scheduling
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              A clean homepage, clear booking flows, and familiar scheduling tools that help guests book faster.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(15,23,42,0.09)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(0,107,255,0.12),rgba(90,162,255,0.18))] text-blue-700">
                    <Icon />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/80">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                How It Works
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Launch your scheduling flow in minutes
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      {step.step}
                    </span>
                    <span className="text-4xl font-semibold tracking-tight text-slate-200">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                Integrations Preview
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Connect the tools around your meetings
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Preview the integrations that will make your booking experience feel even more connected.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowComingSoon(true)}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#006bff,#5aa2ff)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(0,107,255,0.24)] transition hover:-translate-y-0.5"
            >
              {showComingSoon ? "Coming soon" : "Connect"}
            </button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {integrations.map((integration) => {
              const Icon = integration.icon;

              return (
                <article
                  key={integration.name}
                  className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-900">
                    <Icon />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">
                    {integration.name}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {integration.description}
                  </p>
                  <div className="mt-6 text-sm font-medium text-blue-700">
                    {showComingSoon ? "Coming soon" : "Ready for future connection"}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

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
                <p className="mt-4 text-lg leading-8 text-blue-50/90">
                  Create your first event type, open your availability, and share your booking page in a few clicks.
                </p>
              </div>

              <Link
                href="/event-types"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-[0_16px_34px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
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
