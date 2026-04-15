import { DashboardShell } from "@/app/dashboard-shell";

export function DashboardRouteSkeleton({
  badge,
  title,
  description,
  cards = 3,
}: {
  badge: string;
  title: string;
  description: string;
  cards?: number;
}) {
  return (
    <DashboardShell>
      <main className="dashboard-page">
        <div className="dashboard-container flex flex-col gap-8 lg:gap-10">
          <section className="hero-panel animate-pulse p-6 sm:p-8 lg:p-10">
            <div className="inline-flex rounded-full bg-[var(--panel-muted)] px-3 py-1 text-sm font-medium text-[var(--primary-strong)]">
              {badge}
            </div>
            <div className="mt-5 text-3xl font-semibold tracking-tight text-transparent">
              {title}
            </div>
            <div className="mt-4 text-base text-transparent">{description}</div>
            <div className="mt-5 h-11 max-w-2xl rounded-full bg-slate-200/80 dark:bg-slate-700/70" />
            <div className="mt-4 h-5 max-w-3xl rounded-full bg-slate-200/70 dark:bg-slate-700/60" />
            <div className="mt-3 h-5 max-w-2xl rounded-full bg-slate-200/60 dark:bg-slate-700/50" />
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: cards }).map((_, index) => (
              <article
                key={index}
                className="surface-panel min-h-64 animate-pulse p-6 sm:p-7"
              >
                <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="mt-6 h-8 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="mt-3 h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="mt-10 h-11 w-full rounded-2xl bg-slate-200 dark:bg-slate-700" />
              </article>
            ))}
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}

export function BookingRouteSkeleton() {
  return (
    <main className="dashboard-page min-h-screen">
      <div className="dashboard-container flex max-w-6xl flex-col gap-6 lg:gap-8">
        <section className="hero-panel animate-pulse p-6 sm:p-8 lg:p-10">
          <div className="h-7 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-5 h-11 max-w-2xl rounded-full bg-slate-200/80 dark:bg-slate-700/70" />
          <div className="mt-4 h-5 max-w-3xl rounded-full bg-slate-200/70 dark:bg-slate-700/60" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="surface-panel min-h-[28rem] animate-pulse p-6">
            <div className="h-6 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mt-6 h-80 rounded-[24px] bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="surface-panel min-h-[28rem] animate-pulse p-6">
            <div className="h-6 w-48 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
