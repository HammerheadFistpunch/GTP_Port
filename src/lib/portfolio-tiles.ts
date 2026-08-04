import type { CollectionEntry } from "astro:content";

export const portfolioTileSizeValues = [
  "standard",
  "wide",
  "tall",
  "large",
] as const;

export type PortfolioTileSize = (typeof portfolioTileSizeValues)[number];

export interface PortfolioTileSelection {
  source: string;
  tileSize?: PortfolioTileSize;
  titleOverride?: string;
  descriptionOverride?: string;
  imageOverride?: string;
  emphasis?: boolean;
}

export interface ResolvedPortfolioTile {
  title: string;
  description: string;
  image?: string;
  category?: string;
  entryType: string;
  href: string;
  tileSize: PortfolioTileSize;
  emphasis: boolean;
}

function documentId(source: string, collectionPath: string, extension: string) {
  return source
    .replaceAll("\\", "/")
    .replace(new RegExp(`^${collectionPath}/`), "")
    .replace(new RegExp(`\\.${extension}$`), "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

export function resolvePortfolioTiles(
  selections: PortfolioTileSelection[],
  entries: CollectionEntry<"entries">[],
  flexiblePages: CollectionEntry<"flexiblePages">[],
): ResolvedPortfolioTile[] {
  const entryById = new Map(entries.map((entry) => [entry.id.toLowerCase(), entry]));
  const pageById = new Map(flexiblePages.map((page) => [page.id.toLowerCase(), page]));

  return selections.flatMap<ResolvedPortfolioTile>((selection) => {
    const source = selection.source?.trim();

    if (!source) return [];

    if (source.includes("src/content/entries/")) {
      const id = documentId(source, "src/content/entries", "mdx");
      const entry = entryById.get(id);

      if (
        !entry ||
        entry.data.draft ||
        (entry.data.placement !== "portfolio" && entry.data.placement !== "both")
      ) {
        return [];
      }

      return [{
        title: selection.titleOverride || entry.data.title,
        description: selection.descriptionOverride || entry.data.description,
        image: selection.imageOverride || entry.data.coverImage,
        category: entry.data.primaryTopic,
        entryType: entry.data.entryType,
        href: `/archive/${entry.id}/`,
        tileSize: selection.tileSize || entry.data.tileSize,
        emphasis: selection.emphasis ?? false,
      }];
    }

    if (source.includes("src/content/flexible-pages/")) {
      const id = documentId(source, "src/content/flexible-pages", "md");
      const page = pageById.get(id);

      if (!page || page.data.draft) return [];

      return [{
        title: selection.titleOverride || page.data.title,
        description: selection.descriptionOverride || page.data.description,
        image: selection.imageOverride || page.data.headerImage,
        category: undefined,
        entryType: "Portfolio category",
        href: `/${page.data.path.replace(/^\/+|\/+$/g, "")}/`,
        tileSize: selection.tileSize || "standard",
        emphasis: selection.emphasis ?? false,
      }];
    }

    return [];
  });
}
