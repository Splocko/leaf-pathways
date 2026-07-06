// Events data layer for the public site.
//
// - Evergreen "programmes" (navigation targets with detail pages) stay as seed
//   metadata below.
// - The live dated schedule (`getUpcomingEvents`) now reads the SAME Supabase
//   `events` table the old repo/admin CMS writes to.
// - Date/status helpers are ported from the old repo so cards render identical
//   status logic (coming soon / sold out / completed, month/day/time precision).

import { createClient } from "@supabase/supabase-js";
import { resizedStorageImage } from "@/lib/images";

export type EventProgramme = {
  slug: string;
  title: string;
  category: "Competition" | "Hackathon" | "Bootcamp";
  summary: string;
  /** Supabase storage URL. When absent the UI shows a branded fallback. */
  image?: string;
};

// Same Supabase project as the old repo. Bucket: event-images.
// TODO: official bucket name — if assets move to a new bucket, change it here.
const SUPABASE_EVENT_IMAGES =
  "https://cueuwyazwjikiogxsbrs.supabase.co/storage/v1/object/public/event-images/events";

// The evergreen programmes LEAF runs. These are navigation targets (each has a
// detail page), not dated calendar rows — the live schedule comes from the DB.
export const EVENT_PROGRAMMES: EventProgramme[] = [
  {
    slug: "commercial-awareness",
    title: "Commercial Awareness Competition",
    category: "Competition",
    summary:
      "Test your business acumen and strategic thinking against the brightest minds in the UK.",
  },
  {
    slug: "engineering-innovation",
    title: "Engineering Innovation Competition",
    category: "Competition",
    summary: "Showcase your engineering skills and solve real-world problems.",
  },
  {
    slug: "leaf-hacks",
    title: "LEAF Hacks",
    category: "Hackathon",
    summary:
      "A 24-hour build sprint for students who want to create, iterate, and pitch under pressure.",
    image: `${SUPABASE_EVENT_IMAGES}/event-1774099008481-ksnbwf.png`,
  },
  {
    slug: "finance-bootcamp",
    title: "Finance Bootcamp",
    category: "Bootcamp",
    summary: "Master the fundamentals and launch your career in finance.",
  },
  {
    slug: "apprenticeship-bootcamp",
    title: "Apprenticeship Bootcamp",
    category: "Bootcamp",
    summary:
      "Winning applications, final interview prep, and the insider knowledge that gets you hired.",
    image: `${SUPABASE_EVENT_IMAGES}/event-1774304810195-6ilfxc.png`,
  },
  {
    slug: "healthcare-bootcamp",
    title: "LEAF Healthcare Bootcamp",
    category: "Bootcamp",
    summary:
      "UCAS prep, personal statements, work experience and application support.",
    image: `${SUPABASE_EVENT_IMAGES}/event-1774222240178-gvkf8u.png`,
  },
];

export function getEventProgrammes(): EventProgramme[] {
  return EVENT_PROGRAMMES;
}

export function getEventProgramme(slug: string): EventProgramme | undefined {
  return EVENT_PROGRAMMES.find((e) => e.slug === slug);
}

// --- Event status + date helpers (ported from old repo lib/events.ts) --------

export type EventStatus =
  | "available"
  | "coming_soon"
  | "sold_out"
  | "deadline_passed"
  | "completed";

export type LegacyEventStatus = EventStatus | "past";

export type EventDatePrecision = "month" | "day" | "time";

interface EventLike {
  date?: string | null;
  event_date_precision?: EventDatePrecision | null;
  event_status?: LegacyEventStatus | null;
  is_sold_out?: boolean | null;
}

const MONTH_ONLY_PATTERN = /^(\d{4})-(\d{2})$/;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/;
const HAS_TIMEZONE_SUFFIX_PATTERN = /(Z|[+-]\d{2}:\d{2})$/i;

const isValidPrecision = (
  value?: string | null
): value is EventDatePrecision =>
  value === "month" || value === "day" || value === "time";

const extractDateParts = (dateStr: string) => {
  const monthOnlyMatch = dateStr.match(MONTH_ONLY_PATTERN);
  if (monthOnlyMatch) {
    return {
      year: Number(monthOnlyMatch[1]),
      monthIndex: Number(monthOnlyMatch[2]) - 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      matchedTime: false,
    };
  }

  const dateTimeMatch = dateStr.match(DATE_TIME_PATTERN);
  if (!dateTimeMatch) return null;

  return {
    year: Number(dateTimeMatch[1]),
    monthIndex: Number(dateTimeMatch[2]) - 1,
    day: Number(dateTimeMatch[3]),
    hour: Number(dateTimeMatch[4] || 0),
    minute: Number(dateTimeMatch[5] || 0),
    second: Number(dateTimeMatch[6] || 0),
    matchedTime: Boolean(dateTimeMatch[4]),
  };
};

const isValidDate = (date: Date) =>
  !Number.isNaN(date.getTime()) && date.getFullYear() >= 2000;

const parseLooseLocalDate = (dateStr?: string | null): Date | null => {
  if (!dateStr || dateStr.trim() === "") return null;
  const parts = extractDateParts(dateStr.trim());
  if (!parts) return null;
  const candidate = new Date(
    parts.year,
    parts.monthIndex,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    0
  );
  return isValidDate(candidate) ? candidate : null;
};

export const inferEventDatePrecision = (
  dateStr?: string | null,
  explicitPrecision?: EventDatePrecision | null
): EventDatePrecision => {
  if (isValidPrecision(explicitPrecision)) return explicitPrecision;
  if (!dateStr || dateStr.trim() === "") return "day";
  const trimmedDate = dateStr.trim();
  if (MONTH_ONLY_PATTERN.test(trimmedDate)) return "month";
  if (DATE_ONLY_PATTERN.test(trimmedDate)) return "day";
  const parts = extractDateParts(trimmedDate);
  if (!parts) return "day";
  if (!parts.matchedTime) return "day";
  return parts.hour === 0 && parts.minute === 0 && parts.second === 0
    ? "day"
    : "time";
};

export const formatEventDate = (
  dateStr?: string | null,
  explicitPrecision?: EventDatePrecision | null,
  options?: { includeWeekday?: boolean; includeTime?: boolean }
) => {
  if (!dateStr || dateStr.trim() === "") return "Date TBD";
  const precision = inferEventDatePrecision(dateStr, explicitPrecision);
  const date = parseLooseLocalDate(dateStr);
  if (!date) return "Date TBD";

  const intlOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  if (precision !== "month") intlOptions.day = "numeric";
  if (options?.includeWeekday && precision !== "month")
    intlOptions.weekday = "long";
  if (options?.includeTime && precision === "time") {
    intlOptions.hour = "2-digit";
    intlOptions.minute = "2-digit";
  }
  return date.toLocaleDateString("en-GB", intlOptions);
};

export const isEventPastByDate = (
  dateStr?: string | null,
  explicitPrecision?: EventDatePrecision | null
) => {
  if (!dateStr || dateStr.trim() === "") return false;
  const trimmedDate = dateStr.trim();
  const precision = inferEventDatePrecision(trimmedDate, explicitPrecision);
  const parts = extractDateParts(trimmedDate);
  if (!parts) return false;

  let comparisonTimestamp: number;
  if (precision === "month") {
    comparisonTimestamp = Date.UTC(parts.year, parts.monthIndex + 1, 1, 0, 0, 0, 0);
  } else if (precision === "day") {
    comparisonTimestamp = Date.UTC(parts.year, parts.monthIndex, parts.day + 1, 0, 0, 0, 0);
  } else {
    if (HAS_TIMEZONE_SUFFIX_PATTERN.test(trimmedDate)) {
      const parsedTimestamp = Date.parse(trimmedDate);
      if (Number.isFinite(parsedTimestamp)) return parsedTimestamp < Date.now();
    }
    const parsedDate = parseLooseLocalDate(trimmedDate);
    if (!parsedDate) return false;
    comparisonTimestamp = parsedDate.getTime();
  }
  return comparisonTimestamp < Date.now();
};

export const resolveEventStatus = (event: EventLike): EventStatus => {
  if (event.event_status === "past") return "completed";
  if (
    event.event_status === "available" ||
    event.event_status === "coming_soon" ||
    event.event_status === "sold_out" ||
    event.event_status === "deadline_passed" ||
    event.event_status === "completed"
  ) {
    return event.event_status;
  }
  if (event.is_sold_out) return "sold_out";
  if (isEventPastByDate(event.date, event.event_date_precision)) return "completed";
  return "available";
};

const STATUS_LABELS: Record<EventStatus, string> = {
  available: "Open",
  coming_soon: "Coming soon",
  sold_out: "Sold out",
  deadline_passed: "Deadline passed",
  completed: "Completed",
};

const pad = (value: number) => String(value).padStart(2, "0");

// Convert a raw admin form value into the canonical string stored in Supabase.
// Ported from the old repo so the admin EventsManager round-trips dates identically.
export const normalizeEventDateForStorage = (
  rawValue?: string | null,
  precision: EventDatePrecision = "day"
) => {
  if (!rawValue || rawValue.trim() === "") return null;

  const trimmedValue = rawValue.trim();

  if (precision === "month") {
    const match = trimmedValue.match(MONTH_ONLY_PATTERN);
    if (!match) return null;
    return `${match[1]}-${match[2]}-01`;
  }

  if (precision === "day") {
    const match = trimmedValue.match(DATE_ONLY_PATTERN);
    if (!match) return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const match = trimmedValue.match(DATE_TIME_PATTERN);
  if (!match || !match[4] || !match[5]) return null;
  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}`;
};

// Convert a stored date string back into the value an <input> expects.
export const formatEventDateForInput = (
  dateStr?: string | null,
  explicitPrecision?: EventDatePrecision | null
) => {
  if (!dateStr || dateStr.trim() === "") return "";

  const precision = inferEventDatePrecision(dateStr, explicitPrecision);
  const parts = extractDateParts(dateStr.trim());
  if (!parts) return "";

  const year = String(parts.year);
  const month = pad(parts.monthIndex + 1);
  const day = pad(parts.day);
  const hour = pad(parts.hour);
  const minute = pad(parts.minute);

  if (precision === "month") return `${year}-${month}`;
  if (precision === "day") return `${year}-${month}-${day}`;
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

// --- Live schedule (dated instances) from Supabase ---------------------------

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  status: string;
  href?: string;
  image?: string;
};

/** Public server-safe Supabase client (anon key). Returns null if unconfigured. */
function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Live upcoming events from the same Supabase `events` table as the old repo. */
export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .neq("is_published", false)
      .order("date", { ascending: true });
    if (error || !data) return [];
    return data
      .filter((e: any) => !isEventPastByDate(e.date, e.event_date_precision))
      .map((e: any) => ({
        id: e.id,
        title: e.title,
        date: formatEventDate(e.date, e.event_date_precision, { includeTime: true }),
        status: STATUS_LABELS[resolveEventStatus(e)],
        href: e.link || undefined,
        image: e.image_url ? resizedStorageImage(e.image_url, 800) : undefined,
      }));
  } catch {
    return [];
  }
}
