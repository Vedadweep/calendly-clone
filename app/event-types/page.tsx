import type { Metadata } from "next";

import { EventTypesDashboard } from "./event-types-dashboard";

export const metadata: Metadata = {
  title: "Event Types | Calendly Clone",
  description: "Create and manage your event types.",
};



export default function EventTypesPage() {
  return <EventTypesDashboard />;
}
