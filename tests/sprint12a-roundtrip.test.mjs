import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseFile, stringifyFile } from "@tinacms/graphql";
import { getYouTubeEmbedUrl } from "../tina/lib/youtubeEmbed.ts";

const fixtureUrl = new URL(
    "../src/content/entries/sprint-12a-markdown-editor-proof.mdx",
    import.meta.url,
);

const parseEntry = (source) => parseFile(
    source,
    ".mdx",
    (validator) => validator.object({
        title: validator.string().required(),
        description: validator.string().required(),
        date: validator.string(),
        entryType: validator.string().required(),
        placement: validator.string().required(),
        primaryTopic: validator.string().required(),
        journalSection: validator.string(),
        tags: validator.array(),
        draft: validator.boolean(),
        technologies: validator.array(),
        media: validator.array(),
        $_body: validator.string().required(),
    }).noUnknown(false),
);

const normalizeBodyDelimiter = (body) => body.replace(/^\n+/, "");

test("Tina's MDX parser preserves the raw Markdown body through serialization", async () => {
    const source = await readFile(fixtureUrl, "utf8");
    const parsed = parseEntry(source);
    const serialized = stringifyFile(parsed, ".mdx", false);
    const reopened = parseEntry(serialized);

    assert.equal(
        normalizeBodyDelimiter(reopened.$_body),
        normalizeBodyDelimiter(parsed.$_body),
    );
    assert.match(reopened.$_body, /\[an absolute link\]\(https:\/\/angrysquirrel\.org\/\)/);
    assert.match(reopened.$_body, /!\[Angry Squirrel editor proof\]\(https:\/\/angrysquirrel\.org\//);
});

test("the established YouTube MDX element survives the raw-body round trip", async () => {
    const source = await readFile(fixtureUrl, "utf8");
    const parsed = parseEntry(source);
    const serialized = stringifyFile(parsed, ".mdx", false);
    const reopened = parseEntry(serialized);

    assert.match(reopened.$_body, /<YouTube url="https:\/\/www\.youtube\.com\/watch\?v=8rckrqsaZjk"/);
    assert.equal((reopened.$_body.match(/<YouTube\b/g) || []).length, 1);
});

test("the editor preview accepts only valid HTTPS YouTube embeds", () => {
    assert.equal(
        getYouTubeEmbedUrl("https://www.youtube.com/watch?v=8rckrqsaZjk"),
        "https://www.youtube-nocookie.com/embed/8rckrqsaZjk",
    );
    assert.equal(
        getYouTubeEmbedUrl("https://youtu.be/8rckrqsaZjk"),
        "https://www.youtube-nocookie.com/embed/8rckrqsaZjk",
    );
    assert.equal(
        getYouTubeEmbedUrl("https://www.youtube.com/shorts/8rckrqsaZjk"),
        "https://www.youtube-nocookie.com/embed/8rckrqsaZjk",
    );
    assert.equal(getYouTubeEmbedUrl("http://www.youtube.com/watch?v=8rckrqsaZjk"), "");
    assert.equal(getYouTubeEmbedUrl("https://youtube.com.example.org/watch?v=8rckrqsaZjk"), "");
    assert.equal(getYouTubeEmbedUrl("javascript:alert(1)"), "");
});
