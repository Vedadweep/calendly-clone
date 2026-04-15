import { Prisma } from "@prisma/client";
import { normalizeEventTypeInput } from "@/lib/event-types";
import { ensureDatabaseReady, prisma } from "@/lib/prisma";

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function GET() {
  await ensureDatabaseReady();
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ eventTypes });
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseReady();
    const payload = normalizeEventTypeInput(await request.json());
    const eventType = await prisma.eventType.create({
      data: payload,
    });

    return Response.json({ eventType }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return Response.json(
        { error: "This slug is already in use. Pick another one." },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Unable to create event type." },
      { status: 500 },
    );
  }
}
