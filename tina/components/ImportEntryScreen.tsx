import React from "react";
import { useCMS } from "tinacms";
import {
    parseEntryImport,
    resolveImportedTags,
    validateImportedBody,
    validateImportFilename,
} from "../lib/entryImport";
import type { ImportIssue, ImportedEntry, TagRecord } from "../lib/entryImport";
import { getImageSourceError } from "../../src/lib/image-sources";

interface RegistryQueryResult {
    tagsConnection: {
        edges?: Array<{
            node?: {
                label: string;
                slug: string;
                aliases?: string[];
                active?: boolean;
                _sys: { path: string };
            };
        }>;
    };
    journalSectionsConnection: {
        edges?: Array<{
            node?: {
                label: string;
                slug: string;
                active?: boolean;
            };
        }>;
    };
}

interface CreateEntryResult {
    createEntries: { _sys: { filename: string; relativePath: string } };
}

const registryQuery = `#graphql
    query ImportEntryRegistry {
        tagsConnection(first: 250) {
            edges {
                node {
                    label
                    slug
                    aliases
                    active
                    _sys { path }
                }
            }
        }
        journalSectionsConnection(first: 100) {
            edges {
                node {
                    label
                    slug
                    active
                }
            }
        }
    }
`;

const createEntryMutation = `#graphql
    mutation CreateImportedEntry($relativePath: String!, $params: EntriesMutation!) {
        createEntries(relativePath: $relativePath, params: $params) {
            _sys { filename relativePath }
        }
    }
`;

const styles: Record<string, React.CSSProperties> = {
    main: { margin: "0 auto", maxWidth: "68rem", padding: "3rem 2rem" },
    eyebrow: { color: "#64748b", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" },
    intro: { color: "#475569", lineHeight: 1.6, maxWidth: "50rem" },
    section: { border: "1px solid #cbd5e1", borderRadius: "0.75rem", marginTop: "1.5rem", padding: "1.5rem" },
    grid: { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))" },
    field: { display: "grid", gap: "0.4rem", minWidth: 0 },
    fullField: { display: "grid", gap: "0.4rem", gridColumn: "1 / -1", minWidth: 0 },
    label: { color: "#334155", fontSize: "0.85rem", fontWeight: 700 },
    input: { boxSizing: "border-box", minWidth: 0, width: "100%", border: "1px solid #94a3b8", borderRadius: "0.4rem", padding: "0.7rem 0.75rem", font: "inherit" },
    textarea: { boxSizing: "border-box", minHeight: "10rem", minWidth: 0, width: "100%", border: "1px solid #94a3b8", borderRadius: "0.4rem", padding: "0.75rem", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", lineHeight: 1.5, resize: "vertical" },
    button: { background: "#2563eb", border: 0, borderRadius: "0.45rem", color: "white", cursor: "pointer", fontWeight: 700, padding: "0.75rem 1rem" },
    secondaryButton: { background: "white", border: "1px solid #64748b", borderRadius: "0.45rem", color: "#334155", cursor: "pointer", fontWeight: 700, padding: "0.75rem 1rem" },
    issue: { borderRadius: "0.4rem", fontSize: "0.9rem", lineHeight: 1.5, margin: "0.5rem 0 0", padding: "0.65rem 0.75rem" },
    help: { color: "#64748b", fontSize: "0.82rem", lineHeight: 1.45, margin: 0 },
};

const IssueList = ({ title, issues, error = false }: { title: string; issues: ImportIssue[]; error?: boolean }) => {
    if (!issues.length) return null;
    return (
        <div style={{ ...styles.issue, background: error ? "#fef2f2" : "#fffbeb", border: `1px solid ${error ? "#fca5a5" : "#fcd34d"}`, color: error ? "#991b1b" : "#92400e" }}>
            <strong>{title}</strong>
            <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.25rem" }}>
                {issues.map((issue, index) => <li key={`${issue.field}-${index}`}><strong>{issue.field}:</strong> {issue.message}</li>)}
            </ul>
        </div>
    );
};

const updateEntry = <K extends keyof ImportedEntry>(entry: ImportedEntry, key: K, value: ImportedEntry[K]) => ({ ...entry, [key]: value });

export const ImportEntryScreen = () => {
    const cms = useCMS();
    const [source, setSource] = React.useState("");
    const [sourceName, setSourceName] = React.useState("imported-entry.mdx");
    const [entry, setEntry] = React.useState<ImportedEntry>();
    const [parseErrors, setParseErrors] = React.useState<ImportIssue[]>([]);
    const [warnings, setWarnings] = React.useState<ImportIssue[]>([]);
    const [tagRegistry, setTagRegistry] = React.useState<TagRecord[]>([]);
    const [sections, setSections] = React.useState<Array<{ label: string; slug: string }>>([]);
    const [registryStatus, setRegistryStatus] = React.useState("Loading Topics and Journal Sections…");
    const [phase, setPhase] = React.useState<"source" | "review" | "saving" | "saved">("source");
    const [saveError, setSaveError] = React.useState("");

    React.useEffect(() => {
        let mounted = true;
        const tinaApi = cms.api.tina;
        if (!tinaApi) {
            setRegistryStatus("The Tina content API is unavailable. Reload the editor before importing.");
            return () => { mounted = false; };
        }

        tinaApi.request<RegistryQueryResult>(registryQuery, { variables: {} }).then((result) => {
            if (!mounted) return;
            const topics = (result.tagsConnection.edges || []).flatMap((edge) => edge.node && edge.node.active !== false ? [{
                label: edge.node.label,
                slug: edge.node.slug,
                aliases: edge.node.aliases || [],
                reference: edge.node._sys.path,
            }] : []);
            const journalSections = (result.journalSectionsConnection.edges || [])
                .flatMap((edge) => edge.node && edge.node.active !== false ? [{ label: edge.node.label, slug: edge.node.slug }] : [])
                .sort((a, b) => a.label.localeCompare(b.label));
            setTagRegistry(topics);
            setSections(journalSections);
            setRegistryStatus(`${topics.length} active Topics and ${journalSections.length} active Journal Sections available.`);
        }).catch(() => {
            if (mounted) setRegistryStatus("The content registry could not be loaded. Reload before importing.");
        });

        return () => { mounted = false; };
    }, [cms]);

    const loadFile = async (file?: File) => {
        if (!file) return;
        if (!/\.(md|mdx)$/i.test(file.name)) {
            setParseErrors([{ field: "file", message: "Choose a .md or .mdx file." }]);
            return;
        }
        if (file.size > 2_000_000) {
            setParseErrors([{ field: "file", message: "The import file must be smaller than 2 MB." }]);
            return;
        }
        setSourceName(file.name);
        setSource(await file.text());
        setEntry(undefined);
        setPhase("source");
        setParseErrors([]);
        setWarnings([]);
    };

    const review = () => {
        const result = parseEntryImport(source, sourceName);
        setEntry(result.entry);
        setParseErrors(result.errors);
        setWarnings(result.warnings);
        setSaveError("");
        setPhase("review");
    };

    const currentErrors = React.useMemo(() => {
        if (!entry) return parseErrors;
        const errors = parseErrors.filter((issue) => !["title", "description", "body", "coverImage"].includes(issue.field));
        const filenameError = validateImportFilename(entry.filename);
        if (filenameError) errors.push({ field: "filename", message: filenameError });
        if (!entry.title.trim()) errors.push({ field: "title", message: "Add a title before creating the draft." });
        if (!entry.description.trim()) errors.push({ field: "description", message: "Add a short description before creating the draft." });
        errors.push(...validateImportedBody(entry.body));
        const imageError = getImageSourceError(entry.coverImage);
        if (imageError) errors.push({ field: "coverImage", message: imageError });
        const resolved = resolveImportedTags(entry.tagTokens, tagRegistry);
        if (resolved.unresolved.length) {
            errors.push({ field: "topics", message: `Unknown or retired Topics: ${resolved.unresolved.join(", ")}. Add/reactivate them under Settings → Topics or remove them here.` });
        }
        if (entry.journalSection && !sections.some((section) => section.slug === entry.journalSection)) {
            errors.push({ field: "journalSection", message: `Unknown or inactive Journal Section: ${entry.journalSection}. Choose an active section or Latest only.` });
        }
        return errors;
    }, [entry, parseErrors, tagRegistry, sections]);

    const createDraft = async () => {
        if (!entry || currentErrors.length) return;
        const tinaApi = cms.api.tina;
        if (!tinaApi) {
            setSaveError("The Tina content API is unavailable. Reload the editor and try again.");
            return;
        }
        setPhase("saving");
        setSaveError("");
        const { references } = resolveImportedTags(entry.tagTokens, tagRegistry);
        const params = {
            title: entry.title.trim(),
            description: entry.description.trim(),
            date: entry.date || undefined,
            draft: true,
            journalSection: entry.journalSection || undefined,
            tags: references.map((tag) => ({ tag })),
            coverImage: entry.coverImage.trim() || undefined,
            immichGallery: entry.immichGallery,
            media: entry.media,
            body: entry.body,
        };

        try {
            await tinaApi.request<CreateEntryResult>(createEntryMutation, { variables: { relativePath: `${entry.filename}.mdx`, params } });
            cms.alerts.success("Imported Journal draft created.");
            setPhase("saved");
            window.location.hash = `#/collections/edit/entries/~/${entry.filename}`;
        } catch (error) {
            setPhase("review");
            setSaveError(error instanceof Error ? error.message : "Tina could not create the imported draft.");
        }
    };

    return (
        <main style={styles.main}>
            <p style={styles.eyebrow}>Content</p>
            <h1 style={{ fontSize: "2rem", margin: "0.4rem 0 0.75rem" }}>Import</h1>
            <p style={styles.intro}>Import portable Markdown or supported MDX, review the same metadata used by Journal entries, and create a safe draft. Import never publishes immediately.</p>

            <section style={styles.section}>
                <h2 style={{ marginTop: 0 }}>1. Choose or paste source</h2>
                <div style={styles.grid}>
                    <label style={styles.field}>
                        <span style={styles.label}>Markdown file</span>
                        <input type="file" accept=".md,.mdx,text/markdown" onChange={(event) => void loadFile(event.target.files?.[0])} />
                    </label>
                    <label style={styles.field}>
                        <span style={styles.label}>Source filename</span>
                        <input style={styles.input} value={sourceName} onChange={(event) => setSourceName(event.target.value)} />
                    </label>
                    <label style={styles.fullField}>
                        <span style={styles.label}>Markdown/MDX source</span>
                        <textarea style={{ ...styles.textarea, minHeight: "18rem" }} value={source} onChange={(event) => { setSource(event.target.value); setPhase("source"); }} placeholder={'---\ntitle: Example\ndescription: A short summary\ndate: 2026-08-07\njournalSection: projects\ntags: [astro]\n---\n\n## Article body'} />
                    </label>
                </div>
                <div style={{ marginTop: "1rem" }}><button type="button" style={styles.button} onClick={review} disabled={!source.trim()}>Review import</button></div>
            </section>

            {entry && phase !== "source" && (
                <section style={styles.section}>
                    <h2 style={{ marginTop: 0 }}>2. Complete the Journal draft</h2>
                    <p style={styles.help}>Imported entries use the same Journal model as manual creation and always start as Draft.</p>
                    <IssueList title="Fix before import" issues={currentErrors} error />
                    <IssueList title="Review these mappings" issues={warnings} />
                    <div style={{ ...styles.grid, marginTop: "1rem" }}>
                        <label style={styles.field}><span style={styles.label}>Filename</span><input style={styles.input} value={entry.filename} onChange={(event) => setEntry(updateEntry(entry, "filename", event.target.value))} /><span style={styles.help}>Saved as {entry.filename || "…"}.mdx; an existing file is never replaced.</span></label>
                        <label style={styles.field}><span style={styles.label}>Title</span><input style={styles.input} value={entry.title} onChange={(event) => setEntry(updateEntry(entry, "title", event.target.value))} /></label>
                        <label style={styles.fullField}><span style={styles.label}>Description</span><textarea style={{ ...styles.textarea, minHeight: "6rem", fontFamily: "inherit" }} value={entry.description} onChange={(event) => setEntry(updateEntry(entry, "description", event.target.value))} /></label>
                        <label style={styles.field}><span style={styles.label}>Publication date</span><input style={styles.input} type="datetime-local" value={entry.date ? entry.date.slice(0, 16) : ""} onChange={(event) => setEntry(updateEntry(entry, "date", event.target.value ? new Date(event.target.value).toISOString() : ""))} /></label>
                        <label style={styles.field}><span style={styles.label}>Journal Section</span><select style={styles.input} value={entry.journalSection} onChange={(event) => setEntry(updateEntry(entry, "journalSection", event.target.value))}><option value="">Latest only / no section</option>{sections.map((section) => <option key={section.slug} value={section.slug}>{section.label}</option>)}</select></label>
                        <label style={styles.fullField}><span style={styles.label}>Topics</span><input style={styles.input} value={entry.tagTokens.join(", ")} onChange={(event) => setEntry(updateEntry(entry, "tagTokens", event.target.value.split(",").map((token) => token.trim()).filter(Boolean)))} /><span style={styles.help}>{registryStatus} Use Topic labels or slugs separated by commas.</span></label>
                        <label style={styles.fullField}><span style={styles.label}>Cover image</span><input style={styles.input} value={entry.coverImage} onChange={(event) => setEntry(updateEntry(entry, "coverImage", event.target.value))} placeholder="/uploads/image.jpg or https://…" /></label>
                        <label style={styles.fullField}><span style={styles.label}>Imported body</span><textarea style={{ ...styles.textarea, minHeight: "24rem" }} value={entry.body} onChange={(event) => setEntry(updateEntry(entry, "body", event.target.value))} /><span style={styles.help}>After import, use the Journal Markdown toolbar for formatting, links, Media Manager images, external images, and YouTube.</span></label>
                    </div>
                    {entry.immichGallery && <p style={styles.help}>Immich gallery metadata from the source will be preserved.</p>}
                    {entry.media.length > 0 && <p style={styles.help}>{entry.media.length} structured media item{entry.media.length === 1 ? "" : "s"} will be preserved.</p>}
                    {saveError && <p role="alert" style={{ ...styles.issue, background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b" }}>{saveError}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
                        <button type="button" style={{ ...styles.button, ...(currentErrors.length || phase === "saving" ? { background: "#94a3b8", cursor: "not-allowed" } : {}) }} disabled={Boolean(currentErrors.length) || phase === "saving"} onClick={() => void createDraft()}>{phase === "saving" ? "Creating draft…" : "Create imported draft"}</button>
                        <button type="button" style={styles.secondaryButton} onClick={review} disabled={phase === "saving"}>Re-parse original source</button>
                    </div>
                </section>
            )}
        </main>
    );
};
