import React, { useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties, DragEvent } from "react";

const sectionOptions = [
    { value: "intro", label: "Hero + Journal" },
    { value: "about", label: "About Me" },
    { value: "capabilities", label: "What I Do" },
    { value: "technology", label: "Technology Stack" },
    { value: "portfolio", label: "Portfolio Links" },
] as const;

type SectionKey = (typeof sectionOptions)[number]["value"];

interface SectionOrderFieldProps {
    input: {
        value?: string[];
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
    list: {
        display: "grid",
        gap: 8,
        margin: 0,
        padding: 0,
        listStyle: "none",
    },
    item: {
        display: "grid",
        gridTemplateColumns: "32px minmax(0, 1fr) auto",
        gap: 10,
        alignItems: "center",
        minHeight: 52,
        padding: "8px 10px",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#ffffff",
    },
    dragging: {
        borderColor: "#2563eb",
        background: "#eff6ff",
        opacity: 0.65,
    },
    handle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 32,
        border: 0,
        background: "transparent",
        color: "#6b7280",
        cursor: "grab",
        fontSize: 20,
        lineHeight: 1,
    },
    label: {
        color: "#1f2937",
        fontSize: 14,
        fontWeight: 600,
    },
    actions: {
        display: "flex",
        gap: 4,
    },
    action: {
        width: 32,
        minHeight: 32,
        border: "1px solid #d1d5db",
        borderRadius: 6,
        background: "#ffffff",
        color: "#374151",
        cursor: "pointer",
    },
    error: {
        marginTop: 8,
        color: "#b91c1c",
        fontSize: 12,
    },
};

const isSectionKey = (value: string): value is SectionKey =>
    sectionOptions.some((option) => option.value === value);

export default function SectionOrderField({
    input,
    field,
    meta,
}: SectionOrderFieldProps) {
    const normalizedOrder = useMemo(() => {
        const saved = (input.value ?? []).filter(isSectionKey);
        return [
            ...new Set([
                ...saved,
                ...sectionOptions.map(({ value }) => value),
            ]),
        ];
    }, [input.value]);
    const [draggedSection, setDraggedSection] = useState<SectionKey>();

    const moveSection = (from: number, to: number) => {
        if (from === to || to < 0 || to >= normalizedOrder.length) return;

        const next = [...normalizedOrder];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        input.onChange(next as unknown as ChangeEvent<string>);
    };

    const startDrag = (event: DragEvent<HTMLLIElement>, section: SectionKey) => {
        setDraggedSection(section);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", section);
    };

    const dropSection = (event: DragEvent<HTMLLIElement>, target: SectionKey) => {
        event.preventDefault();
        const source = draggedSection ?? event.dataTransfer.getData("text/plain");
        const from = normalizedOrder.indexOf(source as SectionKey);
        const to = normalizedOrder.indexOf(target);

        if (from >= 0 && to >= 0) moveSection(from, to);
        setDraggedSection(undefined);
    };

    return (
        <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>
                {typeof field.label === "string"
                    ? field.label
                    : "Homepage Section Order"}
            </legend>

            {field.description && <p style={styles.help}>{field.description}</p>}

            <ol style={styles.list}>
                {normalizedOrder.map((section, index) => {
                    const option = sectionOptions.find(
                        ({ value }) => value === section,
                    );
                    const isDragging = draggedSection === section;

                    return (
                        <li
                            key={section}
                            draggable
                            onDragStart={(event) => startDrag(event, section)}
                            onDragEnd={() => setDraggedSection(undefined)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => dropSection(event, section)}
                            style={{
                                ...styles.item,
                                ...(isDragging ? styles.dragging : {}),
                            }}
                        >
                            <span
                                style={styles.handle}
                                aria-hidden="true"
                                title="Drag to reorder"
                            >
                                ⋮⋮
                            </span>
                            <span style={styles.label}>{option?.label ?? section}</span>
                            <span style={styles.actions}>
                                <button
                                    type="button"
                                    style={styles.action}
                                    disabled={index === 0}
                                    aria-label={`Move ${option?.label ?? section} up`}
                                    onClick={() => moveSection(index, index - 1)}
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    style={styles.action}
                                    disabled={index === normalizedOrder.length - 1}
                                    aria-label={`Move ${option?.label ?? section} down`}
                                    onClick={() => moveSection(index, index + 1)}
                                >
                                    ↓
                                </button>
                            </span>
                        </li>
                    );
                })}
            </ol>

            {meta?.touched && meta.error && (
                <p role="alert" style={styles.error}>{meta.error}</p>
            )}
        </fieldset>
    );
}
