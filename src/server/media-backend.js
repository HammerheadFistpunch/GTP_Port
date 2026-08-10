const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PAGE_SIZE = 60;
const DEFAULT_PAGE_SIZE = 30;

export class MediaServiceError extends Error {
    constructor(message, status = 500, code = "media_error") {
        super(message);
        this.name = "MediaServiceError";
        this.status = status;
        this.code = code;
    }
}

const asPositiveInteger = (value, fallback, maximum = Number.MAX_SAFE_INTEGER) => {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
};

const requireUuid = (value, label = "Asset ID") => {
    if (!UUID_PATTERN.test(value || "")) {
        throw new MediaServiceError(`${label} is invalid.`, 400, "invalid_id");
    }
    return value;
};

const normalizeHttpsBase = (value, label) => {
    let url;
    try {
        url = new URL(value || "");
    } catch {
        throw new MediaServiceError(`${label} is not configured.`, 503, "not_configured");
    }

    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
        throw new MediaServiceError(`${label} must be a credential-free HTTPS URL.`, 503, "invalid_configuration");
    }

    url.pathname = url.pathname.replace(/\/+$/, "");
    return url;
};

export const getMediaConfiguration = (env) => {
    if (!env?.IMMICH_API_KEY) {
        throw new MediaServiceError("The Immich API key is not configured.", 503, "not_configured");
    }
    if (!env?.MEDIA_BUCKET) {
        throw new MediaServiceError("The media R2 binding is not configured.", 503, "not_configured");
    }

    const immichBase = normalizeHttpsBase(env.IMMICH_BASE_URL, "The Immich base URL");
    const publicBase = normalizeHttpsBase(env.MEDIA_PUBLIC_BASE_URL, "The public media URL");
    const accessClientId = env.IMMICH_ACCESS_CLIENT_ID || "";
    const accessClientSecret = env.IMMICH_ACCESS_CLIENT_SECRET || "";
    const variantVersion = env.MEDIA_VARIANT_VERSION || "v1";
    if (!/^[a-zA-Z0-9_-]{1,24}$/.test(variantVersion)) {
        throw new MediaServiceError(
            "The media variant version is invalid.",
            503,
            "invalid_configuration",
        );
    }
    if (Boolean(accessClientId) !== Boolean(accessClientSecret)) {
        throw new MediaServiceError(
            "Both Immich Access service-token values must be configured together.",
            503,
            "invalid_configuration",
        );
    }

    if (!immichBase.pathname.endsWith("/api")) {
        immichBase.pathname = `${immichBase.pathname}/api`.replace(/\/+/g, "/");
    }

    return {
        apiKey: env.IMMICH_API_KEY,
        accessClientId,
        accessClientSecret,
        bucket: env.MEDIA_BUCKET,
        immichBase,
        publicBase,
        variantVersion,
    };
};

const apiUrl = (config, path, searchParams) => {
    const url = new URL(`${config.immichBase.toString().replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
    for (const [key, value] of Object.entries(searchParams || {})) {
        if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
    return url;
};

const immichFetch = async (config, path, init = {}, searchParams) => {
    let response;
    try {
        response = await fetch(apiUrl(config, path, searchParams), {
            ...init,
            headers: {
                accept: "application/json",
                "x-api-key": config.apiKey,
                ...(config.accessClientId ? {
                    "CF-Access-Client-Id": config.accessClientId,
                    "CF-Access-Client-Secret": config.accessClientSecret,
                } : {}),
                ...init.headers,
            },
        });
    } catch {
        throw new MediaServiceError("Immich is currently unavailable.", 502, "immich_unavailable");
    }

    if (!response.ok) {
        const status = response.status === 404 ? 404 : 502;
        throw new MediaServiceError(
            response.status === 404 ? "The Immich asset was not found." : "Immich could not complete the media request.",
            status,
            response.status === 404 ? "not_found" : "immich_error",
        );
    }

    return response;
};

const normalizeAsset = (asset, previewBase = "/admin/api/media/preview") => ({
    id: asset.id,
    type: asset.type,
    originalFileName: asset.originalFileName || "Untitled image",
    fileCreatedAt: asset.fileCreatedAt || asset.localDateTime || asset.createdAt,
    updatedAt: asset.updatedAt,
    width: asset.exifInfo?.exifImageWidth || asset.width,
    height: asset.exifInfo?.exifImageHeight || asset.height,
    isFavorite: Boolean(asset.isFavorite),
    previewUrl: `${previewBase}/${encodeURIComponent(asset.id)}`,
});

const imageAssets = (assets) => (Array.isArray(assets) ? assets : [])
    .filter((asset) => asset?.type === "IMAGE" && UUID_PATTERN.test(asset.id || ""));

const normalizeSearchResult = (result, page, size) => {
    const container = result?.assets || result || {};
    const items = imageAssets(container.items || container.assets || []);
    return {
        items: items.map((asset) => normalizeAsset(asset)),
        page,
        size,
        nextPage: container.nextPage || (items.length === size ? page + 1 : null),
        total: container.total ?? container.count ?? null,
    };
};

export const parseAssetQuery = (url) => {
    const page = asPositiveInteger(url.searchParams.get("page"), 1);
    const size = asPositiveInteger(url.searchParams.get("size"), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const query = (url.searchParams.get("q") || "").trim().slice(0, 200);
    const search = url.searchParams.get("search") === "filename" ? "filename" : "smart";
    const albumId = url.searchParams.get("albumId") || "";
    if (albumId) requireUuid(albumId, "Album ID");

    const takenAfter = url.searchParams.get("takenAfter") || "";
    const takenBefore = url.searchParams.get("takenBefore") || "";
    for (const [label, value] of [["takenAfter", takenAfter], ["takenBefore", takenBefore]]) {
        if (value && Number.isNaN(Date.parse(value))) {
            throw new MediaServiceError(`${label} must be a valid date.`, 400, "invalid_date");
        }
    }

    return { page, size, query, search, albumId, takenAfter, takenBefore };
};

export const listAlbums = async (env) => {
    const config = getMediaConfiguration(env);
    const response = await immichFetch(config, "albums", {}, { shared: "false" });
    const albums = await response.json();

    return (Array.isArray(albums) ? albums : [])
        .filter((album) => UUID_PATTERN.test(album?.id || ""))
        .map((album) => ({
            id: album.id,
            albumName: album.albumName || "Untitled album",
            assetCount: album.assetCount || 0,
            updatedAt: album.updatedAt,
            previewUrl: album.albumThumbnailAssetId
                ? `/admin/api/media/preview/${encodeURIComponent(album.albumThumbnailAssetId)}`
                : null,
        }))
        .sort((left, right) => left.albumName.localeCompare(right.albumName));
};

export const searchAssets = async (env, requestUrl) => {
    const config = getMediaConfiguration(env);
    const query = parseAssetQuery(requestUrl);

    const path = query.query && query.search === "smart" ? "search/smart" : "search/metadata";
    const body = {
        page: query.page,
        size: query.size,
        type: "IMAGE",
        withExif: true,
    };
    if (query.query) {
        body[query.search === "filename" ? "originalFileName" : "query"] = query.query;
    }
    if (query.albumId) body.albumIds = [query.albumId];
    if (query.takenAfter) body.takenAfter = new Date(query.takenAfter).toISOString();
    if (query.takenBefore) body.takenBefore = new Date(query.takenBefore).toISOString();

    const response = await immichFetch(config, path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
    return normalizeSearchResult(await response.json(), query.page, query.size);
};

export const getPreview = async (env, assetId, size = "thumbnail") => {
    const config = getMediaConfiguration(env);
    requireUuid(assetId);
    const variant = size === "preview" ? "preview" : "thumbnail";
    const response = await immichFetch(
        config,
        `assets/${assetId}/thumbnail`,
        { headers: { accept: "image/avif,image/webp,image/jpeg,image/png" } },
        { size: variant },
    );

    return new Response(response.body, {
        headers: {
            "cache-control": "private, no-store",
            "content-type": response.headers.get("content-type") || "image/jpeg",
            "x-content-type-options": "nosniff",
        },
    });
};

const safeRevision = (asset) => {
    const checksum = (asset.checksum || "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "")
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 32);
    if (checksum) return checksum;
    return (asset.updatedAt || asset.fileModifiedAt || "current").replace(/[^0-9]/g, "").slice(0, 20) || "current";
};

export const getPublishedObjectKey = (asset, variant, variantVersion = "v1") => {
    requireUuid(asset?.id);
    if (!["thumbnail", "web"].includes(variant)) {
        throw new MediaServiceError("The media variant is invalid.", 400, "invalid_variant");
    }
    if (!/^[a-zA-Z0-9_-]{1,24}$/.test(variantVersion)) {
        throw new MediaServiceError("The media variant version is invalid.", 400, "invalid_variant_version");
    }
    return `immich/${asset.id}/${safeRevision(asset)}/${variantVersion}/${variant}`;
};

const publicObjectUrl = (config, key) => {
    const base = config.publicBase.toString().replace(/\/$/, "");
    return `${base}/${key.split("/").map(encodeURIComponent).join("/")}`;
};

const publishedVariant = (config, object, key, variant, reused) => ({
    variant,
    url: publicObjectUrl(config, key),
    contentType: object.httpMetadata?.contentType || "image/jpeg",
    size: object.size,
    reused,
});

const publishVariant = async (config, asset, variant) => {
    const key = getPublishedObjectKey(asset, variant, config.variantVersion);
    const existing = await config.bucket.head(key);
    if (existing) return publishedVariant(config, existing, key, variant, true);

    const immichSize = variant === "web" ? "preview" : "thumbnail";
    const response = await immichFetch(
        config,
        `assets/${asset.id}/thumbnail`,
        { headers: { accept: "image/avif,image/webp,image/jpeg,image/png" } },
        { size: immichSize },
    );
    const contentType = response.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
        throw new MediaServiceError("Immich did not return an image.", 502, "invalid_media");
    }

    const stored = await config.bucket.put(key, response.body, {
        httpMetadata: {
            cacheControl: "public, max-age=31536000, immutable",
            contentDisposition: "inline",
            contentType,
        },
        customMetadata: {
            source: "immich",
            sourceAssetId: asset.id,
            sourceRevision: safeRevision(asset),
            sourceUpdatedAt: asset.updatedAt || "",
            originalFileName: (asset.originalFileName || "").slice(0, 512),
            variant,
            variantVersion: config.variantVersion,
        },
    });

    return publishedVariant(config, stored, key, variant, false);
};

export const publishAsset = async (env, assetId) => {
    const config = getMediaConfiguration(env);
    requireUuid(assetId);

    const response = await immichFetch(config, `assets/${assetId}`);
    const asset = await response.json();
    if (asset.type !== "IMAGE") {
        throw new MediaServiceError("Only image assets can be published.", 400, "unsupported_media");
    }

    const variants = await Promise.all([
        publishVariant(config, asset, "thumbnail"),
        publishVariant(config, asset, "web"),
    ]);

    return {
        asset: normalizeAsset(asset),
        source: { provider: "immich", assetId: asset.id, revision: safeRevision(asset) },
        variants,
    };
};
