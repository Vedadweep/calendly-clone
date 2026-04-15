import { Prisma } from "@prisma/client";
import { normalizeEventTypeInput } from "@/lib/event-types";
import { ensureDatabaseReady, prisma } from "@/lib/prisma";

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/event-types/[id]">,
) {
  await ensureDatabaseReady();
  const { id } = await context.params;
  const eventType = await prisma.eventType.findUnique({
    where: { id },
  });

  if (!eventType) {
    return Response.json({ error: "Event type not found." }, { status: 404 });
  }

  return Response.json({ eventType });
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/event-types/[id]">,
) {
  await ensureDatabaseReady();
  const { id } = await context.params;

  try {
    const payload = normalizeEventTypeInput(await request.json());
    const eventType = await prisma.eventType.update({
      where: { id },
      data: payload,
    });

    return Response.json({ eventType });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Event type not found." }, { status: 404 });
    }

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
      { error: "Unable to update event type." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/event-types/[id]">,
) {
  await ensureDatabaseReady();
  const { id } = await context.params;

  try {
    await prisma.eventType.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Event type not found." }, { status: 404 });
    }

    return Response.json(
      { error: "Unable to delete event type." },
      { status: 500 },
    );
  }
}
