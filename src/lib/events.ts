// Evergreen event "programmes" — static seed metadata for the /events/* detail
// pages. No database, no external calls. (Trimmed down from the live-data
// version during the fallback strip — see archive/full-db-version for that.)

export type EventProgramme = {
  slug: string;
  title: string;
  category: "Competition" | "Hackathon" | "Bootcamp";
  summary: string;
  image?: string;
};

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
  },
  {
    slug: "healthcare-bootcamp",
    title: "LEAF Healthcare Bootcamp",
    category: "Bootcamp",
    summary:
      "UCAS prep, personal statements, work experience and application support.",
  },
];

export function getEventProgrammes(): EventProgramme[] {
  return EVENT_PROGRAMMES;
}

export function getEventProgramme(slug: string): EventProgramme | undefined {
  return EVENT_PROGRAMMES.find((e) => e.slug === slug);
}
