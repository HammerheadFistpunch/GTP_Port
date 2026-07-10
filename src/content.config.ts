import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const sharedFields = {
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
};

const mediaItem = z.object({
    type: z.enum(["image", "video"]),
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
});

const journal = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/journal",
    }),
    schema: z.object({
        ...sharedFields,
        date: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum([
            "Technology",
            "Cars",
            "Photography",
            "Projects",
            "Personal",
        ]),
    }),
});

const projects = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/projects",
    }),
    schema: z.object({
        ...sharedFields,
        date: z.coerce.date().optional(),
        projectType: z.enum([
            "Software",
            "Photography",
            "Video",
            "Writing",
            "Case Study",
            "Electronics",
            "Other",
        ]),
        technologies: z.array(z.string()).default([]),
        links: z.object({
            repository: z.url().optional(),
            demo: z.url().optional(),
            external: z.url().optional(),
        }).optional(),
        media: z.array(mediaItem).default([]),
    }),
});

export const collections = {
    journal,
    projects,
};
