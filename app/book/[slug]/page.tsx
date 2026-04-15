import { notFound } from "next/navigation";

import { BookingPageClient } from "./booking-page-client";

import { ensureDatabaseReady, prisma } from "@/lib/prisma";


export default async function BookEventPage({
  params,
}: PageProps<"/book/[slug]">) {
  const { slug } = await params;

  await ensureDatabaseReady();

  const [eventType, availability] = await Promise.all([
    prisma.eventType.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        durationInMinutes: true,
      },
    }),
    prisma.availability.findMany({
      where: { enabled: true },
      select: {
        dayOfWeek: true,
      },
    }),
  ]);

  if (!eventType) {
    notFound();
  }

  return (
    <BookingPageClient
      eventType={eventType}
      availabilityWeekdays={availability.map((day) => day.dayOfWeek)}
    />
  );
}
