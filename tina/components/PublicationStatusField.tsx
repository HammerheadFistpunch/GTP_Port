import React from "react";
import type { ChangeEvent, FocusEvent } from "react";

interface PublicationStatusFieldProps {
    input: {
        name: string;
        value?: boolean;
        onChange: (event: ChangeEvent<boolean>) => void;
        onBlur?: (event?: FocusEvent<boolean>) => void;
        onFocus?: (event?: FocusEvent<boolean>) => void;
    };
    field: {
        label?: string | boolean;
        description?: string;
    };
}

export default function PublicationStatusField({ input, field }: PublicationStatusFieldProps) {
    const value = input.value === true ? "draft" : "published";

    return (
        <div style={{ margin: "24px 0 8px" }}>
            <label style={{ display: "block", marginBottom: 6, color: "#374151", fontSize: 14, fontWeight: 600 }}>
                {typeof field.label === "string" ? field.label : "Status"}
            </label>
            <p style={{ margin: "0 0 10px", color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>
                {field.description || "Drafts stay in Git/Tina but do not receive a public article route."}
            </p>
            <select
                name={input.name}
                value={value}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", color: "#111827", fontSize: 14 }}
                onChange={(event) => input.onChange((event.target.value === "draft") as unknown as ChangeEvent<boolean>)}
                onBlur={() => input.onBlur?.()}
                onFocus={() => input.onFocus?.()}
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
            </select>
        </div>
    );
}
