import assert from "node:assert/strict";
import test from "node:test";
import {
    parseEntryImport,
    resolveImportedTags,
    validateImportFilename,
} from "../tina/lib/entryImport.ts";

const portableSource = `---
title: Imported field note
summary: A portable entry imported from another Markdown system.
date: 2026-08-06T12:30:00-06:00
type: Article
placement: journal
category: Writing
section: field-notes
tags:
  - Engineering
  - cars
cover: https://photos.angrysquirrel.org/api/assets/example/thumbnail
technologies: [Astro, TinaCMS]
customSourceId: legacy-42
---

## Portable body

An [absolute link](https://angrysquirrel.org/) and an ordinary image:

![Example](./images/example.webp)

<YouTube url="https://www.youtube.com/watch?v=8rckrqsaZjk" title="Example" />
`;

test("the importer maps current Journal fields and discards deprecated metadata", () => {
    const result = parseEntryImport(portableSource, "Imported field note.md");

    assert.equal(result.errors.length, 0);
    assert.equal(result.entry.filename, "imported-field-note");
    assert.equal(result.entry.title, "Imported field note");
    assert.equal(result.entry.description, "A portable entry imported from another Markdown system.");
    assert.equal(result.entry.journalSection, "field-notes");
    assert.deepEqual(result.entry.tagTokens, ["Engineering", "cars"]);
    assert.match(result.entry.body, /<YouTube url=/);
    assert.match(result.entry.body, /!\[Example\]\(\.\/images\/example\.webp\)/);
    assert.deepEqual(result.entry.omittedFields, ["customSourceId"]);
    assert.ok(result.warnings.some((warning) => warning.message.includes("Legacy fields were intentionally discarded")));
    assert.ok(result.warnings.some((warning) => warning.message.includes("customSourceId")));
    assert.equal("placement" in result.entry, false);
    assert.equal("entryType" in result.entry, false);
    assert.equal("primaryTopic" in result.entry, false);
    assert.equal("technologies" in result.entry, false);
    assert.equal("links" in result.entry, false);
});

test("missing metadata, malformed frontmatter, unsafe media, and unsupported MDX are actionable", () => {
    const malformed = parseEntryImport("title: Missing delimiters\n\nBody", "unsafe.md");
    assert.match(malformed.errors[0].message, /must begin with YAML frontmatter/);

    const unsafe = parseEntryImport(`---
title: Unsafe import
description: Safety fixture
---

![Bad](javascript:alert(1))

[Credential link](https://user:password@example.org/private)

<CustomWidget source="surprise" />

{dangerousExpression}

<script>alert("unsafe")</script>
`, "unsafe.mdx");

    assert.ok(unsafe.errors.some((issue) => issue.message.includes("Markdown image source")));
    assert.ok(unsafe.errors.some((issue) => issue.message.includes("Markdown link")));
    assert.ok(unsafe.errors.some((issue) => issue.message.includes("Unsupported MDX component")));
    assert.ok(unsafe.errors.some((issue) => issue.message.includes("MDX expressions")));
    assert.ok(unsafe.errors.some((issue) => issue.message.includes("Raw HTML")));

    const brokenYaml = parseEntryImport(`---
title: First
title: Duplicate
---

Body.
`, "broken.md");
    assert.ok(brokenYaml.errors.some((issue) => issue.field === "frontmatter"));
});

test("import defaults remain draft-safe without obsolete classification requirements", () => {
    const result = parseEntryImport(`---
title: Minimal entry
---

Body copy.
`, "../Minimal Entry.mdx");

    assert.equal(result.entry.filename, "minimal-entry");
    assert.equal(result.entry.journalSection, "");
    assert.ok(result.errors.some((issue) => issue.field === "description"));
    assert.equal(result.errors.some((issue) => issue.field === "primaryTopic"), false);
    assert.equal(validateImportFilename("../../escape"), "Use lowercase letters, numbers, and single hyphens only.");
});

test("imported tag labels, slugs, aliases, and existing references resolve to controlled documents", () => {
    const registry = [
        { label: "Engineering", slug: "engineering", aliases: ["building"], reference: "src/content/tags/engineering.md" },
        { label: "Cars", slug: "cars", aliases: [], reference: "src/content/tags/cars.md" },
    ];
    const result = resolveImportedTags(
        ["Engineering", "cars", "building", "src/content/tags/cars.md", "missing"],
        registry,
    );

    assert.deepEqual(result.references, [
        "src/content/tags/engineering.md",
        "src/content/tags/cars.md",
    ]);
    assert.deepEqual(result.unresolved, ["missing"]);
});
