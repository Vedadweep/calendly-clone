import type { Metadata } from "next";

import { MeetingsDashboard } from "./meetings-dashboard";
import { getMeetingRecords } from "@/lib/bookings";

export const metadata: Metadata = {
  title: "Meetings | Calendly Clone",
  description: "Review upcoming and past meetings, and cancel bookings.",
};

export default async function MeetingsPage() {
  const meetings = await getMeetingRecords();

  return <MeetingsDashboard initialMeetings={meetings} />;
}
