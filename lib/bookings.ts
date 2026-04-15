import { addMinutes, format, isBefore, parseISO, set } from "date-fns";

import { ensureDatabaseReady, prisma } from "@/lib/prisma";

type EventTypeSummary = {
  id: string;
  name: string;
  slug: string;
  durationInMinutes: number;
};

type AvailabilitySummary = {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
};

type BookingInput = {
  eventTypeId: string;
  name: string;
  email: string;
  date: string;
  time: string;
};

type MeetingRecord = {
  id: string;
  eventName: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string;
  endTime: string;
};

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTimeString(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function parseClockTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return { hours, minutes };
}

function buildDateTime(date: string, time: string) {
  const baseDate = parseISO(`${date}T00:00:00`);
  const { hours, minutes } = parseClockTime(time);

  return set(baseDate, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });
}

export function formatBookingTime(date: Date) {
  return format(date, "h:mm a");
}

export function formatBookingDate(date: Date) {
  return format(date, "EEEE, MMMM d, yyyy");
}

export async function getBookableEventType(slug: string) {
  await ensureDatabaseReady();

  return prisma.eventType.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      durationInMinutes: true,
    },
  });
}

async function getAvailabilityForWeekday(dayOfWeek: number) {
  await ensureDatabaseReady();

  return prisma.availability.findUnique({
    where: { dayOfWeek },
    select: {
      dayOfWeek: true,
      enabled: true,
      startTime: true,
      endTime: true,
      timezone: true,
    },
  });
}

async function getBookingsForRange(start: Date, end: Date) {
  await ensureDatabaseReady();

  return prisma.booking.findMany({
    where: {
      startTime: {
        gte: start,
        lt: end,
      },
    },
    select: {
      startTime: true,
    },
  });
}

export async function getAvailableSlots(eventTypeId: string, date: string) {
  await ensureDatabaseReady();

  if (!isValidDateString(date)) {
    throw new Error("Select a valid date.");
  }

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    select: {
      id: true,
      name: true,
      slug: true,
      durationInMinutes: true,
    },
  });

  if (!eventType) {
    throw new Error("Event type not found.");
  }

  const dayStart = parseISO(`${date}T00:00:00`);
  const dayEnd = addMinutes(dayStart, 24 * 60);
  const weekday = dayStart.getDay();
  const availability = await getAvailabilityForWeekday(weekday);

  if (!availability?.enabled) {
    return {
      eventType,
      timezone: availability?.timezone ?? "Asia/Kolkata",
      slots: [] as Array<{ time: string; label: string }>,
    };
  }

  const start = buildDateTime(date, availability.startTime);
  const end = buildDateTime(date, availability.endTime);
  const bookings = await getBookingsForRange(dayStart, dayEnd);
  const bookedTimes = new Set(
    bookings.map((booking) => format(booking.startTime, "HH:mm")),
  );
  const now = new Date();
  const slots: Array<{ time: string; label: string }> = [];

  for (
    let cursor = start;
    cursor < end;
    cursor = addMinutes(cursor, eventType.durationInMinutes)
  ) {
    const slotEnd = addMinutes(cursor, eventType.durationInMinutes);

    if (slotEnd > end || isBefore(cursor, now) || bookedTimes.has(format(cursor, "HH:mm"))) {
      continue;
    }

    slots.push({
      time: format(cursor, "HH:mm"),
      label: formatBookingTime(cursor),
    });
  }

  return {
    eventType,
    timezone: availability.timezone,
    slots,
  };
}

export async function getUnavailableDates(slug: string, monthsToShow = 2) {
  const eventType = await getBookableEventType(slug);

  if (!eventType) {
    throw new Error("Event type not found.");
  }

  await ensureDatabaseReady();

  const availability = await prisma.availability.findMany({
    where: { enabled: true },
    select: { dayOfWeek: true },
  });

  const availableWeekdays = new Set(availability.map((day) => day.dayOfWeek));
  const today = new Date();
  const start = set(today, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const end = addMinutes(start, monthsToShow * 31 * 24 * 60);
  const dates: string[] = [];

  for (
    let cursor = start;
    cursor <= end;
    cursor = addMinutes(cursor, 24 * 60)
  ) {
    if (!availableWeekdays.has(cursor.getDay())) {
      dates.push(format(cursor, "yyyy-MM-dd"));
    }
  }

  return dates;
}

export function normalizeBookingInput(input: unknown): BookingInput {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid booking payload.");
  }

  const candidate = input as Record<string, unknown>;
  const eventTypeId = `${candidate.eventTypeId ?? ""}`.trim();
  const name = `${candidate.name ?? ""}`.trim();
  const email = `${candidate.email ?? ""}`.trim().toLowerCase();
  const date = `${candidate.date ?? ""}`.trim();
  const time = `${candidate.time ?? ""}`.trim();

  if (!eventTypeId) {
    throw new Error("Event type is required.");
  }

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (!isValidDateString(date)) {
    throw new Error("Select a valid date.");
  }

  if (!isValidTimeString(time)) {
    throw new Error("Select a valid time slot.");
  }

  return {
    eventTypeId,
    name,
    email,
    date,
    time,
  };
}

export async function createBooking(input: BookingInput) {
  const availableSlots = await getAvailableSlots(input.eventTypeId, input.date);
  const selectedSlot = availableSlots.slots.find((slot) => slot.time === input.time);

  if (!selectedSlot) {
    throw new Error("This time is no longer available.");
  }

  const startTime = buildDateTime(input.date, input.time);
  const endTime = addMinutes(startTime, availableSlots.eventType.durationInMinutes);

  const booking = await prisma.booking.create({
    data: {
      eventTypeId: input.eventTypeId,
      guestName: input.name,
      guestEmail: input.email,
      startTime,
      endTime,
    },
    select: {
      id: true,
      guestName: true,
      guestEmail: true,
      startTime: true,
      endTime: true,
      eventType: {
        select: {
          id: true,
          name: true,
          slug: true,
          durationInMinutes: true,
        },
      },
    },
  });

  return {
    id: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    startTime: booking.startTime,
    endTime: booking.endTime,
    eventType: booking.eventType,
  };
}

export async function getMeetingRecords() {
  await ensureDatabaseReady();

  const bookings = await prisma.booking.findMany({
    orderBy: {
      startTime: "asc",
    },
    select: {
      id: true,
      guestName: true,
      guestEmail: true,
      startTime: true,
      endTime: true,
      eventType: {
        select: {
          name: true,
        },
      },
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    eventName: booking.eventType.name,
    inviteeName: booking.guestName,
    inviteeEmail: booking.guestEmail,
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
  }));
}

export async function deleteBooking(id: string) {
  await ensureDatabaseReady();

  return prisma.booking.delete({
    where: { id },
    select: { id: true },
  });
}

export type { AvailabilitySummary, EventTypeSummary, MeetingRecord };
