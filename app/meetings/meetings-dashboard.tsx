"use client";

import { format } from "date-fns";
import { useMemo, useState, useTransition } from "react";

import { DashboardShell } from "@/app/dashboard-shell";
import type { MeetingRecord } from "@/lib/bookings";

type MeetingsDashboardProps = {
  initialMeetings: MeetingRecord[];
};

export function MeetingsDashboard({
  initialMeetings,
}: MeetingsDashboardProps) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [error, setError] = useState<string | null>(null);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { upcomingMeetings, pastMeetings } = useMemo(() => {
    const now = new Date();

    return meetings.reduce(
      (groups, meeting) => {
        if (new Date(meeting.startTime) >= now) {
          groups.upcomingMeetings.push(meeting);
        } else {
          groups.pastMeetings.push(meeting);
        }

        return groups;
      },
      {
        upcomingMeetings: [] as MeetingRecord[],
        pastMeetings: [] as MeetingRecord[],
      },
    );
  }, [meetings]);

  function handleCancel(meeting: MeetingRecord) {
    const confirmed = window.confirm(
      `Cancel ${meeting.eventName} with ${meeting.inviteeName}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setActiveMeetingId(meeting.id);

    startTransition(() => {
      void (async () => {
        const response = await fetch(`/api/bookings?id=${meeting.id}`, {
          method: "DELETE",
        });
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to cancel meeting.");
        }

        setMeetings((current) =>
          current.filter((currentMeeting) => currentMeeting.id !== meeting.id),
        );
      })().catch((cancelError) => {
        setError(
          cancelError instanceof Error
            ? cancelError.message
            : "Unable to cancel meeting.",
        );
      }).finally(() => {
        setActiveMeetingId(null);
      });
    });
  }

  return (
    <DashboardShell>
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                  Meetings
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Keep every scheduled conversation organized.
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Review what is coming up, look back at completed sessions,
                    and cancel bookings when plans change.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                  label="Upcoming"
                  value={String(upcomingMeetings.length)}
                  tone="blue"
                />
                <MetricCard
                  label="Past"
                  value={String(pastMeetings.length)}
                  tone="slate"
                />
              </div>
            </div>
          </section>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <MeetingsSection
            title="Upcoming"
            description="Future meetings are sorted so the next conversation is always first."
            meetings={upcomingMeetings}
            emptyTitle="No upcoming meetings"
            emptyDescription="New bookings will show up here as soon as invitees reserve a time."
            activeMeetingId={activeMeetingId}
            isPending={isPending}
            onCancel={handleCancel}
          />

          <MeetingsSection
            title="Past"
            description="Completed meetings stay here for quick reference."
            meetings={pastMeetings}
            emptyTitle="No past meetings"
            emptyDescription="Once a booked time passes, it will move into this section."
            activeMeetingId={activeMeetingId}
            isPending={isPending}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </DashboardShell>
  );
}

type MeetingsSectionProps = {
  title: string;
  description: string;
  meetings: MeetingRecord[];
  emptyTitle: string;
  emptyDescription: string;
  activeMeetingId: string | null;
  isPending: boolean;
  onCancel: (meeting: MeetingRecord) => void;
};

function MeetingsSection({
  title,
  description,
  meetings,
  emptyTitle,
  emptyDescription,
  activeMeetingId,
  isPending,
  onCancel,
}: MeetingsSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {meetings.length} meeting{meetings.length === 1 ? "" : "s"}
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--primary)] shadow-sm">
            <CalendarGlyph />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {emptyTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {meetings.map((meeting) => {
            const isCancelling = activeMeetingId === meeting.id && isPending;

            return (
              <article
                key={meeting.id}
                className="grid gap-5 rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,255,0.92))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] lg:grid-cols-[1.1fr_1fr_auto]"
              >
                <div className="space-y-3">
                  <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                    {meeting.eventName}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {meeting.inviteeName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {meeting.inviteeEmail}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <DetailCard
                    label="Date"
                    value={format(new Date(meeting.startTime), "EEEE, MMMM d, yyyy")}
                  />
                  <DetailCard
                    label="Time"
                    value={`${format(new Date(meeting.startTime), "h:mm a")} - ${format(
                      new Date(meeting.endTime),
                      "h:mm a",
                    )}`}
                  />
                </div>

                <div className="flex items-start justify-end">
                  <button
                    type="button"
                    onClick={() => onCancel(meeting)}
                    disabled={isCancelling}
                    className="inline-flex min-w-32 items-center justify-center rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel meeting"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "slate";
}) {
  const toneClassName =
    tone === "blue"
      ? "bg-[linear-gradient(135deg,#0f6fff,#3f8cff)] text-white shadow-[0_18px_35px_rgba(15,111,255,0.28)]"
      : "bg-slate-100 text-slate-900";

  return (
    <div className={`rounded-[24px] px-5 py-4 ${toneClassName}`}>
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-700">{value}</div>
    </div>
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
