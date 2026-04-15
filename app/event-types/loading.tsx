import { DashboardRouteSkeleton } from "@/app/ui/page-skeletons";

export default function Loading() {
  return (
    <DashboardRouteSkeleton
      badge="Event Types"
      title="Design booking options your guests can trust."
      description="Loading your event types."
      cards={3}
    />
  );
}
