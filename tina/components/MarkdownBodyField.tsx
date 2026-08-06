import React from "react";
import type { CSSProperties, ChangeEvent, FocusEvent } from "react";
import { marked } from "marked";
import { getYouTubeEmbedUrl } from "../lib/youtubeEmbed";

type EditorMode = "write" | "split" | "preview";

interface MarkdownBodyFieldProps {
    input: {
        name: string;
        value: string;
        onChange: (event: ChangeEvent<string>) => void;
        onBlur: (event?: FocusEvent<string>) => void;
        onFocus: (event?: FocusEvent<string>) => void;
    };
    field: {
        label?: string | boolean;
        description?: string;
    };
    meta?: {
        error?: string;
        touched?: boolean;
    };
}

const allowedTags = new Set([
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "div",
    "em",
    "figcaption",
    "figure",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "iframe",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "span",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul",
]);

const blockedTags = new Set([
    "embed",
    "link",
    "meta",
    "object",
    "script",
    "style",
]);

const safeUrl = (value: string, image = false) => {
    const normalized = value.trim();

    if (/^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(normalized)) return normalized;
    if (!image && /^(mailto:|tel:)/i.test(normalized)) return normalized;

    return "";
};

const escapeHtml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const mdxAttribute = (source: string, name: string) => {
    const match = source.match(new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
    return match?.[2]?.trim() || "";
};

const replaceYouTubeEmbeds = (markdown: string) => markdown.replace(
    /<YouTube\b([^>]*)\/>/g,
    (_match, attributes: string) => {
        const title = mdxAttribute(attributes, "title") || "YouTube video";
        const caption = mdxAttribute(attributes, "caption");
        const url = mdxAttribute(attributes, "url");
        const embedUrl = getYouTubeEmbedUrl(url);
        const detail = [url, caption].filter(Boolean).map(escapeHtml).join(" — ");

        if (embedUrl) {
            return [
                '<figure class="markdown-youtube-preview">',
                '<div class="markdown-youtube-frame">',
                `<iframe class="markdown-youtube-iframe" src="${escapeHtml(embedUrl)}" title="${escapeHtml(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
                "</div>",
                caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "",
                "</figure>",
            ].join("");
        }

        return [
            '<div class="markdown-youtube-preview">',
            `<strong>${escapeHtml(title)}</strong>`,
            detail ? `<span>${detail}</span>` : "",
            "</div>",
        ].join("");
    },
);

const unsupportedMdxComponents = (markdown: string) => Array.from(
    markdown.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g),
    (match) => match[1],
).filter((name, index, names) => name !== "YouTube" && names.indexOf(name) === index);

const sanitizePreview = (html: string) => {
    const document = new DOMParser().parseFromString(html, "text/html");

    for (const element of Array.from(document.body.querySelectorAll("*"))) {
        const tag = element.tagName.toLowerCase();

        if (blockedTags.has(tag)) {
            element.remove();
            continue;
        }

        if (!allowedTags.has(tag)) {
            element.replaceWith(...Array.from(element.childNodes));
            continue;
        }

        const originalAttributes = new Map(
            Array.from(element.attributes).map((attribute) => [attribute.name, attribute.value]),
        );

        for (const attribute of Array.from(element.attributes)) {
            element.removeAttribute(attribute.name);
        }

        if (tag === "a") {
            const href = safeUrl(originalAttributes.get("href") || "");
            if (href) element.setAttribute("href", href);
            const title = originalAttributes.get("title");
            if (title) element.setAttribute("title", title);
            if (/^https?:\/\//i.test(href)) {
                element.setAttribute("target", "_blank");
                element.setAttribute("rel", "noopener noreferrer");
            }
        }

        if (tag === "img") {
            const src = safeUrl(originalAttributes.get("src") || "", true);
            if (!src) {
                element.remove();
                continue;
            }
            element.setAttribute("src", src);
            element.setAttribute("alt", originalAttributes.get("alt") || "");
            const title = originalAttributes.get("title");
            if (title) element.setAttribute("title", title);
        }

        if (tag === "iframe") {
            const src = getYouTubeEmbedUrl(originalAttributes.get("src") || "");
            if (!src) {
                element.remove();
                continue;
            }
            element.setAttribute("class", "markdown-youtube-iframe");
            element.setAttribute("src", src);
            element.setAttribute("title", originalAttributes.get("title") || "YouTube video");
            element.setAttribute("loading", "lazy");
            element.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
            element.setAttribute("allowfullscreen", "");
        }

        if (tag === "code") {
            const className = originalAttributes.get("class") || "";
            if (/^language-[a-z0-9_-]+$/i.test(className)) {
                element.setAttribute("class", className);
            }
        }

        if (tag === "figure" && originalAttributes.get("class") === "markdown-youtube-preview") {
            element.setAttribute("class", "markdown-youtube-preview");
        }

        if (tag === "div" && originalAttributes.get("class") === "markdown-youtube-frame") {
            element.setAttribute("class", "markdown-youtube-frame");
        } else if (tag === "div" && originalAttributes.get("class") === "markdown-youtube-preview") {
            element.setAttribute("class", "markdown-youtube-preview");
        }
    }

    return document.body.innerHTML;
};

const renderPreview = (markdown: string) => {
    const prepared = replaceYouTubeEmbeds(markdown);
    const rendered = marked.parse(prepared, {
        async: false,
        gfm: true,
    }) as string;

    return sanitizePreview(rendered);
};

const styles: Record<string, CSSProperties> = {
    editor: {
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        containerType: "inline-size",
    },
    toolbar: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 10,
    },
    button: {
        padding: "7px 12px",
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        color: "#374151",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
    },
    activeButton: {
        background: "#eff6ff",
        borderColor: "#2563eb",
        color: "#1d4ed8",
    },
    grid: {
        display: "grid",
        gap: 12,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
    },
    pane: {
        minWidth: 0,
        maxWidth: "100%",
        overflow: "hidden",
    },
    paneLabel: {
        display: "block",
        marginBottom: 6,
        color: "#4b5563",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    },
    textarea: {
        width: "100%",
        boxSizing: "border-box",
        minHeight: 520,
        padding: 16,
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#111827",
        color: "#f9fafb",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 14,
        lineHeight: 1.65,
        resize: "vertical",
        tabSize: 4,
    },
    preview: {
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        minHeight: 520,
        padding: 20,
        overflowX: "auto",
        overflowWrap: "anywhere",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#ffffff",
        color: "#1f2937",
        fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
        fontSize: 16,
        lineHeight: 1.7,
    },
    warning: {
        margin: "0 0 12px",
        padding: "10px 12px",
        border: "1px solid #f59e0b",
        borderRadius: 6,
        background: "#fffbeb",
        color: "#92400e",
        fontSize: 13,
        lineHeight: 1.45,
    },
    heading: {
        margin: "24px 0 4px",
        color: "#111827",
        fontSize: 16,
        fontWeight: 600,
    },
    help: {
        margin: "0 0 12px",
        color: "#6b7280",
        fontSize: 13,
        lineHeight: 1.5,
    },
    error: {
        margin: "8px 0 0",
        color: "#b91c1c",
        fontSize: 12,
    },
};

export default function MarkdownBodyField({ input, field, meta }: MarkdownBodyFieldProps) {
    const [mode, setMode] = React.useState<EditorMode>("split");
    const markdown = typeof input.value === "string" ? input.value : "";
    const html = React.useMemo(() => renderPreview(markdown), [markdown]);
    const unsupported = React.useMemo(() => unsupportedMdxComponents(markdown), [markdown]);
    const editorId = React.useId();
    const showEditor = mode !== "preview";
    const showPreview = mode !== "write";

    return (
        <div style={styles.editor}>
            <div style={styles.heading}>
                {typeof field.label === "string" ? field.label : "Entry Content (Markdown)"}
            </div>
            {field.description && <p style={styles.help}>{field.description}</p>}

            <div style={styles.toolbar} role="group" aria-label="Markdown editor view">
                {(["write", "split", "preview"] as EditorMode[]).map((option) => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={mode === option}
                        style={{
                            ...styles.button,
                            ...(mode === option ? styles.activeButton : {}),
                        }}
                        onClick={() => setMode(option)}
                    >
                        {option[0].toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {unsupported.length > 0 && (
                <p role="alert" style={styles.warning}>
                    Preview skipped unsupported MDX component{unsupported.length === 1 ? "" : "s"}: {unsupported.join(", ")}.
                    The source remains unchanged; remove or replace the component before publishing.
                </p>
            )}

            <div
                className="markdown-body-editor-grid"
                data-mode={mode}
                style={{
                    ...styles.grid,
                    gridTemplateColumns: mode === "split"
                        ? "repeat(2, minmax(0, 1fr))"
                        : "minmax(0, 1fr)",
                }}
            >
                {showEditor && (
                    <div style={styles.pane}>
                        <label htmlFor={editorId} style={styles.paneLabel}>Markdown source</label>
                        <textarea
                            id={editorId}
                            name={input.name}
                            value={markdown}
                            style={styles.textarea}
                            spellCheck
                            onChange={(event) => input.onChange(event.target.value as unknown as ChangeEvent<string>)}
                            onBlur={() => input.onBlur?.()}
                            onFocus={() => input.onFocus?.()}
                        />
                    </div>
                )}

                {showPreview && (
                    <div style={styles.pane}>
                        <span style={styles.paneLabel}>Sanitized preview</span>
                        <div
                            style={styles.preview}
                            className="markdown-body-preview"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </div>
                )}
            </div>

            <style>{`
                @container (max-width: 44rem) {
                    .markdown-body-editor-grid[data-mode="split"] {
                        grid-template-columns: minmax(0, 1fr) !important;
                    }
                }
                .markdown-body-preview > :first-child { margin-top: 0; }
                .markdown-body-preview > :last-child { margin-bottom: 0; }
                .markdown-body-preview h1,
                .markdown-body-preview h2,
                .markdown-body-preview h3 { line-height: 1.25; margin: 1.5em 0 0.6em; }
                .markdown-body-preview a { color: #2563eb; text-decoration: underline; }
                .markdown-body-preview img { display: block; width: auto; max-width: 100%; height: auto; object-fit: contain; margin: 1rem 0; border-radius: 6px; }
                .markdown-body-preview blockquote { margin: 1rem 0; padding-left: 1rem; border-left: 4px solid #9ca3af; color: #4b5563; }
                .markdown-body-preview pre { max-width: 100%; box-sizing: border-box; overflow-x: auto; padding: 1rem; border-radius: 6px; background: #111827; color: #f9fafb; }
                .markdown-body-preview code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
                .markdown-body-preview table { display: block; width: 100%; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
                .markdown-body-preview th,
                .markdown-body-preview td { padding: 0.5rem; border: 1px solid #d1d5db; text-align: left; }
                .markdown-body-preview .markdown-youtube-preview { display: grid; gap: 0.5rem; width: 100%; max-width: 100%; margin: 1rem 0; font-family: ui-sans-serif, system-ui, sans-serif; }
                .markdown-body-preview div.markdown-youtube-preview { box-sizing: border-box; padding: 1rem; border: 1px solid #93c5fd; border-radius: 6px; background: #eff6ff; }
                .markdown-body-preview .markdown-youtube-preview span,
                .markdown-body-preview .markdown-youtube-preview figcaption { color: #4b5563; font-size: 0.875rem; }
                .markdown-body-preview .markdown-youtube-frame { position: relative; width: 100%; max-width: 100%; overflow: hidden; aspect-ratio: 16 / 9; border-radius: 6px; background: #000; }
                .markdown-body-preview .markdown-youtube-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
            `}</style>

            {meta?.touched && meta.error && (
                <p role="alert" style={styles.error}>{meta.error}</p>
            )}
        </div>
    );
}
