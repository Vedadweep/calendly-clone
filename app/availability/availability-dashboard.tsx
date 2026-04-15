"use client";

import { useEffect, useState, useTransition } from "react";

import { DashboardShell } from "@/app/dashboard-shell";
import {
  AnimatedPage,
  HoverCard,
  MotionButton,
  Reveal,
} from "@/app/motion-provider";
import { useToast } from "@/app/ui/feedback-provider";
import {
  TIMEZONE_OPTIONS,
  WEEKDAY_OPTIONS,
  type AvailabilityDayRecord,
  type AvailabilityPayload,
} from "@/lib/availability";

type ApiResponse = {
  timezone?: string;
  days?: AvailabilityDayRecord[];
  hasExistingAvailability?: boolean;
  error?: string;
};

export function AvailabilityDashboard() {
  const [timezone, setTimezone] = useState<string>(TIMEZONE_OPTIONS[0]);
  const [days, setDays] = useState<AvailabilityDayRecord[]>([]);
  const [hasExistingAvailability, setHasExistingAvailability] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  useEffect(() => {
    void loadAvailability();
  }, []);

  async function loadAvailability() {
    setError(null);

    try {
      const response = await fetch("/api/availability", {
        cache: "no-store",
      });
      const payload = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load availability.");
      }

      setTimezone(payload.timezone ?? TIMEZONE_OPTIONS[0]);
      setDays(payload.days ?? []);
      setHasExistingAvailability(Boolean(payload.hasExistingAvailability));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load availability.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateDay(
    dayOfWeek: number,
    updater: (day: AvailabilityDayRecord) => AvailabilityDayRecord,
  ) {
    setDays((currentDays) =>
      currentDays.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...updater(day),
              timezone,
            }
          : day,
      ),
    );
  }

  async function saveAvailability() {
    setError(null);

    const payload: AvailabilityPayload = {
      timezone,
      days: days.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        enabled: day.enabled,
        startTime: day.startTime,
        endTime: day.endTime,
        timezone,
      })),
    };

    const method = hasExistingAvailability ? "PUT" : "POST";
    const response = await fetch("/api/availability", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok) {
      throw new Error(result?.error ?? "Unable to save availability.");
    }

    setTimezone(result?.timezone ?? timezone);
    setDays(result?.days ?? payload.days);
    setHasExistingAvailability(Boolean(result?.hasExistingAvailability ?? true));
    showToast("Availability saved");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      void saveAvailability().catch((saveError) => {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Unable to save availability.",
        );
      });
    });
  }

  return (
    <DashboardShell>
      <AnimatedPage>
      <main className="dashboard-page">
        <div className="dashboard-container flex max-w-6xl flex-col gap-8 lg:gap-10">
          <Reveal>
          <section className="hero-panel p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                  Availability
                </div>
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl lg:text-[2.8rem]">
                  Set when people can book with you.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
                  Choose your working days, define your hours, and keep everything
                  aligned to the timezone you actually use.
                </p>
              </div>
              <MotionButton
                type="submit"
                form="availability-form"
                disabled={isPending || isLoading}
                className="button-primary min-h-11 w-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isPending ? "Saving..." : "Save Availability"}
              </MotionButton>
            </div>
          </section>
          </Reveal>

          {error ? (
            <Reveal>
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
            </Reveal>
          ) : null}

          <form
            id="availability-form"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
          <Reveal delay={0.04}>
          <section className="surface-panel p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Timezone</h2>
                <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                  All working hours below will be saved in this timezone.
                </p>
              </div>
              <div className="w-full max-w-lg">
                <select
                  value={timezone}
                  onChange={(event) => {
                    const nextTimezone = event.target.value;
                    setTimezone(nextTimezone);
                    setDays((currentDays) =>
                      currentDays.map((day) => ({
                        ...day,
                        timezone: nextTimezone,
                      })),
                    );
                  }}
                  className="field-control"
                >
                  {TIMEZONE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          </Reveal>

          <Reveal delay={0.06}>
          <section className="surface-panel p-6 sm:p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Weekly hours</h2>
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                Enable the days you want to take meetings and set a time range for
                each one.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {isLoading
                ? Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid animate-pulse gap-4 rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-5 md:grid-cols-[1.1fr_0.9fr_0.9fr]"
                    >
                      <div className="h-11 rounded-2xl bg-slate-200" />
                      <div className="h-11 rounded-2xl bg-slate-200" />
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </div>
                  ))
                : WEEKDAY_OPTIONS.map((weekday) => {
                    const day = days.find(
                      (currentDay) => currentDay.dayOfWeek === weekday.value,
                    );

                    if (!day) {
                      return null;
                    }

                    return (
                      <HoverCard key={weekday.value} hoverScale={1.02}>
                      <div
                        className="grid gap-4 rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(249,251,255,0.95),rgba(244,248,252,0.92))] px-4 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] sm:px-5"
                      >
                        <div className="flex items-center justify-between gap-4 rounded-[20px] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                          <div>
                            <div className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                              {weekday.label}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {day.enabled ? "Available" : "Unavailable"}
                            </div>
                          </div>
                          <MotionButton
                            type="button"
                            role="switch"
                            aria-checked={day.enabled}
                            onClick={() =>
                              updateDay(weekday.value, (currentDay) => ({
                                ...currentDay,
                                enabled: !currentDay.enabled,
                              }))
                            }
                            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                              day.enabled
                                ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] shadow-[0_12px_20px_rgba(0,107,255,0.22)]"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                day.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </MotionButton>
                        </div>

                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start time
                          </span>
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(event) =>
                              updateDay(weekday.value, (currentDay) => ({
                                ...currentDay,
                                startTime: event.target.value,
                              }))
                            }
                            disabled={!day.enabled || isPending}
                            className="field-control"
                          />
                        </label>

                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            End time
                          </span>
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(event) =>
                              updateDay(weekday.value, (currentDay) => ({
                                ...currentDay,
                                endTime: event.target.value,
                              }))
                            }
                            disabled={!day.enabled || isPending}
                            className="field-control"
                          />
                        </label>
                      </div>
                      </HoverCard>
                    );
                  })}
            </div>
          </section>
          </Reveal>
          </form>
        </div>
      </main>
      </AnimatedPage>
    </DashboardShell>
  );
}
