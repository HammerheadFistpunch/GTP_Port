import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
    getMediaConfiguration,
    getPublishedObjectKey,
    MediaServiceError,
    parseAssetQuery,
    publishAsset,
    searchAssets,
} from "../src/server/media-backend.js";

const assetId = "11111111-1111-4111-8111-111111111111";

const createBucket = () => {
    const objects = new Map();
    const puts = [];
    return {
        objects,
        puts,
        async head(key) {
            return objects.get(key) || null;
        },
        async put(key, body, options) {
            const bytes = await new Response(body).arrayBuffer();
            const object = {
                key,
                size: bytes.byteLength,
                httpMetadata: options.httpMetadata,
                customMetadata: options.customMetadata,
            };
            objects.set(key, object);
            puts.push(object);
            return object;
        },
    };
};

const createEnv = (bucket = createBucket()) => ({
    IMMICH_API_KEY: "private-immich-key",
    IMMICH_BASE_URL: "https://photos.example.test",
    MEDIA_BUCKET: bucket,
    MEDIA_PUBLIC_BASE_URL: "https://media.example.test",
});

test("media configuration requires credential-free HTTPS endpoints", () => {
    const bucket = createBucket();
    assert.throws(
        () => getMediaConfiguration({
            ...createEnv(bucket),
            IMMICH_BASE_URL: "http://192.168.1.10:2283",
        }),
        (error) => error instanceof MediaServiceError && error.code === "invalid_configuration",
    );
    assert.throws(
        () => getMediaConfiguration({
            ...createEnv(bucket),
            MEDIA_PUBLIC_BASE_URL: "https://user:password@media.example.test",
        }),
        (error) => error instanceof MediaServiceError && error.code === "invalid_configuration",
    );
    assert.throws(
        () => getMediaConfiguration({
            ...createEnv(bucket),
            IMMICH_ACCESS_CLIENT_ID: "service-token-id",
        }),
        (error) => error instanceof MediaServiceError && error.code === "invalid_configuration",
    );
});

test("asset browse queries validate IDs, dates, and pagination bounds", () => {
    const parsed = parseAssetQuery(new URL(
        `https://angrysquirrel.org/admin/api/media/assets?page=2&size=500&q=ground%20squirrel&albumId=${assetId}`,
    ));
    assert.deepEqual(parsed, {
        page: 2,
        size: 60,
        query: "ground squirrel",
        search: "smart",
        albumId: assetId,
        takenAfter: "",
        takenBefore: "",
    });
    assert.throws(
        () => parseAssetQuery(new URL("https://angrysquirrel.org/admin/api/media/assets?albumId=../../private")),
        (error) => error instanceof MediaServiceError && error.code === "invalid_id",
    );
    assert.throws(
        () => parseAssetQuery(new URL("https://angrysquirrel.org/admin/api/media/assets?takenAfter=not-a-date")),
        (error) => error instanceof MediaServiceError && error.code === "invalid_date",
    );
});

test("smart search sends credentials only to the configured Immich origin", async () => {
    const env = {
        ...createEnv(),
        IMMICH_ACCESS_CLIENT_ID: "service-token-id",
        IMMICH_ACCESS_CLIENT_SECRET: "service-token-secret",
    };
    const originalFetch = globalThis.fetch;
    let request;
    globalThis.fetch = async (url, init) => {
        request = { url: url.toString(), init };
        return Response.json({
            assets: {
                items: [{
                    id: assetId,
                    type: "IMAGE",
                    originalFileName: "ground-squirrel.jpg",
                    fileCreatedAt: "2026-08-01T12:00:00.000Z",
                    exifInfo: { exifImageWidth: 4000, exifImageHeight: 3000, latitude: 40.1 },
                    originalPath: "/private/library/ground-squirrel.jpg",
                }],
                nextPage: null,
                total: 1,
            },
        });
    };

    try {
        const result = await searchAssets(
            env,
            new URL("https://angrysquirrel.org/admin/api/media/assets?q=squirrel&page=1&size=30"),
        );
        assert.equal(request.url, "https://photos.example.test/api/search/smart");
        assert.equal(request.init.headers["x-api-key"], env.IMMICH_API_KEY);
        assert.equal(request.init.headers["CF-Access-Client-Id"], env.IMMICH_ACCESS_CLIENT_ID);
        assert.equal(request.init.headers["CF-Access-Client-Secret"], env.IMMICH_ACCESS_CLIENT_SECRET);
        assert.deepEqual(JSON.parse(request.init.body), {
            page: 1,
            size: 30,
            type: "IMAGE",
            withExif: true,
            query: "squirrel",
        });
        assert.deepEqual(result.items[0], {
            id: assetId,
            type: "IMAGE",
            originalFileName: "ground-squirrel.jpg",
            fileCreatedAt: "2026-08-01T12:00:00.000Z",
            updatedAt: undefined,
            width: 4000,
            height: 3000,
            isFavorite: false,
            previewUrl: `/admin/api/media/preview/${assetId}`,
        });
        assert.doesNotMatch(
            JSON.stringify(result),
            /private-immich-key|service-token-secret|photos\.example\.test|originalPath|latitude/,
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("publishing writes deterministic Immich variants once and reuses them", async () => {
    const bucket = createBucket();
    const env = createEnv(bucket);
    const originalFetch = globalThis.fetch;
    const calls = [];
    const asset = {
        id: assetId,
        type: "IMAGE",
        originalFileName: "ground-squirrel.jpg",
        checksum: "YWJjMTIzPT0=",
        updatedAt: "2026-08-08T12:00:00.000Z",
        exifInfo: { exifImageWidth: 4000, exifImageHeight: 3000 },
    };
    globalThis.fetch = async (url) => {
        calls.push(url.toString());
        if (url.pathname.endsWith(`/assets/${assetId}`)) return Response.json(asset);
        return new Response(new Uint8Array([1, 2, 3, 4]), {
            headers: { "content-type": "image/webp" },
        });
    };

    try {
        const first = await publishAsset(env, assetId);
        const second = await publishAsset(env, assetId);

        assert.equal(bucket.puts.length, 2);
        assert.deepEqual(first.variants.map((variant) => variant.reused), [false, false]);
        assert.deepEqual(second.variants.map((variant) => variant.reused), [true, true]);
        assert.deepEqual(first.variants.map((variant) => variant.url), second.variants.map((variant) => variant.url));
        assert.match(first.variants[0].url, new RegExp(`^https://media\\.example\\.test/immich/${assetId}/`));
        assert.equal(bucket.puts[0].httpMetadata.cacheControl, "public, max-age=31536000, immutable");
        assert.equal(bucket.puts[0].customMetadata.sourceAssetId, assetId);
        assert.equal(calls.filter((url) => url.includes("/thumbnail?")).length, 2);
        assert.doesNotMatch(JSON.stringify(first), /private-immich-key|photos\.example\.test/);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("object keys change with the Immich source revision", () => {
    const first = getPublishedObjectKey({ id: assetId, checksum: "Zmlyc3Q=" }, "web");
    const second = getPublishedObjectKey({ id: assetId, checksum: "c2Vjb25k" }, "web");
    assert.notEqual(first, second);
    assert.match(first, new RegExp(`^immich/${assetId}/[^/]+/v1/web$`));
    assert.notEqual(first, getPublishedObjectKey({ id: assetId, checksum: "Zmlyc3Q=" }, "web", "v2"));
});

test("the protected endpoint source does not embed origin or credential values", async () => {
    const middleware = await readFile(
        new URL("../functions/admin/api/media/_middleware.js", import.meta.url),
        "utf8",
    );
    const backend = await readFile(
        new URL("../src/server/media-backend.js", import.meta.url),
        "utf8",
    );

    assert.match(middleware, /cloudflareAccessPlugin/);
    assert.match(middleware, /MEDIA_ALLOWED_EMAIL/);
    assert.match(backend, /IMMICH_BASE_URL/);
    assert.match(backend, /IMMICH_API_KEY/);
    assert.match(backend, /IMMICH_ACCESS_CLIENT_SECRET/);
    assert.match(backend, /MEDIA_BUCKET/);
    assert.doesNotMatch(`${middleware}\n${backend}`, /share\.angrysquirrel\.org|photos\.angrysquirrel\.org|192\.168\./);
});
