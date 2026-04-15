export const WEEKDAY_OPTIONS = [
  { value: 1, shortLabel: "Mon", label: "Monday" },
  { value: 2, shortLabel: "Tue", label: "Tuesday" },
  { value: 3, shortLabel: "Wed", label: "Wednesday" },
  { value: 4, shortLabel: "Thu", label: "Thursday" },
  { value: 5, shortLabel: "Fri", label: "Friday" },
  { value: 6, shortLabel: "Sat", label: "Saturday" },
  { value: 0, shortLabel: "Sun", label: "Sunday" },
] as const;

const DEFAULT_TIMEZONE = "Asia/Kolkata";
const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";

export const TIMEZONE_OPTIONS = [
  "Asia/Kolkata",
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

export type AvailabilityDayRecord = {
  id?: string;
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AvailabilityPayload = {
  timezone: string;
  days: AvailabilityDayRecord[];
};

export function getDefaultAvailability(timezone = DEFAULT_TIMEZONE) {
  return WEEKDAY_OPTIONS.map((day) => ({
    dayOfWeek: day.value,
    enabled: day.value >= 1 && day.value <= 5,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    timezone,
  }));
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function normalizeTimezone(value: unknown) {
  const timezone = `${value ?? ""}`.trim();

  if (!timezone) {
    throw new Error("Timezone is required.");
  }

  return timezone;
}

export function normalizeAvailabilityInput(input: unknown): AvailabilityPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid availability payload.");
  }

  const candidate = input as Record<string, unknown>;
  const timezone = normalizeTimezone(candidate.timezone);
  const days = Array.isArray(candidate.days) ? candidate.days : null;

  if (!days || days.length !== WEEKDAY_OPTIONS.length) {
    throw new Error("Availability must include all seven days.");
  }

  const normalizedDays = WEEKDAY_OPTIONS.map((weekday) => {
    const day = days.find((entry) => {
      if (!entry || typeof entry !== "object") {
        return false;
      }

      return Number((entry as Record<string, unknown>).dayOfWeek) === weekday.value;
    });

    if (!day || typeof day !== "object") {
      throw new Error(`Missing availability for ${weekday.label}.`);
    }

    const candidateDay = day as Record<string, unknown>;
    const startTime = `${candidateDay.startTime ?? ""}`.trim();
    const endTime = `${candidateDay.endTime ?? ""}`.trim();
    const enabled = Boolean(candidateDay.enabled);

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      throw new Error(`Enter a valid start and end time for ${weekday.label}.`);
    }

    if (startTime >= endTime) {
      throw new Error(`${weekday.label} must end after it starts.`);
    }

    return {
      dayOfWeek: weekday.value,
      enabled,
      startTime,
      endTime,
      timezone,
    };
  });

  return {
    timezone,
    days: normalizedDays,
  };
}

export function shapeAvailabilityResponse(
  days: Array<{
    id: string;
    dayOfWeek: number;
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
  }>,
) {
  if (days.length === 0) {
    return {
      timezone: DEFAULT_TIMEZONE,
      days: getDefaultAvailability(DEFAULT_TIMEZONE),
      hasExistingAvailability: false,
    };
  }

  const timezone = days[0]?.timezone ?? DEFAULT_TIMEZONE;
  const daysByWeekday = new Map(days.map((day) => [day.dayOfWeek, day]));

  return {
    timezone,
    days: WEEKDAY_OPTIONS.map((weekday) => {
      const current = daysByWeekday.get(weekday.value);

      if (!current) {
        return {
          dayOfWeek: weekday.value,
          enabled: false,
          startTime: DEFAULT_START_TIME,
          endTime: DEFAULT_END_TIME,
          timezone,
        };
      }

      return {
        id: current.id,
        dayOfWeek: current.dayOfWeek,
        enabled: current.enabled,
        startTime: current.startTime,
        endTime: current.endTime,
        timezone: current.timezone,
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString(),
      };
    }),
    hasExistingAvailability: true,
  };
}
