import { parseDocument } from "yaml";
import {
    getImageSourceError,
    isSafeRelativeMarkdownImage,
} from "../../src/lib/image-sources.ts";
import { getYouTubeEmbedUrl } from "./youtubeEmbed.ts";

export interface ImportIssue {
    field: string;
    message: string;
}

export interface ImportedMediaItem {
    type: "image" | "video";
    src: string;
    alt?: string;
    caption?: string;
}

export interface ImportedEntry {
    filename: string;
    title: string;
    description: string;
    date: string;
    journalSection: string;
    tagTokens: string[];
    coverImage: string;
    immichGallery?: {
        shareUrl: string;
        title?: string;
        imageAltPrefix?: string;
    };
    media: ImportedMediaItem[];
    body: string;
    omittedFields: string[];
}

export interface ImportResult {
    entry: ImportedEntry;
    errors: ImportIssue[];
    warnings: ImportIssue[];
}

const knownFrontmatterFields = new Set([
    "title",
    "description",
    "summary",
    "excerpt",
    "date",
    "publishedDate",
    "published_at",
    "journalSection",
    "section",
    "tags",
    "coverImage",
    "cover",
    "image",
    "featured_image",
    "immichGallery",
    "media",
    "draft",
    // Accepted only so old exports import cleanly; these values are intentionally discarded.
    "entryType",
    "type",
    "placement",
    "primaryTopic",
    "topic",
    "category",
    "technologies",
    "links",
    "updatedDate",
    "updated_at",
]);

const deprecatedFrontmatterFields = new Set([
    "entryType",
    "type",
    "placement",
    "primaryTopic",
    "topic",
    "category",
    "technologies",
    "links",
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

const titleFromSourceName = (value: string) => value
    .split(/[\\/]/)
    .pop()
    ?.replace(/\.(md|mdx)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "";

export const validateImportFilename = (value: string) => {
    if (!value) return "Enter a filename.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase letters, numbers, and single hyphens only.";
    }
    return undefined;
};

const splitFrontmatter = (source: string):
    | { error: string }
    | { yaml: string; body: string; hasFrontmatter: boolean } => {
    const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    if (!normalized.startsWith("---\n")) {
        return { yaml: "", body: normalized, hasFrontmatter: false };
    }
    const match = normalized.slice(4).match(/^((?:.|\n)*?)\n(?:---|\.\.\.)[ \t]*\n?/);
    if (!match) return { error: "The opening frontmatter has no closing --- line." };
    const bodyStart = 4 + match[0].length;
    return { yaml: match[1], body: normalized.slice(bodyStart).replace(/^\n+/, ""), hasFrontmatter: true };
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

const parseMedia = (value: unknown): ImportedMediaItem[] => {
    if (!Array.isArray(value)) return [];
    return value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const record = item as Record<string, unknown>;
        const type = stringValue(record.type);
        const src = stringValue(record.src);
        if ((type !== "image" && type !== "video") || !src) return [];
        return [{
            type,
            src,
            alt: stringValue(record.alt) || undefined,
            caption: stringValue(record.caption) || undefined,
        } as ImportedMediaItem];
    });
};

const parseImmichGallery = (value: unknown): ImportedEntry["immichGallery"] => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const record = value as Record<string, unknown>;
    const shareUrl = stringValue(record.shareUrl);
    if (!shareUrl) return undefined;
    return {
        shareUrl,
        title: stringValue(record.title) || undefined,
        imageAltPrefix: stringValue(record.imageAltPrefix) || undefined,
    };
};

export const parseEntryImport = (source: string, sourceName = "imported-entry.mdx"): ImportResult => {
    const errors: ImportIssue[] = [];
    const warnings: ImportIssue[] = [];
    const split = splitFrontmatter(source);

    const emptyEntry: ImportedEntry = {
        filename: slugify(sourceName) || "imported-entry",
        title: "",
        description: "",
        date: "",
        journalSection: "",
        tagTokens: [],
        coverImage: "",
        media: [],
        body: "",
        omittedFields: [],
    };

    if ("error" in split) {
        return {
            entry: emptyEntry,
            errors: [{ field: "frontmatter", message: split.error }],
            warnings,
        };
    }

    let document;
    if (split.hasFrontmatter) {
        try {
            document = parseDocument(split.yaml, { prettyErrors: false, uniqueKeys: true });
        } catch (error) {
            errors.push({
                field: "frontmatter",
                message: error instanceof Error ? error.message : "Frontmatter could not be parsed.",
            });
        }
        for (const error of document?.errors || []) {
            errors.push({ field: "frontmatter", message: error.message });
        }
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

    const title = firstString(frontmatter, ["title"]) || (!split.hasFrontmatter ? titleFromSourceName(sourceName) : "");
    const description = firstString(frontmatter, ["description", "summary", "excerpt"]);
    const rawSection = firstString(frontmatter, ["journalSection", "section"]);
    const coverImage = firstString(frontmatter, ["coverImage", "cover", "image", "featured_image"]);
    const filename = slugify(sourceName) || slugify(title) || "imported-entry";
    const dateSource = firstString(frontmatter, ["date", "publishedDate", "published_at"]);
    const date = dateValue(dateSource);

    if (!split.hasFrontmatter) {
        warnings.push({
            field: "frontmatter",
            message: "No YAML frontmatter was found. Review Import generated the filename and title from the source filename and placed the complete document in the body. Tina will generate canonical frontmatter when it creates the draft.",
        });
    }
    if (!title) errors.push({ field: "title", message: "Add a title before creating the draft." });
    if (!description) errors.push({ field: "description", message: "Add a short description before creating the draft." });
    if (dateSource && !date) warnings.push({ field: "date", message: `Could not map invalid date “${dateSource}”; enter a valid date in Tina.` });
    errors.push(...validateImportedBody(split.body));

    if (coverImage) {
        const imageError = getImageSourceError(coverImage);
        if (imageError) errors.push({ field: "coverImage", message: imageError });
    }

    const deprecated = Object.keys(frontmatter).filter((key) => deprecatedFrontmatterFields.has(key));
    if (deprecated.length) {
        warnings.push({
            field: "frontmatter",
            message: `Legacy fields were intentionally discarded: ${deprecated.join(", ")}. Every imported Content Entry is now a Journal entry.`,
        });
    }

    const omittedFields = Object.keys(frontmatter).filter((key) => !knownFrontmatterFields.has(key));
    if (omittedFields.length) {
        warnings.push({
            field: "frontmatter",
            message: `Unmapped frontmatter will not be copied: ${omittedFields.join(", ")}.`,
        });
    }

    return {
        entry: {
            filename,
            title,
            description,
            date,
            journalSection: rawSection,
            tagTokens: stringList(frontmatter.tags),
            coverImage,
            immichGallery: parseImmichGallery(frontmatter.immichGallery),
            media: parseMedia(frontmatter.media),
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
