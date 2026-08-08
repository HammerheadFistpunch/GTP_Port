import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseFile, stringifyFile } from "@tinacms/graphql";

const normalizeBodyDelimiter = (body) => body.replace(/^\n+/, "");

const parsePage = (source) => parseFile(
    source,
    ".md",
    (validator) => validator.object({
        pageType: validator.string(),
        title: validator.string(),
        $_body: validator.string(),
    }).noUnknown(false),
);

test("standard-page Markdown bodies survive Tina serialization", async () => {
    for (const filename of ["about.md", "contact.md"]) {
        const source = await readFile(
            new URL(`../src/content/pages/${filename}`, import.meta.url),
            "utf8",
        );
        const parsed = parsePage(source);
        const reopened = parsePage(stringifyFile(parsed, ".md", false));

        assert.equal(
            normalizeBodyDelimiter(reopened.$_body || ""),
            normalizeBodyDelimiter(parsed.$_body || ""),
            `${filename} changed its Markdown body during Tina serialization`,
        );
    }
});

test("page body fields use the shared Markdown editor", async () => {
    const config = await readFile(
        new URL("../tina/config.ts", import.meta.url),
        "utf8",
    );

    const pageBodyFields = Array.from(config.matchAll(
        /\{\s*type:\s*"string",\s*name:\s*"body",[^\n]*component:\s*MarkdownBodyField[^\n]*\}/g,
    ));

    assert.equal(pageBodyFields.length, 3, "Expected Standard, Custom, and Journal body fields");
    assert.equal((config.match(/type:\s*"rich-text"/g) || []).length, 0);
    assert.match(config, /name:\s*"professionalSummary"[^\n]*component:\s*"textarea"/);
    assert.match(config, /name:\s*"markdown"[\s\S]*?component:\s*"textarea"/);
});
