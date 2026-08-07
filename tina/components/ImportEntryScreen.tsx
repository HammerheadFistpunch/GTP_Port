import React from "react";
import { useCMS } from "tinacms";
import {
    entryPlacements,
    entrySections,
    entryTypes,
    parseEntryImport,
    resolveImportedTags,
    validateImportedBody,
    validateImportedLinks,
    validateImportFilename,
} from "../lib/entryImport";
import type {
    ImportIssue,
    ImportedEntry,
    TagRecord,
} from "../lib/entryImport";
import { getImageSourceError } from "../../src/lib/image-sources";

interface TagsQueryResult {
    tagsConnection: {
        edges?: Array<{
            node?: {
                label: string;
                slug: string;
                aliases?: string[];
                _sys: { path: string };
            };
        }>;
    };
}

interface CreateEntryResult {
    createEntries: {
        _sys: { filename: string; relativePath: string };
    };
}

const tagsQuery = `#graphql
    query ImportEntryTags {
        tagsConnection(first: 250) {
            edges {
                node {
                    label
                    slug
                    aliases
                    _sys { path }
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

const updateEntry = <K extends keyof ImportedEntry>(
    entry: ImportedEntry,
    key: K,
    value: ImportedEntry[K],
) => ({ ...entry, [key]: value });

const updateLink = (
    entry: ImportedEntry,
    key: "repository" | "demo" | "external",
    value: string,
) => ({
    ...entry,
    links: { ...entry.links, [key]: value || undefined },
});

export const ImportEntryScreen = () => {
    const cms = useCMS();
    const [source, setSource] = React.useState("");
    const [sourceName, setSourceName] = React.useState("imported-entry.mdx");
    const [entry, setEntry] = React.useState<ImportedEntry>();
    const [parseErrors, setParseErrors] = React.useState<ImportIssue[]>([]);
    const [warnings, setWarnings] = React.useState<ImportIssue[]>([]);
    const [tagRegistry, setTagRegistry] = React.useState<TagRecord[]>([]);
    const [tagStatus, setTagStatus] = React.useState("Loading the controlled tag registry…");
    const [phase, setPhase] = React.useState<"source" | "review" | "saving" | "saved">("source");
    const [saveError, setSaveError] = React.useState("");

    React.useEffect(() => {
        let active = true;
        const tinaApi = cms.api.tina;
        if (!tinaApi) {
            setTagStatus("The Tina content API is unavailable. Reload the editor before importing.");
            return () => { active = false; };
        }
        tinaApi.request<TagsQueryResult>(tagsQuery, { variables: {} }).then((result) => {
            if (!active) return;
            const records = (result.tagsConnection.edges || []).flatMap((edge) => edge.node ? [{
                label: edge.node.label,
                slug: edge.node.slug,
                aliases: edge.node.aliases || [],
                reference: edge.node._sys.path,
            }] : []);
            setTagRegistry(records);
            setTagStatus(`${records.length} controlled tags available.`);
        }).catch(() => {
            if (!active) return;
            setTagStatus("The tag registry could not be loaded. Retry before creating an entry with tags.");
        });
        return () => { active = false; };
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
        const errors = parseErrors.filter((issue) =>
            !["title", "description", "primaryTopic", "body", "coverImage"].includes(issue.field) &&
            !issue.field.startsWith("links."),
        );
        if (validateImportFilename(entry.filename)) errors.push({ field: "filename", message: validateImportFilename(entry.filename)! });
        if (!entry.title.trim()) errors.push({ field: "title", message: "Add a title before creating the draft." });
        if (!entry.description.trim()) errors.push({ field: "description", message: "Add a short description before creating the draft." });
        if (!entry.primaryTopic.trim()) errors.push({ field: "primaryTopic", message: "Add a broad primary topic before creating the draft." });
        errors.push(...validateImportedBody(entry.body));
        errors.push(...validateImportedLinks(entry.links));
        const imageError = getImageSourceError(entry.coverImage);
        if (imageError) errors.push({ field: "coverImage", message: imageError });
        const resolved = resolveImportedTags(entry.tagTokens, tagRegistry);
        if (resolved.unresolved.length) {
            errors.push({ field: "tags", message: `Unknown controlled tags: ${resolved.unresolved.join(", ")}. Add them under Settings → Tags or remove them here.` });
        }
        return errors;
    }, [entry, parseErrors, tagRegistry]);

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
            entryType: entry.entryType,
            placement: entry.placement,
            date: entry.date || undefined,
            updatedDate: entry.updatedDate || undefined,
            primaryTopic: entry.primaryTopic.trim(),
            journalSection: entry.journalSection || undefined,
            tags: references.map((tag) => ({ tag })),
            coverImage: entry.coverImage.trim() || undefined,
            draft: true,
            technologies: entry.technologies,
            links: entry.links,
            media: [],
            body: entry.body,
        };

        try {
            await tinaApi.request<CreateEntryResult>(createEntryMutation, {
                variables: { relativePath: `${entry.filename}.mdx`, params },
            });
            cms.alerts.success("Imported draft created.");
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
            <h1 style={{ fontSize: "2rem", margin: "0.4rem 0 0.75rem" }}>Import Entry</h1>
            <p style={styles.intro}>
                Import portable Markdown or supported MDX, review the mapped metadata, and create a safe draft. The importer never overwrites an existing entry and never publishes immediately.
            </p>

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
                        <textarea style={{ ...styles.textarea, minHeight: "18rem" }} value={source} onChange={(event) => { setSource(event.target.value); setPhase("source"); }} placeholder={'---\ntitle: Example\ndescription: A short summary\nprimaryTopic: Writing\n---\n\n## Article body'} />
                    </label>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <button type="button" style={styles.button} onClick={review} disabled={!source.trim()}>Review import</button>
                </div>
            </section>

            {entry && phase !== "source" && (
                <section style={styles.section}>
                    <h2 style={{ marginTop: 0 }}>2. Complete the draft</h2>
                    <p style={styles.help}>Safe defaults: Article, Journal placement, and Draft. Missing values can be completed here before Tina creates the file.</p>
                    <IssueList title="Fix before import" issues={currentErrors} error />
                    <IssueList title="Review these mappings" issues={warnings} />
                    <div style={{ ...styles.grid, marginTop: "1rem" }}>
                        <label style={styles.field}><span style={styles.label}>Filename</span><input style={styles.input} value={entry.filename} onChange={(event) => setEntry(updateEntry(entry, "filename", event.target.value))} /><span style={styles.help}>Saved as {entry.filename || "…"}.mdx; an existing file is never replaced.</span></label>
                        <label style={styles.field}><span style={styles.label}>Title</span><input style={styles.input} value={entry.title} onChange={(event) => setEntry(updateEntry(entry, "title", event.target.value))} /></label>
                        <label style={styles.fullField}><span style={styles.label}>Description</span><textarea style={{ ...styles.textarea, minHeight: "6rem", fontFamily: "inherit" }} value={entry.description} onChange={(event) => setEntry(updateEntry(entry, "description", event.target.value))} /></label>
                        <label style={styles.field}><span style={styles.label}>Entry type</span><select style={styles.input} value={entry.entryType} onChange={(event) => setEntry(updateEntry(entry, "entryType", event.target.value as ImportedEntry["entryType"]))}>{entryTypes.map((option) => <option key={option}>{option}</option>)}</select></label>
                        <label style={styles.field}><span style={styles.label}>Placement</span><select style={styles.input} value={entry.placement} onChange={(event) => setEntry(updateEntry(entry, "placement", event.target.value as ImportedEntry["placement"]))}>{entryPlacements.map((option) => <option key={option} value={option}>{option === "journal" ? "Journal" : option === "both" ? "Portfolio + Journal" : "Portfolio only"}</option>)}</select></label>
                        <label style={styles.field}><span style={styles.label}>Publication date</span><input style={styles.input} type="datetime-local" value={entry.date ? entry.date.slice(0, 16) : ""} onChange={(event) => setEntry(updateEntry(entry, "date", event.target.value ? new Date(event.target.value).toISOString() : ""))} /></label>
                        <label style={styles.field}><span style={styles.label}>Updated date</span><input style={styles.input} type="datetime-local" value={entry.updatedDate ? entry.updatedDate.slice(0, 16) : ""} onChange={(event) => setEntry(updateEntry(entry, "updatedDate", event.target.value ? new Date(event.target.value).toISOString() : ""))} /></label>
                        <label style={styles.field}><span style={styles.label}>Primary topic</span><input style={styles.input} value={entry.primaryTopic} onChange={(event) => setEntry(updateEntry(entry, "primaryTopic", event.target.value))} /></label>
                        <label style={styles.field}><span style={styles.label}>Journal section</span><select style={styles.input} value={entry.journalSection} onChange={(event) => setEntry(updateEntry(entry, "journalSection", event.target.value as ImportedEntry["journalSection"]))}><option value="">Choose later</option>{entrySections.map((option) => <option key={option} value={option}>{option.replace(/(^|-)([a-z])/g, (_match, separator, letter) => `${separator ? " " : ""}${letter.toUpperCase()}`)}</option>)}</select></label>
                        <label style={styles.field}><span style={styles.label}>Controlled tags</span><input style={styles.input} value={entry.tagTokens.join(", ")} onChange={(event) => setEntry(updateEntry(entry, "tagTokens", event.target.value.split(",").map((token) => token.trim()).filter(Boolean)))} /><span style={styles.help}>{tagStatus} Use labels or slugs separated by commas.</span></label>
                        <label style={styles.fullField}><span style={styles.label}>Cover image</span><input style={styles.input} value={entry.coverImage} onChange={(event) => setEntry(updateEntry(entry, "coverImage", event.target.value))} placeholder="/uploads/image.jpg or https://…" /></label>
                        <label style={styles.fullField}><span style={styles.label}>Technologies</span><input style={styles.input} value={entry.technologies.join(", ")} onChange={(event) => setEntry(updateEntry(entry, "technologies", event.target.value.split(",").map((item) => item.trim()).filter(Boolean)))} /><span style={styles.help}>Separate values with commas.</span></label>
                        <label style={styles.field}><span style={styles.label}>Repository URL</span><input style={styles.input} value={entry.links?.repository || ""} onChange={(event) => setEntry(updateLink(entry, "repository", event.target.value))} /></label>
                        <label style={styles.field}><span style={styles.label}>Demo URL</span><input style={styles.input} value={entry.links?.demo || ""} onChange={(event) => setEntry(updateLink(entry, "demo", event.target.value))} /></label>
                        <label style={styles.fullField}><span style={styles.label}>External URL</span><input style={styles.input} value={entry.links?.external || ""} onChange={(event) => setEntry(updateLink(entry, "external", event.target.value))} /></label>
                        <label style={styles.fullField}><span style={styles.label}>Imported body</span><textarea style={{ ...styles.textarea, minHeight: "24rem" }} value={entry.body} onChange={(event) => setEntry(updateEntry(entry, "body", event.target.value))} /></label>
                    </div>

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
