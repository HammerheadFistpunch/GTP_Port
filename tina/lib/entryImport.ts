import { parseDocument } from "yaml";
import {
    getImageSourceError,
    isSafeRelativeMarkdownImage,
} from "../../src/lib/image-sources.ts";
import { getYouTubeEmbedUrl } from "./youtubeEmbed.ts";

export const entryTypes = ["Article", "Project", "Case Study", "Gallery"] as const;
export const entryPlacements = ["journal", "both", "portfolio"] as const;
export const entrySections = ["automotive", "projects", "field-notes", "off-topic"] as const;

export type EntryType = typeof entryTypes[number];
export type EntryPlacement = typeof entryPlacements[number];
export type EntrySection = typeof entrySections[number];

export interface ImportIssue {
    field: string;
    message: string;
}

export interface ImportedEntry {
    filename: string;
    title: string;
    description: string;
    entryType: EntryType;
    placement: EntryPlacement;
    date: string;
    updatedDate: string;
    primaryTopic: string;
    journalSection: EntrySection | "";
    tagTokens: string[];
    coverImage: string;
    technologies: string[];
    links?: {
        repository?: string;
        demo?: string;
        external?: string;
    };
    body: string;
    omittedFields: string[];
}

export interface ImportResult {
    entry: ImportedEntry;
    errors: ImportIssue[];
    warnings: ImportIssue[];
}

type ImportedLinks = ImportedEntry["links"];

const knownFrontmatterFields = new Set([
    "title",
    "description",
    "summary",
    "excerpt",
    "date",
    "publishedDate",
    "published_at",
    "updatedDate",
    "updated_at",
    "entryType",
    "type",
    "placement",
    "primaryTopic",
    "topic",
    "category",
    "journalSection",
    "section",
    "tags",
    "coverImage",
    "cover",
    "image",
    "featured_image",
    "technologies",
    "links",
    "draft",
]);

const stringValue = (value: unknown) => typeof value === "string" ? value.trim() : "";

const firstString = (frontmatter: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
        const value = stringValue(frontmatter[key]);
        if (value) return value;
    }
    return "";
};

const stringList = (value: unknown) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === "string") return item.trim();
                if (item && typeof item === "object" && "tag" in item) {
                    return stringValue((item as { tag?: unknown }).tag);
                }
                return "";
            })
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return [];
};

const dateValue = (value: unknown) => {
    if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString();
    if (typeof value !== "string" || !value.trim()) return "";

    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? "" : parsed.toISOString();
};

const slugify = (value: string) => value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.(md|mdx)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

export const validateImportFilename = (value: string) => {
    if (!value) return "Enter a filename.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase letters, numbers, and single hyphens only.";
    }
    return undefined;
};

const splitFrontmatter = (source: string):
    | { error: string }
    | { yaml: string; body: string } => {
    const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    if (!normalized.startsWith("---\n")) {
        return { error: "The file must begin with YAML frontmatter between --- lines." };
    }

    const match = normalized.slice(4).match(/^((?:.|\n)*?)\n(?:---|\.\.\.)[ \t]*\n?/);
    if (!match) {
        return { error: "The opening frontmatter has no closing --- line." };
    }

    const bodyStart = 4 + match[0].length;
    return {
        yaml: match[1],
        body: normalized.slice(bodyStart).replace(/^\n+/, ""),
    };
};

const maskMarkdownCode = (body: string) => body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`\n]*`/g, "");

const markdownDestinations = (body: string, image: boolean) => {
    const expression = image
        ? /!\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g
        : /(?<!!)\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
    return Array.from(body.matchAll(expression), (match) => match[1]);
};

const safeLink = (value: string) => {
    const normalized = value.trim();
    if (/^(#|\/[^/]|\.\/)/.test(normalized)) return !normalized.includes("\\");
    if (/^(mailto:|tel:)/i.test(normalized)) return true;

    try {
        const url = new URL(normalized);
        return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
    } catch {
        return false;
    }
};

const mdxAttribute = (source: string, name: string) => {
    const match = source.match(new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
    return match?.[2]?.trim() || "";
};

export const validateImportedBody = (body: string): ImportIssue[] => {
    const errors: ImportIssue[] = [];
    if (!body.trim()) return [{ field: "body", message: "The imported Markdown body is empty." }];

    const maskedBody = maskMarkdownCode(body);
    const componentNames = Array.from(
        maskedBody.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g),
        (match) => match[1],
    ).filter((name, index, names) => name !== "YouTube" && names.indexOf(name) === index);

    if (componentNames.length) {
        errors.push({
            field: "body",
            message: `Unsupported MDX component${componentNames.length === 1 ? "" : "s"}: ${componentNames.join(", ")}. Convert to portable Markdown before importing.`,
        });
    }
    if (/^\s*(?:import|export)\s/m.test(maskedBody)) {
        errors.push({ field: "body", message: "MDX import/export statements are not supported. Remove them before importing." });
    }
    if (/(^|[^\\])\{[^\n{}]+\}/m.test(maskedBody)) {
        errors.push({ field: "body", message: "Executable MDX expressions are not supported. Replace {...} expressions with Markdown text." });
    }
    const rawHtml = Array.from(
        maskedBody.matchAll(/<(?!https?:\/\/|mailto:|tel:)\/?([a-z][a-z0-9-]*)\b[^>]*>/g),
        (match) => match[1],
    ).filter((name, index, names) => names.indexOf(name) === index);
    if (rawHtml.length) {
        errors.push({
            field: "body",
            message: `Raw HTML tag${rawHtml.length === 1 ? "" : "s"} must be converted to portable Markdown: ${rawHtml.join(", ")}.`,
        });
    }

    for (const match of maskedBody.matchAll(/<YouTube\b([^>]*)\/>/g)) {
        const url = mdxAttribute(match[1], "url");
        if (!getYouTubeEmbedUrl(url)) {
            errors.push({ field: "body", message: "A YouTube component has a missing or unsupported HTTPS YouTube URL." });
        }
    }
    const youtubeOpenings = (maskedBody.match(/<YouTube\b/g) || []).length;
    const supportedYouTube = (maskedBody.match(/<YouTube\b[^>]*\/>/g) || []).length;
    if (youtubeOpenings !== supportedYouTube) {
        errors.push({ field: "body", message: "YouTube components must use the supported self-closing <YouTube ... /> form." });
    }

    for (const image of markdownDestinations(body, true)) {
        if (getImageSourceError(image) && !isSafeRelativeMarkdownImage(image)) {
            errors.push({ field: "body", message: `Unsafe or unsupported Markdown image source: ${image}` });
        }
    }
    for (const link of markdownDestinations(body, false)) {
        if (!safeLink(link)) {
            errors.push({ field: "body", message: `Unsafe or unsupported Markdown link: ${link}` });
        }
    }

    return errors;
};

export const validateImportedLinks = (links?: ImportedLinks): ImportIssue[] => {
    if (!links) return [];
    return Object.entries(links).flatMap(([name, value]) =>
        value && !safeLink(value) ? [{
            field: `links.${name}`,
            message: `Entry link must be an HTTP(S), site-relative, mailto, or tel URL without embedded credentials: ${value}`,
        }] : [],
    );
};

const normalizeEntryType = (value: string): EntryType => {
    const match = entryTypes.find((option) => option.toLowerCase() === value.toLowerCase());
    return match || "Article";
};

const normalizePlacement = (value: string): EntryPlacement =>
    entryPlacements.includes(value as EntryPlacement) ? value as EntryPlacement : "journal";

const normalizeSection = (value: string): EntrySection | "" =>
    entrySections.includes(value as EntrySection) ? value as EntrySection : "";

export const parseEntryImport = (source: string, sourceName = "imported-entry.mdx"): ImportResult => {
    const errors: ImportIssue[] = [];
    const warnings: ImportIssue[] = [];
    const split = splitFrontmatter(source);

    if ("error" in split) {
        return {
            entry: {
                filename: slugify(sourceName) || "imported-entry",
                title: "",
                description: "",
                entryType: "Article",
                placement: "journal",
                date: "",
                updatedDate: "",
                primaryTopic: "",
                journalSection: "",
                tagTokens: [],
                coverImage: "",
                technologies: [],
                body: "",
                omittedFields: [],
            },
            errors: [{ field: "frontmatter", message: split.error }],
            warnings,
        };
    }

    let document;
    try {
        document = parseDocument(split.yaml, {
            prettyErrors: false,
            uniqueKeys: true,
        });
    } catch (error) {
        errors.push({
            field: "frontmatter",
            message: error instanceof Error ? error.message : "Frontmatter could not be parsed.",
        });
    }

    for (const error of document?.errors || []) {
        errors.push({ field: "frontmatter", message: error.message });
    }

    let parsed: unknown;
    try {
        parsed = document?.toJS({ maxAliasCount: 20 });
    } catch (error) {
        errors.push({
            field: "frontmatter",
            message: error instanceof Error ? error.message : "Frontmatter aliases could not be resolved safely.",
        });
    }
    const frontmatter = parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};

    if (parsed && (typeof parsed !== "object" || Array.isArray(parsed))) {
        errors.push({ field: "frontmatter", message: "Frontmatter must be a YAML key/value object." });
    }

    const title = firstString(frontmatter, ["title"]);
    const description = firstString(frontmatter, ["description", "summary", "excerpt"]);
    const primaryTopic = firstString(frontmatter, ["primaryTopic", "topic", "category"]);
    const rawEntryType = firstString(frontmatter, ["entryType", "type"]);
    const rawPlacement = firstString(frontmatter, ["placement"]);
    const rawSection = firstString(frontmatter, ["journalSection", "section"]);
    const coverImage = firstString(frontmatter, ["coverImage", "cover", "image", "featured_image"]);
    const filename = slugify(sourceName) || slugify(title) || "imported-entry";

    if (!title) errors.push({ field: "title", message: "Add a title before creating the draft." });
    if (!description) errors.push({ field: "description", message: "Add a short description before creating the draft." });
    if (!primaryTopic) errors.push({ field: "primaryTopic", message: "Add a broad primary topic before creating the draft." });
    errors.push(...validateImportedBody(split.body));

    if (rawEntryType && !entryTypes.some((option) => option.toLowerCase() === rawEntryType.toLowerCase())) {
        warnings.push({ field: "entryType", message: `Unknown entry type “${rawEntryType}” was mapped to Article.` });
    }
    if (rawPlacement && !entryPlacements.includes(rawPlacement as EntryPlacement)) {
        warnings.push({ field: "placement", message: `Unknown placement “${rawPlacement}” was mapped to Journal.` });
    }
    if (rawSection && !entrySections.includes(rawSection as EntrySection)) {
        warnings.push({ field: "journalSection", message: `Unknown Journal section “${rawSection}” needs a valid selection.` });
    }

    for (const [key, value] of [
        ["date", firstString(frontmatter, ["date", "publishedDate", "published_at"])],
        ["updatedDate", firstString(frontmatter, ["updatedDate", "updated_at"])],
    ] as const) {
        if (value && !dateValue(value)) {
            warnings.push({ field: key, message: `Could not map invalid date “${value}”; enter a valid date in Tina.` });
        }
    }

    if (coverImage) {
        const imageError = getImageSourceError(coverImage);
        if (imageError) errors.push({ field: "coverImage", message: imageError });
    }

    const omittedFields = Object.keys(frontmatter).filter((key) => !knownFrontmatterFields.has(key));
    if (omittedFields.length) {
        warnings.push({
            field: "frontmatter",
            message: `Unmapped frontmatter will not be copied: ${omittedFields.join(", ")}.`,
        });
    }

    const rawLinks = frontmatter.links && typeof frontmatter.links === "object" && !Array.isArray(frontmatter.links)
        ? frontmatter.links as Record<string, unknown>
        : undefined;
    const links = rawLinks ? {
        repository: stringValue(rawLinks.repository) || undefined,
        demo: stringValue(rawLinks.demo) || undefined,
        external: stringValue(rawLinks.external) || undefined,
    } : undefined;

    errors.push(...validateImportedLinks(links));

    return {
        entry: {
            filename,
            title,
            description,
            entryType: normalizeEntryType(rawEntryType),
            placement: normalizePlacement(rawPlacement),
            date: dateValue(firstString(frontmatter, ["date", "publishedDate", "published_at"])),
            updatedDate: dateValue(firstString(frontmatter, ["updatedDate", "updated_at"])),
            primaryTopic,
            journalSection: normalizeSection(rawSection),
            tagTokens: stringList(frontmatter.tags),
            coverImage,
            technologies: stringList(frontmatter.technologies),
            links,
            body: split.body,
            omittedFields,
        },
        errors,
        warnings,
    };
};

export interface TagRecord {
    label: string;
    slug: string;
    aliases?: string[];
    reference: string;
}

export const resolveImportedTags = (tokens: string[], registry: TagRecord[]) => {
    const references: string[] = [];
    const unresolved: string[] = [];

    for (const token of tokens.map((item) => item.trim()).filter(Boolean)) {
        const normalized = token
            .replace(/^src\/content\/tags\//, "")
            .replace(/\.md$/, "")
            .toLowerCase();
        const match = registry.find((tag) =>
            tag.slug.toLowerCase() === normalized ||
            tag.label.toLowerCase() === token.toLowerCase() ||
            tag.aliases?.some((alias) => alias.toLowerCase() === normalized),
        );

        if (!match) {
            unresolved.push(token);
            continue;
        }
        if (!references.includes(match.reference)) references.push(match.reference);
    }

    return { references, unresolved };
};
