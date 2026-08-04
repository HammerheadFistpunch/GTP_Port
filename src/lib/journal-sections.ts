export const journalSections = [
  {
    slug: "automotive",
    label: "Automotive",
    description: "Vehicles, engineering, maintenance, and the systems that move us.",
  },
  {
    slug: "projects",
    label: "Projects",
    description: "Things built, tested, revised, and learned from along the way.",
  },
  {
    slug: "field-notes",
    label: "Field Notes",
    description: "Observations from technology, photography, travel, and the wider world.",
  },
  {
    slug: "off-topic",
    label: "Off-topic",
    description: "Useful detours that do not fit neatly anywhere else.",
  },
] as const;

export const journalSectionSlugs = journalSections.map(({ slug }) => slug) as [
  (typeof journalSections)[number]["slug"],
  ...(typeof journalSections)[number]["slug"][],
];

export type JournalSectionSlug = (typeof journalSections)[number]["slug"];

export const journalSectionOptions = journalSections.map(({ slug, label }) => ({
  value: slug,
  label,
}));

export const getJournalSection = (slug?: string) =>
  journalSections.find((section) => section.slug === slug);

export const journalSectionHref = (slug: JournalSectionSlug) =>
  `/journal/${slug}/`;
