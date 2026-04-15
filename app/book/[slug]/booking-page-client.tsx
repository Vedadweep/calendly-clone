"use client";

import { format, isBefore, startOfDay } from "date-fns";
import Calendar from "react-calendar";
import { useEffect, useState, useTransition } from "react";

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
  const [confirmation, setConfirmation] = useState<BookingResponse["booking"] | null>(
    null,
  );
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isPending, startTransition] = useTransition();

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

  function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
            name,
            email,
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
        setSelectedTime(null);
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
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[32px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                Public Booking Page
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {eventType.name}
                </h1>
                <p className="text-base leading-7 text-slate-600 sm:text-lg">
                  Pick a day, choose a time, and reserve your{" "}
                  {formatDurationLabel(eventType.durationInMinutes).toLowerCase()} session.
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-900">
                {formatDurationLabel(eventType.durationInMinutes)}
              </div>
              <div className="mt-1">Timezone: {timezone}</div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {confirmation ? (
          <section className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              Booking Confirmed
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              {confirmation.guestName}, you&apos;re booked.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {confirmation.eventType.name} is scheduled for {confirmation.dateLabel} at{" "}
              {confirmation.timeLabel}. A confirmation can be sent to {confirmation.guestEmail}.
            </p>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">Select a date</h2>
              <p className="text-sm leading-6 text-slate-600">
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

          <div className="rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Available times</h2>
                <p className="text-sm leading-6 text-slate-600">
                  {format(selectedDate, "EEEE, MMMM d")}
                </p>
              </div>
              <div className="text-sm text-slate-500">{timezone}</div>
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
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                  <div className="text-lg font-semibold text-slate-900">
                    No time slots available
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Choose another day to see open times for this event.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {slots.map((slot) => {
                    const isSelected = selectedTime === slot.time;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_14px_30px_rgba(15,111,255,0.22)]"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <form className="mt-8 space-y-4 border-t border-slate-100 pt-6" onSubmit={handleBookingSubmit}>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">Your details</h3>
                <p className="text-sm text-slate-600">
                  {selectedTime
                    ? `Booking ${format(selectedDate, "MMMM d")} at ${
                        slots.find((slot) => slot.time === selectedTime)?.label ?? selectedTime
                      }`
                    : "Select a time slot, then enter your details."}
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jane@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={isPending || !selectedTime}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,111,255,0.28)] transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
