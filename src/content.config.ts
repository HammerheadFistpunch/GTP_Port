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

const immichGallery = z.object({
    shareUrl: z.url(),
    title: z.string().optional(),
    imageAltPrefix: z.string().optional(),
});

const link = z.object({
    label: z.string(),
    href: z.string(),
});

const headerStyle = z.enum(["compact", "featured"]).default("compact");

const timelineItem = z.object({
    period: z.string(),
    title: z.string(),
    organization: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).default([]),
});

const competency = z.object({
    title: z.string(),
    description: z.string(),
});

const educationItem = z.object({
    degree: z.string(),
    institution: z.string(),
    focus: z.string().optional(),
    period: z.string().optional(),
});

const entries = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/entries",
    }),
    schema: z.object({
        ...sharedFields,
        entryType: z.enum([
            "Article",
            "Project",
            "Case Study",
            "Gallery",
        ]),
        placement: z.enum([
            "portfolio",
            "both",
            "journal",
        ]),
        date: z.coerce.date().optional(),
        updatedDate: z.coerce.date().optional(),
        primaryTopic: z.string(),
        portfolioOrder: z.number().int().default(0),
        tileSize: z.enum([
            "standard",
            "wide",
            "tall",
            "large",
        ]).default("standard"),
        technologies: z.array(z.string()).default([]),
        links: z.object({
            repository: z.url().optional(),
            demo: z.url().optional(),
            external: z.url().optional(),
        }).optional(),
        immichGallery: immichGallery.optional(),
        media: z.array(mediaItem).default([]),
    }),
});

const pages = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/pages",
    }),
    schema: z.discriminatedUnion("pageType", [
        z.object({
            pageType: z.literal("home"),
            description: z.string(),
            hero: z.object({
                eyebrow: z.string().optional(),
                title: z.string(),
                description: z.string(),
                image: z.string().optional(),
                primaryCta: link,
                secondaryCta: link,
            }),
            featuredWork: z.object({
                title: z.string(),
                titleHref: z.string(),
                subtitle: z.string(),
                limit: z.number().int().positive().default(3),
                emptyMessage: z.string(),
            }),
            journalPreview: z.object({
                title: z.string(),
                titleHref: z.string(),
                subtitle: z.string(),
                limit: z.number().int().positive().default(3),
                emptyMessage: z.string(),
            }),
            aboutCallout: z.object({
                title: z.string(),
                description: z.string(),
                link: link,
            }),
        }),
        z.object({
            pageType: z.literal("archive"),
            title: z.string(),
            eyebrow: z.string().optional(),
            headline: z.string(),
            description: z.string(),
            headerStyle,
            sectionTitle: z.string(),
            emptyMessage: z.string(),
            topics: z.array(z.string()).default([]),
        }),
        z.object({
            pageType: z.literal("standard"),
            title: z.string(),
            eyebrow: z.string().optional(),
            headline: z.string(),
            description: z.string(),
            headerStyle,
            links: z.array(link).default([]),
            professionalSummary: z.string().default(""),
            competencies: z.array(competency).default([]),
            experience: z.array(timelineItem).default([]),
            education: z.array(educationItem).default([]),
        }),
    ]),
});

const settings = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/settings",
    }),
    schema: z.object({
        siteName: z.string(),
        logoText: z.string(),
        siteDescription: z.string(),
        footerTitle: z.string(),
        footerDescription: z.string(),
        copyrightName: z.string(),
        navigation: z.array(link),
        footerLinks: z.array(link),
    }),
});

export const collections = {
    entries,
    pages,
    settings,
};
