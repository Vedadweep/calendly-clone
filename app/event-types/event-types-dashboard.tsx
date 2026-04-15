"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";

import { DashboardShell } from "@/app/dashboard-shell";
import {
  AnimatedPage,
  HoverCard,
  MotionButton,
  Reveal,
  interactionTransition,
} from "@/app/motion-provider";
import { useConfirm, useToast } from "@/app/ui/feedback-provider";
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
  const { showToast } = useToast();
  const { confirm } = useConfirm();

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
    showToast(activeEventType ? "Event updated" : "Event created");
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
    const confirmed = await confirm({
      title: "Are you sure you want to delete?",
      description:
        "Deleting this event type removes its booking link and any connected scheduling setup.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      tone: "danger",
    });

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
        showToast("Event deleted");
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

  async function handleCopyLink(slug: string) {
    const bookingUrl = `${window.location.origin}/book/${slug}`;
    await navigator.clipboard.writeText(bookingUrl);
    showToast("Copied to clipboard", "info");
  }

  return (
    <DashboardShell>
      <AnimatedPage>
      <main className="dashboard-page">
        <div className="dashboard-container flex flex-col gap-8 lg:gap-10">
          <Reveal>
          <section className="hero-panel p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl space-y-5">
                <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                  Event Type Dashboard
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.8rem]">
                    Design booking options your guests can trust.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    Create polished event types, tune their duration, and keep your
                    scheduling lineup organized in one place.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
                <HeroMetric
                  label="Event types"
                  value={isLoading ? "..." : String(eventTypes.length)}
                />
                <MotionButton
                  type="button"
                  onClick={openCreateModal}
                  className="button-primary min-h-24 rounded-[24px] px-5 py-5 text-left text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 sm:min-h-28 sm:px-6"
                >
                  <span className="flex w-full flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/72">
                      Create
                    </span>
                    <span className="text-lg tracking-tight">Add New Event</span>
                  </span>
                </MotionButton>
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

          <Reveal delay={0.05}>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="surface-panel min-h-64 animate-pulse p-6 sm:p-7"
                >
                  <div className="h-4 w-24 rounded-full bg-slate-200" />
                  <div className="mt-6 h-8 w-2/3 rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                  <div className="mt-10 h-11 w-full rounded-2xl bg-slate-200" />
                </div>
              ))
            ) : eventTypes.length === 0 ? (
              <div className="empty-state col-span-full p-10 text-center shadow-[var(--shadow-soft)] sm:p-14">
                <div className="empty-state-icon mx-auto flex h-16 w-16 items-center justify-center rounded-[22px]">
                  <CalendarGlyph />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-950">
                  No event types yet
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                  No events yet — create your first event and start sharing a polished booking page.
                </p>
                <MotionButton
                  type="button"
                  onClick={openCreateModal}
                  className="button-primary mt-7 px-5 py-3 text-sm font-semibold"
                >
                  Create Event Type
                </MotionButton>
              </div>
            ) : (
              eventTypes.map((eventType) => (
                <HoverCard key={eventType.id}>
                  <article className="group surface-panel flex flex-col p-6 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {formatDurationLabel(eventType.durationInMinutes)}
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <MotionButton
                          type="button"
                          onClick={() => void handleCopyLink(eventType.slug)}
                          className="button-secondary w-full px-3.5 py-2 text-sm font-medium sm:w-auto"
                        >
                          Copy Link
                        </MotionButton>
                        <MotionButton
                          type="button"
                          onClick={() => openEditModal(eventType)}
                          className="button-secondary w-full px-3.5 py-2 text-sm font-medium sm:w-auto"
                        >
                          Edit
                        </MotionButton>
                        <MotionButton
                          type="button"
                          onClick={() => handleDelete(eventType.id)}
                          className="button-danger w-full px-3.5 py-2 text-sm font-medium sm:w-auto"
                        >
                          Delete
                        </MotionButton>
                      </div>
                    </div>

                    <div className="mt-7 space-y-3">
                      <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-950">
                        {eventType.name}
                      </h2>
                      <p className="text-sm text-slate-500">/{eventType.slug}</p>
                      <p className="text-sm leading-7 text-slate-600">
                        Offer a {formatDurationLabel(eventType.durationInMinutes).toLowerCase()}{" "}
                        session with a clean booking link and clear scheduling
                        details.
                      </p>
                    </div>

                    <div className="mt-auto pt-8">
                      <div className="muted-panel flex flex-col gap-3 px-4 py-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Booking URL
                          </div>
                          <div className="mt-2 break-all text-sm font-medium text-slate-700">
                            /book/{eventType.slug}
                          </div>
                        </div>
                        <MotionButton
                          type="button"
                          onClick={() => void handleCopyLink(eventType.slug)}
                          className="button-secondary px-4 py-2.5 text-sm font-semibold"
                        >
                          Copy booking link
                        </MotionButton>
                      </div>
                    </div>
                  </article>
                </HoverCard>
              ))
            )}
          </section>
          </Reveal>
        </div>
      </main>

      <AnimatePresence>
      {isModalOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={interactionTransition}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={interactionTransition}
            className="w-full max-w-xl rounded-[32px] border border-white/80 bg-white p-5 shadow-[var(--shadow-float)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-sm font-medium text-[var(--primary)]">
                  {activeEventType ? "Edit event type" : "Create event type"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {activeEventType
                    ? "Update booking details"
                    : "Build a new booking experience"}
                </h2>
              </div>
              <MotionButton
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
                aria-label="Close modal"
              >
                <CloseGlyph />
              </MotionButton>
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
                  className="field-control"
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
                    className="field-control"
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
                    className="field-control"
                  >
                    {DURATION_OPTIONS.map((duration) => (
                      <option key={duration} value={duration}>
                        {formatDurationLabel(duration)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="muted-panel break-words px-4 py-4 text-sm text-slate-600">
                Booking link preview:
                <span className="ml-2 break-all font-medium text-slate-900">
                  calendly-clone.local/book/{slugifyEventType(form.slug || form.name) || "your-event"}
                </span>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <MotionButton
                  type="button"
                  onClick={closeModal}
                  className="button-secondary px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </MotionButton>
                <MotionButton
                  type="submit"
                  disabled={isPending}
                  className="button-primary px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending
                    ? "Saving..."
                    : activeEventType
                      ? "Save Changes"
                      : "Create Event"}
                </MotionButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
      </AnimatePresence>
      </AnimatedPage>
    </DashboardShell>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <HoverCard>
      <div className="rounded-[24px] border border-white/70 bg-white/92 px-5 py-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {value}
        </div>
      </div>
    </HoverCard>
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
