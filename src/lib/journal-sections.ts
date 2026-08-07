import type { CollectionEntry } from "astro:content";

export type JournalSectionEntry = CollectionEntry<"journalSections">;

export interface ResolvedJournalSection {
  id: string;
  label: string;
  slug: string;
  description: string;
  active: boolean;
  aliases: string[];
}

export interface JournalSectionRegistry {
  byId: Map<string, ResolvedJournalSection>;
  byRoute: Map<string, ResolvedJournalSection>;
  active: ResolvedJournalSection[];
}

export const journalSectionReferenceId = (reference?: string) => {
  if (!reference) return "";
  const normalized = reference.replaceAll("\\", "/");
  const match = normalized.match(/(?:^|\/)journal-sections\/([^/]+)\.md$/);
  return match?.[1] || "";
};

export const createJournalSectionRegistry = (
  documents: JournalSectionEntry[],
): JournalSectionRegistry => {
  const sections = documents.map((document) => ({
    id: document.id,
    label: document.data.label,
    slug: document.data.slug,
    description: document.data.description || "",
    active: document.data.active,
    aliases: document.data.aliases,
  }));

  const byId = new Map(sections.map((section) => [section.id, section]));
  const byRoute = new Map<string, ResolvedJournalSection>();

  for (const section of sections) {
    byRoute.set(section.slug, section);
    for (const alias of section.aliases) byRoute.set(alias, section);
  }

  return {
    byId,
    byRoute,
    active: sections
      .filter((section) => section.active)
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
};

export const resolveJournalSection = (
  reference: string | undefined,
  registry: JournalSectionRegistry,
) => {
  if (!reference) return undefined;
  const id = journalSectionReferenceId(reference);
  if (id) return registry.byId.get(id);
  return registry.byRoute.get(reference);
};

export const journalSectionMatches = (
  reference: string | undefined,
  section: ResolvedJournalSection,
) => {
  const id = journalSectionReferenceId(reference);
  return id ? id === section.id : reference === section.slug || section.aliases.includes(reference || "");
};

export const journalSectionHref = (slug: string) => `/journal/${slug}/`;
