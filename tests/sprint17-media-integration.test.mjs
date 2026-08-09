import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
    buildImmichAssetsUrl,
    createMarkdownImage,
    getPublishedWebUrl,
} from "../tina/lib/immichMedia.ts";

test("the shared picker builds protected browse queries without origin details", () => {
    assert.equal(
        buildImmichAssetsUrl({
            page: 2,
            query: "ground squirrel",
            search: "filename",
            albumId: "11111111-1111-4111-8111-111111111111",
        }),
        "/admin/api/media/assets?page=2&size=30&q=ground+squirrel&search=filename&albumId=11111111-1111-4111-8111-111111111111",
    );
});

test("only a valid published web URL is selected for durable content", () => {
    const result = {
        variants: [
            { variant: "thumbnail", url: "https://media.example.test/thumbnail" },
            { variant: "web", url: "https://media.example.test/web", reused: true },
        ],
    };
    assert.equal(getPublishedWebUrl(result), "https://media.example.test/web");
    assert.equal(getPublishedWebUrl({ variants: [{ variant: "web", url: "/admin/api/media/preview/private" }] }), "");
    assert.equal(getPublishedWebUrl({ variants: [{ variant: "thumbnail", url: "https://media.example.test/thumbnail" }] }), "");
});

test("Immich selection inserts portable Markdown with escaped alternative text", () => {
    assert.equal(
        createMarkdownImage("https://media.example.test/web", "Ground ] squirrel"),
        "![Ground \\] squirrel](https://media.example.test/web)",
    );
});

test("all authoring paths share the picker and store no private media configuration", async () => {
    const [picker, structured, markdown, importer, config] = await Promise.all([
        readFile(new URL("../tina/components/ImmichImagePicker.tsx", import.meta.url), "utf8"),
        readFile(new URL("../tina/components/ExternalImageField.tsx", import.meta.url), "utf8"),
        readFile(new URL("../tina/components/MarkdownBodyField.tsx", import.meta.url), "utf8"),
        readFile(new URL("../tina/components/ImportEntryScreen.tsx", import.meta.url), "utf8"),
        readFile(new URL("../tina/config.ts", import.meta.url), "utf8"),
    ]);

    assert.match(picker, /\/admin\/api\/media\/publish/);
    assert.match(picker, /getPublishedWebUrl/);
    assert.match(structured, /ImmichImagePicker/);
    assert.match(markdown, /buttonLabel="Immich image"/);
    assert.match(importer, /MarkdownBodyField/);
    assert.match(importer, /ImmichImagePicker/);
    assert.match(config, /name: "src"[\s\S]*ui: externalImageUi/);
    assert.doesNotMatch(
        `${picker}\n${structured}\n${markdown}\n${importer}`,
        /IMMICH_API_KEY|IMMICH_BASE_URL|IMMICH_ACCESS_CLIENT_SECRET|immich-origin\.angrysquirrel\.org/,
    );
});
