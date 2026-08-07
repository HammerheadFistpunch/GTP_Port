import assert from "node:assert/strict";
import test from "node:test";
import {
    createTagRegistry,
    resolveEffectiveTag,
    resolveTagReferences,
} from "../src/lib/tags.ts";

const documents = [
    {
        id: "automotive",
        data: {
            label: "Automotive",
            slug: "automotive",
            active: true,
            aliases: [],
        },
    },
    {
        id: "cars",
        data: {
            label: "Cars",
            slug: "cars",
            active: false,
            replacement: "src/content/tags/automotive.md",
            aliases: ["car-stuff"],
        },
    },
    {
        id: "overlander",
        data: {
            label: "Overlander",
            slug: "overlander",
            active: true,
            aliases: [],
        },
    },
    {
        id: "overlanding",
        data: {
            label: "Overlanding",
            slug: "overlanding",
            active: true,
            aliases: [],
        },
    },
];

test("retired Topics can resolve to an explicit replacement without deleting old routes", () => {
    const registry = createTagRegistry(documents);
    const retired = registry.byId.get("cars");
    assert.ok(retired);
    assert.equal(resolveEffectiveTag(retired, registry).id, "automotive");
    assert.equal(registry.byRoute.get("cars")?.id, "cars");
    assert.equal(registry.byRoute.get("car-stuff")?.id, "cars");
});

test("existing story references to a retired Topic resolve to the replacement", () => {
    const registry = createTagRegistry(documents);
    const resolved = resolveTagReferences(
        [{ tag: "src/content/tags/cars.md" }],
        registry,
        "fixture",
    );
    assert.deepEqual(resolved.map((topic) => topic.id), ["automotive"]);
});

test("similarly named Topics remain separate unless an explicit replacement is configured", () => {
    const registry = createTagRegistry(documents);
    const resolved = resolveTagReferences(
        [
            { tag: "src/content/tags/overlander.md" },
            { tag: "src/content/tags/overlanding.md" },
        ],
        registry,
        "fixture",
    );
    assert.deepEqual(resolved.map((topic) => topic.id), ["overlander", "overlanding"]);
});
