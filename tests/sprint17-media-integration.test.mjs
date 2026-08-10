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
    assert.match(markdown, /compact buttonLabel="Insert Immich image"/);
    assert.match(importer, /MarkdownBodyField/);
    assert.match(importer, /ImmichImagePicker/);
    assert.match(config, /name: "src"[\s\S]*ui: externalImageUi/);
    assert.doesNotMatch(
        `${picker}\n${structured}\n${markdown}\n${importer}`,
        /IMMICH_API_KEY|IMMICH_BASE_URL|IMMICH_ACCESS_CLIENT_SECRET|immich-origin\.angrysquirrel\.org/,
    );
});

test("the shared picker exposes real album navigation and a mobile-first dialog", async () => {
    const picker = await readFile(
        new URL("../tina/components/ImmichImagePicker.tsx", import.meta.url),
        "utf8",
    );

    assert.match(picker, /setView\("albums"\)/);
    assert.match(picker, /openAlbum\(album\)/);
    assert.match(picker, /album\.previewUrl/);
    assert.match(picker, /Album: \{albumName\}/);
    assert.match(picker, /height: 100dvh/);
    assert.match(picker, /repeat\(2, minmax\(0, 1fr\)\)/);
});

test("Journal creation is body-first and omits the redundant Additional Media control", async () => {
    const [config, editor, topics] = await Promise.all([
        readFile(new URL("../tina/config.ts", import.meta.url), "utf8"),
        readFile(new URL("../tina/components/MarkdownBodyField.tsx", import.meta.url), "utf8"),
        readFile(new URL("../tina/components/TopicField.tsx", import.meta.url), "utf8"),
    ]);
    const journal = config.slice(config.indexOf('name: "entries"'));
    const titlePosition = journal.indexOf('name: "title"');
    const bodyPosition = journal.indexOf('name: "body"');
    const sectionPosition = journal.indexOf('name: "journalSection"');
    const datePosition = journal.indexOf('name: "date"', bodyPosition);

    assert.ok(titlePosition >= 0 && titlePosition < bodyPosition);
    assert.ok(bodyPosition < sectionPosition && sectionPosition < datePosition);
    assert.doesNotMatch(journal, /label: "Additional Media"/);
    assert.match(journal, /date: new Date\(\)\.toISOString\(\)/);
    assert.match(editor, /useState<EditorMode>\("write"\)/);
    assert.match(editor, /markdown-editor-split-toggle/);
    assert.match(editor, /@container \(max-width: 44rem\)/);
    assert.match(topics, /<details/);
    assert.match(topics, /Choose Topics/);
});
