"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { DashboardShell } from "@/app/dashboard-shell";
import {
  AnimatedPage,
  HoverCard,
  MotionButton,
  Reveal,
} from "@/app/motion-provider";
import { useConfirm, useToast } from "@/app/ui/feedback-provider";
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
  const { showToast } = useToast();
  const { confirm } = useConfirm();

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

  async function handleCancel(meeting: MeetingRecord) {
    const confirmed = await confirm({
      title: "Are you sure you want to delete?",
      description: `This will cancel ${meeting.eventName} with ${meeting.inviteeName}.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      tone: "danger",
    });

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
        showToast("Meeting deleted");
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
      <AnimatedPage>
      <main className="dashboard-page">
        <div className="dashboard-container flex flex-col gap-8 lg:gap-10">
          <Reveal>
          <section className="hero-panel p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
                  Meetings
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[2.8rem]">
                    Keep every scheduled conversation organized.
                  </h2>
                  <p className="max-w-xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
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
          </Reveal>

          {error ? (
            <Reveal>
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
            </Reveal>
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
      </AnimatedPage>
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
    <Reveal delay={0.05}>
    <section className="surface-panel p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-300">{description}</p>
        </div>
        <div className="inline-flex w-fit items-center rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-gray-300">
          {meetings.length} meeting{meetings.length === 1 ? "" : "s"}
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="empty-state mt-6 px-6 py-12 text-center">
          <div className="empty-state-icon mx-auto flex h-16 w-16 items-center justify-center rounded-[22px]">
            <CalendarGlyph />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-white">
            {emptyTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-300">
            {emptyDescription}
          </p>
          {title === "Upcoming" ? (
            <Link
              href="/event-types"
              className="button-primary mt-6 inline-flex px-5 py-3 text-sm font-semibold"
            >
              Create your first event
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
          {meetings.map((meeting) => {
            const isCancelling = activeMeetingId === meeting.id && isPending;

            return (
              <HoverCard key={meeting.id} hoverScale={1.02}>
                <article className="grid gap-5 rounded-[26px] border border-slate-800 bg-black p-5 text-white shadow-[0_18px_45px_rgba(2,6,23,0.32)] sm:p-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
                  <div className="space-y-3">
                    <div className="inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                      {meeting.eventName}
                    </div>
                    <div>
                      <h3 className="break-words text-xl font-semibold text-white">
                        {meeting.inviteeName}
                      </h3>
                      <p className="mt-1 break-all text-sm text-gray-300">
                        {meeting.inviteeEmail}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
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

                  <div className="flex items-start justify-stretch xl:justify-end">
                    <MotionButton
                      type="button"
                      onClick={() => onCancel(meeting)}
                      disabled={isCancelling}
                      className="button-danger inline-flex min-h-11 w-full items-center justify-center px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto xl:min-w-32"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel meeting"}
                    </MotionButton>
                  </div>
                </article>
              </HoverCard>
            );
          })}
        </div>
      )}
    </section>
    </Reveal>
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
      ? "bg-[linear-gradient(135deg,#006bff,#3b92ff)] text-white shadow-[0_18px_35px_rgba(0,107,255,0.24)]"
      : "bg-black text-white shadow-[0_16px_30px_rgba(2,6,23,0.28)]";

  return (
    <HoverCard hoverScale={1.025}>
      <div className={`rounded-[24px] px-5 py-4 ${toneClassName}`}>
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      </div>
    </HoverCard>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-slate-800 bg-slate-900 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-white">{value}</div>
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
