import { DashboardRouteSkeleton } from "@/app/ui/page-skeletons";

export default function Loading() {
  return (
    <DashboardRouteSkeleton
      badge="Meetings"
      title="Keep every scheduled conversation organized."
      description="Loading scheduled meetings."
      cards={2}
    />
  );
}
