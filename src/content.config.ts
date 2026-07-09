import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const journal = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/journal",
    }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        description: z.string().optional(),
    }),
});

const projects = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/projects",
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
    }),
});

export const collections = {
    journal,
    projects,
};