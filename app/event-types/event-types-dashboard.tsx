"use client";

import { useEffect, useState, useTransition } from "react";

import {
  DURATION_OPTIONS,
  formatDurationLabel,
  slugifyEventType,
  type EventTypePayload,
  type EventTypeRecord,
} from "@/lib/event-types";

type FormState = {
  name: string;
  slug: string;
  durationInMinutes: number;
};

const emptyFormState: FormState = {
  name: "",
  slug: "",
  durationInMinutes: 30,
};

export function EventTypesDashboard() {
  const [eventTypes, setEventTypes] = useState<EventTypeRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [activeEventTypeId, setActiveEventTypeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeEventType =
    activeEventTypeId === null
      ? null
      : eventTypes.find((eventType) => eventType.id === activeEventTypeId) ?? null;

  async function fetchEventTypes() {
    setError(null);

    try {
      const response = await fetch("/api/event-types", {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        error?: string;
        eventTypes?: EventTypeRecord[];
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load event types.");
      }

      setEventTypes(payload.eventTypes ?? []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load event types.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchEventTypes();
  }, []);

  function openCreateModal() {
    setForm(emptyFormState);
    setActiveEventTypeId(null);
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(eventType: EventTypeRecord) {
    setForm({
      name: eventType.name,
      slug: eventType.slug,
      durationInMinutes: eventType.durationInMinutes,
    });
    setActiveEventTypeId(eventType.id);
    setError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setActiveEventTypeId(null);
    setForm(emptyFormState);
    setError(null);
  }

  async function saveEventType() {
    setError(null);

    const payload: EventTypePayload = {
      name: form.name.trim(),
      slug: slugifyEventType(form.slug),
      durationInMinutes: Number(form.durationInMinutes),
    };

    const endpoint = activeEventType ? `/api/event-types/${activeEventType.id}` : "/api/event-types";
    const method = activeEventType ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as
      | {
          error?: string;
        }
      | null;

    if (!response.ok) {
      throw new Error(data?.error ?? "Unable to save event type.");
    }

    await fetchEventTypes();
    closeModal();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      void saveEventType().catch((saveError) => {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Unable to save event type.",
        );
      });
    });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this event type? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(() => {
      void (async () => {
        const response = await fetch(`/api/event-types/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(payload?.error ?? "Unable to delete event type.");
        }

        await fetchEventTypes();
        if (activeEventTypeId === id) {
          closeModal();
        }
      })().catch((deleteError) => {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete event type.",
        );
      });
    });
  }

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                Event Type Dashboard
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Design booking options your guests can trust.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Create polished event types, tune their duration, and keep your
                  scheduling lineup organized in one place.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,111,255,0.28)] transition hover:bg-[var(--primary-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              Add New Event
            </button>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-h-56 animate-pulse rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="h-4 w-24 rounded-full bg-slate-200" />
                <div className="mt-6 h-8 w-2/3 rounded-full bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                <div className="mt-10 h-11 w-full rounded-2xl bg-slate-200" />
              </div>
            ))
          ) : eventTypes.length === 0 ? (
            <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[var(--shadow-soft)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--panel-muted)] text-[var(--primary)]">
                <CalendarGlyph />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                No event types yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create your first event type to start shaping the booking
                experience.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
              >
                Create Event Type
              </button>
            </div>
          ) : (
            eventTypes.map((eventType) => (
              <article
                key={eventType.id}
                className="group flex flex-col rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {formatDurationLabel(eventType.durationInMinutes)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(eventType)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(eventType.id)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {eventType.name}
                  </h2>
                  <p className="text-sm text-slate-500">/{eventType.slug}</p>
                  <p className="text-sm leading-6 text-slate-600">
                    Offer a {formatDurationLabel(eventType.durationInMinutes).toLowerCase()}{" "}
                    session with a clean booking link and clear scheduling
                    details.
                  </p>
                </div>

                <div className="mt-auto pt-8">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Booking URL
                    </div>
                    <div className="mt-2 break-all text-sm font-medium text-slate-700">
                      calendly-clone.local/book/{eventType.slug}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[30px] border border-white/80 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-[var(--primary)]">
                  {activeEventType ? "Edit event type" : "Create event type"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {activeEventType
                    ? "Update booking details"
                    : "Build a new booking experience"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
                aria-label="Close modal"
              >
                <CloseGlyph />
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Event name
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => {
                    const nextName = event.target.value;
                    setForm((current) => {
                      const shouldUpdateSlug =
                        !current.slug || current.slug === slugifyEventType(current.name);

                      return {
                        ...current,
                        name: nextName,
                        slug: shouldUpdateSlug
                          ? slugifyEventType(nextName)
                          : current.slug,
                      };
                    });
                  }}
                  placeholder="30 Minute Intro Call"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100"
                  required
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-[1.2fr_0.8fr]">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Slug</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: slugifyEventType(event.target.value),
                      }))
                    }
                    placeholder="30-minute-intro-call"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Duration
                  </span>
                  <select
                    value={form.durationInMinutes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        durationInMinutes: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100"
                  >
                    {DURATION_OPTIONS.map((duration) => (
                      <option key={duration} value={duration}>
                        {formatDurationLabel(duration)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                Booking link preview:
                <span className="ml-2 font-medium text-slate-900">
                  calendly-clone.local/book/{slugifyEventType(form.slug || form.name) || "your-event"}
                </span>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending
                    ? "Saving..."
                    : activeEventType
                      ? "Save Changes"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function CalendarGlyph() {
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
    </svg>
  );
}

function CloseGlyph() {
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
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
