import assert from "node:assert/strict";
import test from "node:test";
import {
    getImageSourceError,
    getImageSourceKind,
    getSupportedImageSource,
    isSafeRelativeMarkdownImage,
    isSupportedImageSource,
} from "../src/lib/image-sources.ts";

test("managed uploads and external HTTPS image URLs are accepted", () => {
    assert.equal(getImageSourceKind("/uploads/wordpress/2024/02/image-12-2.png"), "managed");
    assert.equal(getImageSourceKind("https://angrysquirrel.org/uploads/example.jpg"), "external");
    assert.equal(
        getImageSourceKind("https://share.angrysquirrel.org/api/assets/example/thumbnail?size=preview"),
        "external",
    );
    assert.equal(getImageSourceError("/uploads/example.jpg"), undefined);
    assert.equal(isSupportedImageSource("https://photos.angrysquirrel.org/example.webp"), true);
    assert.equal(
        getSupportedImageSource("  https://photos.angrysquirrel.org/example.webp  "),
        "https://photos.angrysquirrel.org/example.webp",
    );
    assert.equal(isSafeRelativeMarkdownImage("./images/example.webp"), true);
});

test("unsafe and ambiguous image sources receive an actionable error", () => {
    const invalidSources = [
        "http://example.com/image.jpg",
        "//example.com/image.jpg",
        "data:image/svg+xml,<svg></svg>",
        "javascript:alert(1)",
        "/uploads/../private/image.jpg",
        "relative/image.jpg",
        "https://user:password@example.com/image.jpg",
        "https://localhost/image.jpg",
    ];

    for (const source of invalidSources) {
        assert.equal(getImageSourceKind(source), "invalid");
        assert.equal(
            getImageSourceError(source),
            "Choose a managed /uploads image or enter a complete HTTPS image URL.",
        );
    }

    assert.equal(isSafeRelativeMarkdownImage("../private/image.jpg"), false);
    assert.equal(isSafeRelativeMarkdownImage("./images/../private.jpg"), false);
});
