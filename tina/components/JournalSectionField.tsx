import React from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { useCMS } from "tinacms";

interface JournalSectionFieldProps {
    input: {
        name: string;
        value?: string;
        onChange: (event: ChangeEvent<string>) => void;
        onBlur?: (event?: FocusEvent<string>) => void;
        onFocus?: (event?: FocusEvent<string>) => void;
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

interface SectionQueryResult {
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

const sectionsQuery = `#graphql
    query JournalSectionOptions {
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

export default function JournalSectionField({ input, field, meta }: JournalSectionFieldProps) {
    const cms = useCMS();
    const [sections, setSections] = React.useState<Array<{ label: string; slug: string }>>([]);
    const [status, setStatus] = React.useState("Loading Journal sections…");
    const value = typeof input.value === "string" ? input.value : "";

    React.useEffect(() => {
        let active = true;
        const tinaApi = cms.api.tina;
        if (!tinaApi) {
            setStatus("Journal sections are unavailable. Reload the editor.");
            return () => { active = false; };
        }

        tinaApi.request<SectionQueryResult>(sectionsQuery, { variables: {} }).then((result) => {
            if (!active) return;
            const options = (result.journalSectionsConnection.edges || [])
                .flatMap((edge) => edge.node && edge.node.active !== false
                    ? [{ label: edge.node.label, slug: edge.node.slug }]
                    : [])
                .sort((a, b) => a.label.localeCompare(b.label));
            setSections(options);
            setStatus(options.length ? "" : "No active Journal sections. Add one in Journal Sections.");
        }).catch(() => {
            if (active) setStatus("Journal sections could not be loaded. Reload before changing this field.");
        });

        return () => { active = false; };
    }, [cms]);

    const currentIsMissing = Boolean(value) && !sections.some((section) => section.slug === value);

    return (
        <div style={{ margin: "24px 0 8px" }}>
            <label style={{ display: "block", marginBottom: 6, color: "#374151", fontSize: 14, fontWeight: 600 }}>
                {typeof field.label === "string" ? field.label : "Journal Section"}
            </label>
            <p style={{ margin: "0 0 10px", color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>
                {field.description || "Choose where this story belongs. Leave blank to show it only in Latest."}
            </p>
            <select
                name={input.name}
                value={value}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", color: "#111827", fontSize: 14 }}
                onChange={(event) => input.onChange(event.target.value as unknown as ChangeEvent<string>)}
                onBlur={() => input.onBlur?.()}
                onFocus={() => input.onFocus?.()}
            >
                <option value="">Latest only / no section</option>
                {currentIsMissing && <option value={value}>Unavailable section: {value}</option>}
                {sections.map((section) => (
                    <option key={section.slug} value={section.slug}>{section.label}</option>
                ))}
            </select>
            {status && <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 12 }}>{status}</p>}
            {currentIsMissing && (
                <p style={{ margin: "8px 0 0", color: "#92400e", fontSize: 12 }}>
                    This section is retired or missing. The public story falls back to Latest until you choose an active section.
                </p>
            )}
            {meta?.touched && meta.error && (
                <p role="alert" style={{ margin: "8px 0 0", color: "#b91c1c", fontSize: 12 }}>{meta.error}</p>
            )}
        </div>
    );
}
