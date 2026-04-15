"use client";

import { useEffect, useState, useTransition } from "react";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    setSuccessMessage(null);

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
    setSuccessMessage("Availability saved successfully.");
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
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                Availability
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Set when people can book with you.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Choose your working days, define your hours, and keep everything
                aligned to the timezone you actually use.
              </p>
            </div>
            <button
              type="submit"
              form="availability-form"
              disabled={isPending || isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,111,255,0.28)] transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <form
          id="availability-form"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">Timezone</h2>
                <p className="text-sm text-slate-600">
                  All working hours below will be saved in this timezone.
                </p>
              </div>
              <div className="w-full max-w-md">
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100"
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

          <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">Weekly hours</h2>
              <p className="text-sm text-slate-600">
                Enable the days you want to take meetings and set a time range for
                each one.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading
                ? Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid animate-pulse gap-4 rounded-3xl border border-slate-100 bg-slate-50 px-4 py-5 md:grid-cols-[1.1fr_0.9fr_0.9fr]"
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
                      <div
                        key={weekday.value}
                        className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 px-4 py-5 md:grid-cols-[1.1fr_0.9fr_0.9fr]"
                      >
                        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {weekday.label}
                            </div>
                            <div className="text-xs text-slate-500">
                              {day.enabled ? "Available" : "Unavailable"}
                            </div>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={day.enabled}
                            onClick={() =>
                              updateDay(weekday.value, (currentDay) => ({
                                ...currentDay,
                                enabled: !currentDay.enabled,
                              }))
                            }
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                              day.enabled ? "bg-[var(--primary)]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                day.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-slate-700">
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
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </label>

                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-slate-700">
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
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </label>
                      </div>
                    );
                  })}
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
