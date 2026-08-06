import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { validateFlexiblePagePath } from "./lib/flexible-pages";
import { flexiblePageBlockSchema } from "./lib/page-blocks";
import { journalSectionSlugs } from "./lib/journal-sections";

const sharedFields = {
    title: z.string(),
    description: z.string(),
    tags: z.array(z.object({
        tag: z.string().regex(
            /^src\/content\/tags\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/,
            "Tags must reference a document in src/content/tags.",
        ),
    })).default([]),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
};

const tags = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/tags",
    }),
    schema: z.object({
        label: z.string().min(1),
        slug: z.string().regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Tag slugs must use lowercase letters, numbers, and single hyphens.",
        ),
        description: z.string().optional(),
        aliases: z.array(z.string().regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Tag aliases must use lowercase letters, numbers, and single hyphens.",
        )).default([]),
    }),
});

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

const navigationDestination = z.object({
    label: z.string(),
    page: z.string().optional(),
    href: z.string().optional(),
});

const navigationItem = navigationDestination.extend({
    children: z.array(navigationDestination).default([]),
});

const headerStyle = z.enum(["compact", "featured"]).default("compact");

const homepageSectionKeys = [
    "intro",
    "about",
    "capabilities",
    "technology",
    "portfolio",
] as const;

const homepageSectionOrder = z.array(z.enum(homepageSectionKeys)).default([
    "intro",
    "about",
    "capabilities",
    "technology",
    "portfolio",
]);

const homepageLink = z.object({
    label: z.string(),
    href: z.string(),
});

const homepagePortfolioLink = homepageLink.extend({
    image: z.string().optional(),
});

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
        pattern: "**/*.mdx",
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
        journalSection: z.enum(journalSectionSlugs).optional(),
        technologies: z.array(z.string()).default([]),
        links: z.object({
            repository: z.url().optional(),
            demo: z.url().optional(),
            external: z.url().optional(),
        }).optional(),
        immichGallery: immichGallery.optional(),
        media: z.array(mediaItem).default([]),
    }).superRefine((entry, context) => {
        const isPublishedInJournal =
            !entry.draft &&
            (entry.placement === "journal" || entry.placement === "both");

        if (isPublishedInJournal && !entry.journalSection) {
            context.addIssue({
                code: "custom",
                path: ["journalSection"],
                message: "Published Journal entries require a primary Journal section.",
            });
        }
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
            sectionOrder: homepageSectionOrder,
            hero: z.object({
                visible: z.boolean().default(true),
                eyebrow: z.string().optional(),
                title: z.string(),
                description: z.string(),
                image: z.string().optional(),
                primaryCta: link,
                secondaryCta: link,
            }),
            portfolioLinks: z.object({
                visible: z.boolean().default(true),
                title: z.string(),
                subtitle: z.string(),
                links: z.array(homepagePortfolioLink).default([]),
            }),
            journalPreview: z.object({
                visible: z.boolean().default(true),
                title: z.string(),
                titleHref: z.string(),
                subtitle: z.string(),
                featuredEntry: z.string().optional(),
                recentLimit: z.number().int().positive().default(3),
                emptyMessage: z.string(),
            }),
            aboutSection: z.object({
                visible: z.boolean().default(true),
                eyebrow: z.string().optional(),
                title: z.string(),
                description: z.string(),
                link: homepageLink,
            }),
            capabilitiesSection: z.object({
                visible: z.boolean().default(true),
                eyebrow: z.string().optional(),
                title: z.string(),
                description: z.string(),
                items: z.array(z.object({
                    title: z.string(),
                    description: z.string(),
                    href: z.string().optional(),
                })).default([]),
                link: homepageLink,
            }),
            technologySection: z.object({
                visible: z.boolean().default(true),
                eyebrow: z.string().optional(),
                title: z.string(),
                description: z.string(),
                items: z.array(z.string()).default([]),
                link: homepageLink,
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
            featuredEntry: z.string().optional(),
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

const flexiblePages = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/flexible-pages",
    }),
    schema: z.object({
        title: z.string(),
        path: z.string().superRefine((value, context) => {
            const error = validateFlexiblePagePath(value);

            if (error) {
                context.addIssue({
                    code: "custom",
                    message: error,
                });
            }
        }),
        description: z.string(),
        eyebrow: z.string().optional(),
        headerImage: z.string().optional(),
        headerImageAlt: z.string().optional(),
        navigationLabel: z.string().optional(),
        draft: z.boolean().default(false),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoImage: z.string().optional(),
        blocks: z.array(flexiblePageBlockSchema).default([]),
    }),
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
        navigation: z.array(navigationItem),
        footerLinks: z.array(link),
    }),
});

export const collections = {
    entries,
    flexiblePages,
    pages,
    settings,
    tags,
};
