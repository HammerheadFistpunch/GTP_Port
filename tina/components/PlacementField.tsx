import React from "react";
import type { ChangeEvent, CSSProperties } from "react";

type Placement = "portfolio" | "both" | "journal";

interface PlacementFieldProps {
    input: {
        value: string;
        onChange: (event: ChangeEvent<string>) => void;
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

const choices: Array<{
    value: Placement;
    label: string;
    description: string;
}> = [
    {
        value: "portfolio",
        label: "Portfolio only",
        description: "Keep this entry in the curated Portfolio.",
    },
    {
        value: "both",
        label: "Portfolio + Journal",
        description: "Feature it in Portfolio and publish it chronologically in Journal.",
    },
    {
        value: "journal",
        label: "Archive to Journal",
        description: "Remove it from Portfolio and retain it in the Journal archive.",
    },
];

const styles: Record<string, CSSProperties> = {
    fieldset: {
        margin: "24px 0",
        padding: 0,
        border: 0,
    },
    legend: {
        marginBottom: 4,
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
    choices: {
        display: "grid",
        gap: 8,
    },
    button: {
        width: "100%",
        padding: "12px 14px",
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        color: "#1f2937",
        cursor: "pointer",
        textAlign: "left",
    },
    selected: {
        background: "#eff6ff",
        borderColor: "#2563eb",
        boxShadow: "0 0 0 1px #2563eb",
    },
    label: {
        display: "block",
        marginBottom: 2,
        fontSize: 14,
        fontWeight: 600,
    },
    description: {
        display: "block",
        color: "#6b7280",
        fontSize: 12,
        lineHeight: 1.45,
    },
    error: {
        marginTop: 8,
        color: "#b91c1c",
        fontSize: 12,
    },
};

export default function PlacementField({
    input,
    field,
    meta,
}: PlacementFieldProps) {
    const selectPlacement = (placement: Placement) => {
        input.onChange(placement as unknown as ChangeEvent<string>);
    };

    return (
        <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>
                {typeof field.label === "string" ? field.label : "Placement"}
            </legend>

            {field.description && <p style={styles.help}>{field.description}</p>}

            <div style={styles.choices}>
                {choices.map((choice) => {
                    const selected = input.value === choice.value;

                    return (
                        <button
                            key={choice.value}
                            type="button"
                            aria-pressed={selected}
                            style={{
                                ...styles.button,
                                ...(selected ? styles.selected : {}),
                            }}
                            onClick={() => selectPlacement(choice.value)}
                        >
                            <span style={styles.label}>{choice.label}</span>
                            <span style={styles.description}>{choice.description}</span>
                        </button>
                    );
                })}
            </div>

            {meta?.touched && meta.error && (
                <p role="alert" style={styles.error}>{meta.error}</p>
            )}
        </fieldset>
    );
}
