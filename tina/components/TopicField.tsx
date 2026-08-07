import React from "react";
import type { ChangeEvent } from "react";
import { useCMS } from "tinacms";

interface TopicSelection {
    tag: string;
}

interface TopicFieldProps {
    input: {
        name: string;
        value?: TopicSelection[];
        onChange: (event: ChangeEvent<TopicSelection[]>) => void;
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

interface TopicQueryResult {
    tagsConnection: {
        edges?: Array<{
            node?: {
                label: string;
                slug: string;
                active?: boolean;
                _sys: { path: string };
            };
        }>;
    };
}

const topicsQuery = `#graphql
    query TopicOptions {
        tagsConnection(first: 250) {
            edges {
                node {
                    label
                    slug
                    active
                    _sys { path }
                }
            }
        }
    }
`;

export default function TopicField({ input, field, meta }: TopicFieldProps) {
    const cms = useCMS();
    const value = Array.isArray(input.value) ? input.value : [];
    const selected = new Set(value.map((item) => item?.tag).filter(Boolean));
    const [topics, setTopics] = React.useState<Array<{ label: string; slug: string; reference: string; active: boolean }>>([]);
    const [status, setStatus] = React.useState("Loading Topics…");

    React.useEffect(() => {
        let mounted = true;
        const tinaApi = cms.api.tina;
        if (!tinaApi) {
            setStatus("Topics are unavailable. Reload the editor.");
            return () => { mounted = false; };
        }

        tinaApi.request<TopicQueryResult>(topicsQuery, { variables: {} }).then((result) => {
            if (!mounted) return;
            const options = (result.tagsConnection.edges || [])
                .flatMap((edge) => edge.node ? [{
                    label: edge.node.label,
                    slug: edge.node.slug,
                    reference: edge.node._sys.path,
                    active: edge.node.active !== false,
                }] : [])
                .sort((a, b) => a.label.localeCompare(b.label));
            setTopics(options);
            setStatus(options.length ? "" : "No Topics exist yet. Add one under Settings → Topics.");
        }).catch(() => {
            if (mounted) setStatus("Topics could not be loaded. Reload before changing this field.");
        });

        return () => { mounted = false; };
    }, [cms]);

    const visibleTopics = topics.filter((topic) => topic.active || selected.has(topic.reference));

    const toggle = (reference: string, checked: boolean) => {
        const next = checked
            ? [...value, { tag: reference }]
            : value.filter((item) => item.tag !== reference);
        const deduped = [...new Map(next.map((item) => [item.tag, item])).values()];
        input.onChange(deduped as unknown as ChangeEvent<TopicSelection[]>);
    };

    return (
        <fieldset style={{ margin: "24px 0 8px", padding: 0, border: 0 }}>
            <legend style={{ marginBottom: 6, color: "#374151", fontSize: 14, fontWeight: 600 }}>
                {typeof field.label === "string" ? field.label : "Topics"}
            </legend>
            <p style={{ margin: "0 0 10px", color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>
                {field.description || "Choose what this story is about. Topics power related stories and topic archives."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                {visibleTopics.map((topic) => (
                    <label key={topic.reference} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", color: "#111827", fontSize: 14 }}>
                        <input
                            type="checkbox"
                            checked={selected.has(topic.reference)}
                            disabled={!topic.active && !selected.has(topic.reference)}
                            onChange={(event) => toggle(topic.reference, event.target.checked)}
                        />
                        <span>{topic.label}{!topic.active ? " (retired)" : ""}</span>
                    </label>
                ))}
            </div>
            {status && <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 12 }}>{status}</p>}
            <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 12 }}>
                Add, rename, or retire Topics under Settings → Topics. Retired Topics remain visible on stories that already use them.
            </p>
            {meta?.touched && meta.error && (
                <p role="alert" style={{ margin: "8px 0 0", color: "#b91c1c", fontSize: 12 }}>{meta.error}</p>
            )}
        </fieldset>
    );
}
