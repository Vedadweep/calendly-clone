import { normalizeAvailabilityInput, shapeAvailabilityResponse } from "@/lib/availability";
import { ensureDatabaseReady, prisma } from "@/lib/prisma";

export async function GET() {
  await ensureDatabaseReady();
  const availability = await prisma.availability.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  return Response.json(shapeAvailabilityResponse(availability));
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseReady();
    const payload = normalizeAvailabilityInput(await request.json());

    const availability = await prisma.$transaction(async (transaction: any) => {
      const existingCount = await transaction.availability.count();

      if (existingCount > 0) {
        throw new Error("Availability already exists. Use PUT to update it.");
      }

      await transaction.availability.createMany({
        data: payload.days,
      });

      return transaction.availability.findMany({
        orderBy: { dayOfWeek: "asc" },
      });
    });

    return Response.json(shapeAvailabilityResponse(availability), { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      const status =
        error.message === "Availability already exists. Use PUT to update it."
          ? 409
          : 400;

      return Response.json({ error: error.message }, { status });
    }

    return Response.json(
      { error: "Unable to create availability." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDatabaseReady();
    const payload = normalizeAvailabilityInput(await request.json());

    const availability = await prisma.$transaction(async (transaction) => {
      for (const day of payload.days) {
        await transaction.availability.upsert({
          where: { dayOfWeek: day.dayOfWeek },
          update: {
            enabled: day.enabled,
            startTime: day.startTime,
            endTime: day.endTime,
            timezone: payload.timezone,
          },
          create: day,
        });
      }

      return transaction.availability.findMany({
        orderBy: { dayOfWeek: "asc" },
      });
    });

    return Response.json(shapeAvailabilityResponse(availability));
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Unable to update availability." },
      { status: 500 },
    );
  }
}
