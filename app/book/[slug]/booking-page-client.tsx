"use client";

import { format, isBefore, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { useEffect, useState, useTransition } from "react";

import {
  AnimatedPage,
  HoverCard,
  MotionButton,
  Reveal,
  interactionTransition,
} from "@/app/motion-provider";
import { useToast } from "@/app/ui/feedback-provider";
import { formatDurationLabel } from "@/lib/event-types";

type EventTypeDetails = {
  id: string;
  name: string;
  slug: string;
  durationInMinutes: number;
};

type SlotRecord = {
  time: string;
  label: string;
  isPast: boolean;
};

type SlotsResponse = {
  timezone?: string;
  slots?: SlotRecord[];
  error?: string;
};

type BookingResponse = {
  booking?: {
    id: string;
    guestName: string;
    guestEmail: string;
    startTime: string;
    endTime: string;
    dateLabel: string;
    timeLabel: string;
    eventType: EventTypeDetails;
  };
  error?: string;
};

type BookingPageClientProps = {
  eventType: EventTypeDetails;
  availabilityWeekdays: number[];
};

type FieldErrors = {
  name?: string;
  email?: string;
};

const today = startOfDay(new Date());

async function fetchSlotsForDate(eventTypeId: string, date: Date) {
  const dateParam = format(date, "yyyy-MM-dd");
  const response = await fetch(
    `/api/bookings?eventTypeId=${encodeURIComponent(eventTypeId)}&date=${dateParam}`,
    { cache: "no-store" },
  );
  const payload = (await response.json()) as SlotsResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to load time slots.");
  }

  return payload;
}

export function BookingPageClient({
  eventType,
  availabilityWeekdays,
}: BookingPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [slots, setSlots] = useState<SlotRecord[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [confirmation, setConfirmation] = useState<BookingResponse["booking"] | null>(
    null,
  );
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  async function loadSlots(date: Date, preserveConfirmation = false) {
    setIsLoadingSlots(true);
    setSelectedTime(null);
    if (!preserveConfirmation) {
      setConfirmation(null);
    }
    setError(null);

    try {
      const payload = await fetchSlotsForDate(eventType.id, date);
      setSlots(payload.slots ?? []);
      setTimezone(payload.timezone ?? "Asia/Kolkata");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load time slots.",
      );
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }

  useEffect(() => {
    void (async () => {
      setIsLoadingSlots(true);
      setSelectedTime(null);
      setConfirmation(null);
      setError(null);

      try {
        const payload = await fetchSlotsForDate(eventType.id, selectedDate);
        setSlots(payload.slots ?? []);
        setTimezone(payload.timezone ?? "Asia/Kolkata");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load time slots.",
        );
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    })();
  }, [eventType.id, selectedDate]);

  function isDateAvailable(date: Date) {
    if (isBefore(startOfDay(date), today)) {
      return false;
    }

    return availabilityWeekdays.includes(date.getDay());
  }

  function validateFields() {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);

    if (!validateFields()) {
      return;
    }

    if (!selectedTime) {
      setError("Select a time slot to continue.");
      return;
    }

    startTransition(() => {
      void (async () => {
        setError(null);

        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventTypeId: eventType.id,
            name: name.trim(),
            email: email.trim(),
            date: format(selectedDate, "yyyy-MM-dd"),
            time: selectedTime,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | BookingResponse
          | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to book this meeting.");
        }

        setConfirmation(payload?.booking ?? null);
        setName("");
        setEmail("");
        setFieldErrors({});
        setSelectedTime(null);
        showToast("Booking successful");
        await loadSlots(selectedDate, true);
      })().catch((submitError) => {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to book this meeting.",
        );
      });
    });
  }

  return (
    <AnimatedPage>
    <main className="dashboard-page min-h-screen">
      <div className="dashboard-container flex max-w-6xl flex-col gap-6 lg:gap-8">
        <Reveal>
        <section className="hero-panel p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                Public Booking Page
              </div>
              <div className="space-y-2">
                <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[2.8rem]">
                  {eventType.name}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
                  Pick a day, choose a time, and reserve your{" "}
                  {formatDurationLabel(eventType.durationInMinutes).toLowerCase()} session.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[22rem]">
              <SummaryCard
                label="Duration"
                value={formatDurationLabel(eventType.durationInMinutes)}
              />
              <SummaryCard label="Timezone" value={timezone} />
            </div>
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

        {confirmation ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={interactionTransition}
            className="surface-panel border-emerald-200 p-6 sm:p-8"
          >
            <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              Booking Confirmed
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {confirmation.guestName}, you&apos;re booked.
            </h2>
            <p className="mt-3 text-base leading-8 text-gray-700 dark:text-gray-300">
              {confirmation.eventType.name} is scheduled for {confirmation.dateLabel} at{" "}
              {confirmation.timeLabel}. A confirmation can be sent to {confirmation.guestEmail}.
            </p>
          </motion.section>
        ) : null}

        <Reveal delay={0.05}>
        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <HoverCard>
          <div className="surface-panel p-5 sm:p-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select a date</h2>
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                Available days are based on the host&apos;s weekly schedule.
              </p>
            </div>

            <div className="booking-calendar mt-6">
              <Calendar
                onChange={(value) => {
                  const nextValue = Array.isArray(value) ? value[0] : value;

                  if (nextValue) {
                    setSelectedDate(startOfDay(nextValue));
                  }
                }}
                value={selectedDate}
                minDate={today}
                tileDisabled={({ date, view }) =>
                  view === "month" ? !isDateAvailable(date) : false
                }
                prev2Label={null}
                next2Label={null}
              />
            </div>
          </div>
          </HoverCard>

          <HoverCard>
          <div className="surface-panel min-w-0 p-5 sm:p-6">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available times</h2>
                <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {format(selectedDate, "EEEE, MMMM d")}
                </p>
              </div>
              <div className="break-all text-sm text-gray-700 dark:text-gray-300">{timezone}</div>
            </div>

            <div className="mt-5">
              {isLoadingSlots ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-12 animate-pulse rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="empty-state px-5 py-10 text-center">
                  <div className="empty-state-icon mx-auto flex h-14 w-14 items-center justify-center rounded-[20px]">
                    <CalendarIcon />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    No time slots available
                  </div>
                  <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                    Choose another day to see open times for this event.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {slots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const isDisabled = slot.isPast;

                    return (
                      <MotionButton
                        key={slot.time}
                        type="button"
                        onClick={() => {
                          if (isDisabled) {
                            return;
                          }

                          setSelectedTime(slot.time);
                          setError(null);
                        }}
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        className={`min-h-11 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          isDisabled
                            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-gray-700 dark:text-gray-300"
                            : isSelected
                            ? "border-[var(--primary)] bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_14px_30px_rgba(0,107,255,0.22)] dark:text-white"
                            : "border-slate-200 bg-white text-gray-700 hover:border-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] hover:shadow-[0_14px_30px_rgba(0,107,255,0.12)] dark:text-gray-300"
                        }`}
                        whileHover={
                          isDisabled
                            ? undefined
                            : isSelected
                            ? { scale: 1.02, filter: "brightness(1.03)" }
                            : {
                                scale: 1.04,
                                backgroundColor: "rgba(230, 240, 255, 0.95)",
                                borderColor: "rgba(0, 107, 255, 0.72)",
                                color: "#0050d4",
                              }
                        }
                        whileTap={isDisabled ? undefined : { scale: 0.97 }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {slot.label}
                          {isDisabled ? (
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-700 dark:text-gray-300">
                              Past
                            </span>
                          ) : null}
                        </span>
                      </MotionButton>
                    );
                  })}
                </div>
              )}
            </div>

            <form className="mt-8 space-y-4 border-t border-slate-100 pt-6" onSubmit={handleBookingSubmit}>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your details</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedTime
                    ? `Booking ${format(selectedDate, "MMMM d")} at ${
                        slots.find((slot) => slot.time === selectedTime)?.label ?? selectedTime
                      }`
                    : "Select a time slot, then enter your details."}
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFieldErrors((current) => ({ ...current, name: undefined }));
                  }}
                  placeholder="Jane Doe"
                  className="field-control"
                  aria-invalid={fieldErrors.name ? "true" : "false"}
                  required
                />
                {fieldErrors.name ? (
                  <p className="error-text">{fieldErrors.name}</p>
                ) : (
                  <p className="helper-text">Enter the full name you want on the booking.</p>
                )}
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }}
                  placeholder="jane@example.com"
                  className="field-control"
                  aria-invalid={fieldErrors.email ? "true" : "false"}
                  required
                />
                {fieldErrors.email ? (
                  <p className="error-text">{fieldErrors.email}</p>
                ) : (
                  <p className="helper-text">We’ll use this for your confirmation details.</p>
                )}
              </label>

              <MotionButton
                type="submit"
                disabled={isPending || !selectedTime}
                className="button-primary w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Confirming..." : "Confirm Booking"}
              </MotionButton>
            </form>
          </div>
          </HoverCard>
        </section>
        </Reveal>
      </div>
    </main>
    </AnimatedPage>
  );
}

function CalendarIcon() {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <HoverCard>
      <div className="rounded-[24px] border border-white/70 bg-white/92 px-5 py-4 text-sm text-gray-700 shadow-[0_16px_34px_rgba(15,23,42,0.06)] dark:text-gray-300">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-700 dark:text-gray-300">
          {label}
        </div>
        <div className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{value}</div>
      </div>
    </HoverCard>
  );
}
