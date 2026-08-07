import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { parseFile, stringifyFile } from "@tinacms/graphql";
import { validateImportedBody } from "../tina/lib/entryImport.ts";

const entriesDirectory = new URL("../src/content/entries/", import.meta.url);
const normalizeBodyDelimiter = (body) => body.replace(/^\n+/, "");

const parseEntry = (source) => parseFile(
    source,
    ".mdx",
    (validator) => validator.object({
        title: validator.string().required(),
        draft: validator.boolean(),
        $_body: validator.string().required(),
    }).noUnknown(false),
);

test("every Content Entry survives the final Tina Markdown round trip", async () => {
    const filenames = (await readdir(entriesDirectory))
        .filter((filename) => filename.endsWith(".mdx"))
        .sort();

    assert.ok(filenames.length > 0, "Expected at least one Content Entry fixture.");

    for (const filename of filenames) {
        const source = await readFile(new URL(filename, entriesDirectory), "utf8");
        const parsed = parseEntry(source);
        const reopened = parseEntry(stringifyFile(parsed, ".mdx", false));

        assert.equal(
            normalizeBodyDelimiter(reopened.$_body),
            normalizeBodyDelimiter(parsed.$_body),
            `${filename} changed its Markdown body during Tina serialization`,
        );
    }
});

test("every existing Content Entry body satisfies the rollout safety policy", async () => {
    const filenames = (await readdir(entriesDirectory))
        .filter((filename) => filename.endsWith(".mdx"))
        .sort();

    for (const filename of filenames) {
        const source = await readFile(new URL(filename, entriesDirectory), "utf8");
        const entry = parseEntry(source);

        assert.deepEqual(
            validateImportedBody(entry.$_body),
            [],
            `${filename} contains body syntax the final authoring workflow cannot safely accept`,
        );
    }
});

test("Sprint 12 verification entries remain available without publishing test content", async () => {
    for (const filename of [
        "sprint-12a-markdown-editor-proof.mdx",
        "imported-entry.mdx",
    ]) {
        const source = await readFile(new URL(filename, entriesDirectory), "utf8");
        const entry = parseEntry(source);

        assert.equal(entry.draft, true, `${filename} must remain a draft verification entry`);
    }
});
