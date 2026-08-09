import { getSupportedImageSource } from "../../src/lib/image-sources.ts";

export interface ImmichEditorAsset {
    id: string;
    type: "IMAGE";
    originalFileName: string;
    fileCreatedAt?: string;
    width?: number;
    height?: number;
    isFavorite?: boolean;
    previewUrl: string;
}

export interface PublishedMediaResult {
    variants?: Array<{
        variant?: string;
        url?: string;
        reused?: boolean;
    }>;
}

export const buildImmichAssetsUrl = ({
    page = 1,
    query = "",
    search = "smart",
    albumId = "",
}: {
    page?: number;
    query?: string;
    search?: "smart" | "filename";
    albumId?: string;
}) => {
    const params = new URLSearchParams({ page: String(page), size: "30" });
    if (query.trim()) params.set("q", query.trim());
    if (search === "filename") params.set("search", "filename");
    if (albumId) params.set("albumId", albumId);
    return `/admin/api/media/assets?${params.toString()}`;
};

export const getPublishedWebUrl = (result: PublishedMediaResult) => {
    const source = result.variants?.find((variant) => variant.variant === "web")?.url;
    return getSupportedImageSource(source);
};

export const createMarkdownImage = (source: string, alt = "") =>
    `![${alt.replaceAll("\\", "\\\\").replaceAll("]", "\\]")}](${source.trim()})`;
