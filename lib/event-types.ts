export type EventTypeRecord = {
  id: string;
  name: string;
  slug: string;
  durationInMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type EventTypePayload = {
  name: string;
  slug: string;
  durationInMinutes: number;
};

export const DURATION_OPTIONS = [15, 30, 45, 60, 90] as const;

export function slugifyEventType(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function normalizeEventTypeInput(input: unknown): EventTypePayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid event type payload.");
  }

  const candidate = input as Record<string, unknown>;
  const name = `${candidate.name ?? ""}`.trim();
  const slug = slugifyEventType(`${candidate.slug ?? ""}`);
  const durationValue =
    typeof candidate.durationInMinutes === "number"
      ? candidate.durationInMinutes
      : Number(candidate.durationInMinutes);

  if (!name) {
    throw new Error("Event name is required.");
  }

  if (!slug) {
    throw new Error("Slug is required.");
  }

  if (!Number.isInteger(durationValue) || durationValue <= 0) {
    throw new Error("Duration must be a positive whole number.");
  }

  return {
    name,
    slug,
    durationInMinutes: durationValue,
  };
}

export function formatDurationLabel(durationInMinutes: number) {
  if (durationInMinutes < 60) {
    return `${durationInMinutes} min`;
  }

  const hours = durationInMinutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hr`;
}
