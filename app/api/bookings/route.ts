import { Prisma } from "@prisma/client";

import {
  createBooking,
  deleteBooking,
  formatBookingDate,
  formatBookingTime,
  getAvailableSlots,
  getMeetingRecords,
  normalizeBookingInput,
} from "@/lib/bookings";

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventTypeId = searchParams.get("eventTypeId")?.trim() ?? "";
  const date = searchParams.get("date")?.trim() ?? "";

  if (!eventTypeId && !date) {
    try {
      const bookings = await getMeetingRecords();
      return Response.json({ bookings });
    } catch {
      return Response.json(
        { error: "Unable to load bookings." },
        { status: 500 },
      );
    }
  }

  if (!eventTypeId) {
    return Response.json({ error: "Event type is required." }, { status: 400 });
  }

  if (!date) {
    return Response.json({ error: "Date is required." }, { status: 400 });
  }

  try {
    const availability = await getAvailableSlots(eventTypeId, date);

    return Response.json(availability);
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === "Event type not found." ? 404 : 400;
      return Response.json({ error: error.message }, { status });
    }

    return Response.json(
      { error: "Unable to load available slots." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const input = normalizeBookingInput(await request.json());
    const booking = await createBooking(input);

    return Response.json(
      {
        booking: {
          id: booking.id,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          dateLabel: formatBookingDate(booking.startTime),
          timeLabel: formatBookingTime(booking.startTime),
          eventType: booking.eventType,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return Response.json(
        { error: "This time is no longer available." },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      const status =
        error.message === "Event type not found."
          ? 404
          : error.message === "This time is no longer available."
            ? 409
            : 400;

      return Response.json({ error: error.message }, { status });
    }

    return Response.json({ error: "Unable to create booking." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("id")?.trim() ?? "";

  if (!bookingId) {
    return Response.json({ error: "Booking id is required." }, { status: 400 });
  }

  try {
    await deleteBooking(bookingId);

    return Response.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Booking not found." }, { status: 404 });
    }

    return Response.json({ error: "Unable to cancel booking." }, { status: 500 });
  }
}
