export type ImageSourceKind = "managed" | "external" | "invalid";

export const getImageSourceKind = (value?: string): ImageSourceKind => {
    const source = value?.trim() || "";

    if (source.startsWith("/uploads/")) {
        const segments = source.slice("/uploads/".length).split("/");
        const isManaged = segments.every((segment) =>
            Boolean(segment) &&
            segment !== "." &&
            segment !== ".." &&
            !/[\\\u0000-\u001f?#]/.test(segment)
        );

        if (isManaged) return "managed";
    }

    try {
        const parsed = new URL(source);
        const hostname = parsed.hostname.toLowerCase();
        const isLocalhost = hostname === "localhost" || hostname.endsWith(".localhost");
        if (
            parsed.protocol === "https:" &&
            hostname &&
            !isLocalhost &&
            !parsed.username &&
            !parsed.password
        ) {
            return "external";
        }
    } catch {
        // A non-URL value is handled by the actionable validation message below.
    }

    return "invalid";
};

export const getImageSourceError = (value?: string) => {
    const source = value?.trim() || "";

    if (!source || getImageSourceKind(source) !== "invalid") return undefined;

    return "Choose a managed /uploads image or enter a complete HTTPS image URL.";
};

export const isSupportedImageSource = (value?: string): value is string =>
    getImageSourceKind(value) !== "invalid";

export const getSupportedImageSource = (value?: string) =>
    isSupportedImageSource(value) ? value.trim() : "";

export const isSafeRelativeMarkdownImage = (value?: string) => {
    const source = value?.trim() || "";
    if (!source.startsWith("./")) return false;

    const path = source.slice(2).split(/[?#]/, 1)[0];
    const segments = path.split("/");

    return segments.every((segment) =>
        Boolean(segment) &&
        segment !== "." &&
        segment !== ".." &&
        !/[\\:\u0000-\u001f]/.test(segment)
    );
};
