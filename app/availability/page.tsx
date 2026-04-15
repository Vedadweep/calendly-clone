import type { Metadata } from "next";

import { AvailabilityDashboard } from "./availability-dashboard";

export const metadata: Metadata = {
  title: "Availability | Calendly Clone",
  description: "Set your weekly availability and timezone.",
};

export default function AvailabilityPage() {
  return <AvailabilityDashboard />;
}
