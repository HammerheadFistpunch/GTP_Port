import React from "react";
import type { CSSProperties, ChangeEvent, FocusEvent } from "react";
import { useCMS } from "tinacms";
import type { Media, TinaField } from "tinacms";
import ImmichImagePicker from "./ImmichImagePicker";
import {
    getImageSourceError,
    getImageSourceKind,
} from "../../src/lib/image-sources";

interface ExternalImageFieldProps {
    input: {
        name: string;
        value: string;
        onChange: (event: ChangeEvent<string>) => void;
        onBlur: (event?: FocusEvent<string>) => void;
        onFocus: (event?: FocusEvent<string>) => void;
        type?: string;
    };
    field: TinaField & { namespace: string[] };
    meta?: {
        error?: string;
        touched?: boolean;
    };
}

const styles: Record<string, CSSProperties> = {
    field: { margin: "24px 0 8px" },
    label: {
        display: "block",
        marginBottom: 6,
        color: "#374151",
        fontSize: 14,
        fontWeight: 600,
    },
    help: {
        margin: "0 0 10px",
        color: "#6b7280",
        fontSize: 13,
        lineHeight: 1.5,
    },
    controls: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "stretch",
    },
    input: {
        width: "100%",
        flex: "1 1 20rem",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        color: "#111827",
        fontSize: 14,
    },
    button: {
        padding: "10px 14px",
        border: "1px solid #2563eb",
        borderRadius: 6,
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },
    clearButton: {
        marginTop: 8,
        padding: 0,
        border: 0,
        background: "transparent",
        color: "#4b5563",
        cursor: "pointer",
        fontSize: 13,
        textDecoration: "underline",
    },
    preview: {
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        marginTop: 10,
        padding: 10,
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#f9fafb",
    },
    image: {
        display: "block",
        width: "100%",
        flex: "1 1 160px",
        maxWidth: 220,
        maxHeight: 130,
        objectFit: "contain",
        borderRadius: 5,
        background: "#e5e7eb",
    },
    status: {
        margin: 0,
        color: "#4b5563",
        fontSize: 13,
        lineHeight: 1.45,
        overflowWrap: "anywhere",
    },
    error: {
        margin: "8px 0 0",
        color: "#b91c1c",
        fontSize: 12,
        lineHeight: 1.45,
    },
};

export default function ExternalImageField({ input, field, meta }: ExternalImageFieldProps) {
    const cms = useCMS();
    const value = typeof input.value === "string" ? input.value : "";
    const sourceKind = getImageSourceKind(value);
    const validationError = getImageSourceError(value);
    const [previewFailed, setPreviewFailed] = React.useState(false);
    const inputId = React.useId();

    React.useEffect(() => setPreviewFailed(false), [value]);

    const selectManagedImage = () => {
        cms.media.open({
            allowDelete: true,
            onSelect: (media: Media) => {
                const parsed = cms.media.store.parse?.(media) || media.src || "";
                if (parsed) input.onChange(parsed as unknown as ChangeEvent<string>);
            },
        });
    };

    const visibleError = validationError || (meta?.touched ? meta.error : undefined);

    return (
        <div style={styles.field}>
            <label htmlFor={inputId} style={styles.label}>
                {typeof field.label === "string" ? field.label : "Image"}
                {field.required ? " *" : ""}
            </label>
            <p style={styles.help}>
                {field.description || "Choose an Immich website copy, choose/upload a managed image, or paste a complete HTTPS image URL."}
            </p>
            <div style={styles.controls}>
                <input
                    id={inputId}
                    name={input.name}
                    type="text"
                    inputMode="url"
                    value={value}
                    placeholder="/uploads/image.jpg or https://…"
                    aria-invalid={Boolean(visibleError)}
                    aria-describedby={visibleError ? `${inputId}-error` : undefined}
                    style={styles.input}
                    onChange={(event) => input.onChange(event.target.value as unknown as ChangeEvent<string>)}
                    onBlur={() => input.onBlur?.()}
                    onFocus={() => input.onFocus?.()}
                />
                <ImmichImagePicker onSelect={(url) => input.onChange(url as unknown as ChangeEvent<string>)} />
                <button type="button" style={styles.button} onClick={selectManagedImage}>
                    Choose or upload
                </button>
            </div>

            {value && !validationError && (
                <div style={styles.preview}>
                    {!previewFailed ? (
                        <img
                            src={value.trim()}
                            alt="Selected image preview"
                            style={styles.image}
                            onError={() => setPreviewFailed(true)}
                        />
                    ) : (
                        <p style={styles.status}>Preview unavailable. Verify that the image is publicly reachable.</p>
                    )}
                    <p style={styles.status}>
                        {sourceKind === "managed" ? "Managed upload" : value.startsWith("https://media.angrysquirrel.org/") ? "Published Immich/R2 image" : "External HTTPS image"}<br />
                        {value.trim()}
                    </p>
                </div>
            )}

            {value && (
                <button type="button" style={styles.clearButton} onClick={() => input.onChange("" as unknown as ChangeEvent<string>)}>
                    Clear image
                </button>
            )}

            {visibleError && <p id={`${inputId}-error`} role="alert" style={styles.error}>{visibleError}</p>}
        </div>
    );
}
