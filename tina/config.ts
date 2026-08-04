import { defineConfig } from "tinacms";
import PlacementField from "./components/PlacementField";
import { journalSectionOptions } from "../src/lib/journal-sections";

const branch =
    process.env.GITHUB_BRANCH ||
    process.env.CF_PAGES_BRANCH ||
    process.env.HEAD ||
    "gpt-handoff";

const linkFields = [
    {
        type: "string" as const,
        name: "label",
        label: "Label",
        required: true,
    },
    {
        type: "string" as const,
        name: "href",
        label: "Link",
        required: true,
    },
];

const portfolioTileFields = [
    {
        type: "reference" as const,
        name: "source",
        label: "Portfolio Source",
        required: true,
        collections: ["entries", "flexiblePages"],
        description:
            "Choose an existing Content Entry or Flexible Page. Removing this tile never deletes the source.",
    },
    {
        type: "string" as const,
        name: "tileSize",
        label: "Tile Size",
        required: true,
        options: [
            { value: "standard", label: "Standard" },
            { value: "wide", label: "Wide" },
            { value: "tall", label: "Tall" },
            { value: "large", label: "Large" },
        ],
    },
    {
        type: "boolean" as const,
        name: "emphasis",
        label: "Emphasize Tile",
        description:
            "Adds a stronger accent without changing the selected source document.",
    },
    {
        type: "string" as const,
        name: "titleOverride",
        label: "Optional Title Override",
    },
    {
        type: "string" as const,
        name: "descriptionOverride",
        label: "Optional Description Override",
        ui: {
            component: "textarea",
        },
    },
    {
        type: "image" as const,
        name: "imageOverride",
        label: "Optional Image Override",
    },
];

const flexiblePageBlockTemplates = [
    {
        name: "richText",
        label: "Rich Text",
        ui: {
            itemProps: (item: Record<string, unknown>) => ({
                label: (item?.heading as string) || "Rich Text",
            }),
            defaultItem: {
                markdown: "",
            },
        },
        fields: [
            {
                type: "string" as const,
                name: "heading",
                label: "Optional Heading",
            },
            {
                type: "string" as const,
                name: "markdown",
                label: "Text (Markdown)",
                description:
                    "Portable Markdown text. Use blank lines between paragraphs.",
                required: true,
                ui: {
                    component: "textarea",
                },
            },
        ],
    },
    {
        name: "image",
        label: "Image",
        ui: {
            itemProps: (item: Record<string, unknown>) => ({
                label: (item?.heading as string) || (item?.caption as string) || "Image",
            }),
        },
        fields: [
            {
                type: "string" as const,
                name: "heading",
                label: "Optional Heading",
            },
            {
                type: "image" as const,
                name: "src",
                label: "Image",
                required: true,
            },
            {
                type: "string" as const,
                name: "alt",
                label: "Alt Text",
                description:
                    "Describe meaningful images. Leave blank only when the image is decorative.",
            },
            {
                type: "string" as const,
                name: "caption",
                label: "Caption",
                ui: {
                    component: "textarea",
                },
            },
        ],
    },
    {
        name: "youtube",
        label: "YouTube Video",
        ui: {
            itemProps: (item: Record<string, unknown>) => ({
                label: (item?.title as string) || "YouTube Video",
            }),
        },
        fields: [
            {
                type: "string" as const,
                name: "heading",
                label: "Optional Heading",
            },
            {
                type: "string" as const,
                name: "url",
                label: "YouTube URL",
                required: true,
                description:
                    "Paste a standard youtube.com, youtu.be, or YouTube embed URL.",
            },
            {
                type: "string" as const,
                name: "title",
                label: "Accessible Video Title",
                required: true,
            },
            {
                type: "string" as const,
                name: "caption",
                label: "Caption",
                ui: {
                    component: "textarea",
                },
            },
        ],
    },
    {
        name: "immichGallery",
        label: "Immich Gallery",
        ui: {
            itemProps: (item: Record<string, unknown>) => ({
                label: (item?.heading as string) || "Immich Gallery",
            }),
        },
        fields: [
            {
                type: "string" as const,
                name: "heading",
                label: "Gallery Heading",
            },
            {
                type: "string" as const,
                name: "shareUrl",
                label: "Public Immich Share URL",
                required: true,
            },
            {
                type: "string" as const,
                name: "imageAltPrefix",
                label: "Image Alt Prefix",
                description:
                    "Short description used before each image number, such as Event photo.",
            },
        ],
    },
    {
        name: "childPages",
        label: "Child Page Tiles",
        ui: {
            itemProps: (item: Record<string, unknown>) => ({
                label: (item?.heading as string) || "Child Page Tiles",
            }),
            defaultItem: {
                paths: [],
            },
        },
        fields: [
            {
                type: "string" as const,
                name: "heading",
                label: "Section Heading",
            },
            {
                type: "string" as const,
                name: "introduction",
                label: "Introduction",
                ui: {
                    component: "textarea",
                },
            },
            {
                type: "string" as const,
                name: "paths",
                label: "Page Paths",
                list: true,
                description:
                    "Add complete Flexible Page paths without leading slashes, in the order the tiles should appear.",
            },
        ],
    },
    {
        name: "callToAction",
        label: "Call to Action",
        ui: {
            itemProps: (item: Record<string, unknown>) => ({
                label: (item?.heading as string) || (item?.label as string) || "Call to Action",
            }),
            defaultItem: {
                style: "primary",
            },
        },
        fields: [
            {
                type: "string" as const,
                name: "heading",
                label: "Heading",
            },
            {
                type: "string" as const,
                name: "text",
                label: "Supporting Text",
                ui: {
                    component: "textarea",
                },
            },
            {
                type: "string" as const,
                name: "label",
                label: "Button Label",
                required: true,
            },
            {
                type: "string" as const,
                name: "href",
                label: "Button Link",
                required: true,
            },
            {
                type: "string" as const,
                name: "style",
                label: "Button Style",
                required: true,
                options: [
                    { value: "primary", label: "Primary" },
                    { value: "secondary", label: "Secondary" },
                ],
            },
        ],
    },
];

const entryRichTextTemplates = [
    {
        name: "YouTube",
        label: "YouTube Video",
        ui: {
            defaultItem: {
                title: "Embedded YouTube video",
            },
        },
        fields: [
            {
                type: "string" as const,
                name: "url",
                label: "YouTube URL",
                required: true,
                description:
                    "Paste a standard youtube.com, youtu.be, or YouTube embed URL.",
            },
            {
                type: "string" as const,
                name: "title",
                label: "Accessible Video Title",
                required: true,
                description:
                    "Describe the video for screen readers and when the embed cannot load.",
            },
            {
                type: "string" as const,
                name: "caption",
                label: "Optional Caption",
                ui: {
                    component: "textarea",
                },
            },
        ],
    },
];

export default defineConfig({
    branch,

    clientId: process.env.TINA_PUBLIC_CLIENT_ID || "",
    token: process.env.TINA_TOKEN || "",

    build: {
        outputFolder: "admin",
        publicFolder: "public",
    },

    media: {
        tina: {
            mediaRoot: "uploads",
            publicFolder: "public",
        },
    },

    schema: {
        collections: [
            /*
             * CONTROLLED TAG REGISTRY
             *
             * Maps to:
             * src/content/tags/*.md
             */
            {
                name: "tags",
                label: "Tags",
                path: "src/content/tags",
                format: "md",

                fields: [
                    {
                        type: "string",
                        name: "label",
                        label: "Public Label",
                        required: true,
                        isTitle: true,
                        description:
                            "Visible name. This can change without changing the tag URL.",
                    },
                    {
                        type: "string",
                        name: "slug",
                        label: "Permanent URL Slug",
                        required: true,
                        description:
                            "Lowercase kebab-case. Do not change a published slug unless the old value is added as an alias.",
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Archive Description",
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "aliases",
                        label: "Previous URL Slugs",
                        list: true,
                        description:
                            "Optional old slugs that must continue resolving after a rename.",
                    },
                ],
            },

            /*
             * SITE SETTINGS
             *
             * Maps to:
             * src/content/settings/site.md
             */
            {
                name: "settings",
                label: "Site Settings",
                path: "src/content/settings",
                format: "md",

                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },

                fields: [
                    {
                        type: "string",
                        name: "siteName",
                        label: "Site Name",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "logoText",
                        label: "Logo Text",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "siteDescription",
                        label: "Site Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "footerTitle",
                        label: "Footer Title",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "footerDescription",
                        label: "Footer Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "copyrightName",
                        label: "Copyright Name",
                        required: true,
                    },
                    {
                        type: "object",
                        name: "navigation",
                        label: "Main Navigation",
                        list: true,
                        fields: linkFields,
                    },
                    {
                        type: "object",
                        name: "footerLinks",
                        label: "Footer Links",
                        list: true,
                        fields: linkFields,
                    },
                ],
            },

            /*
             * HOMEPAGE
             *
             * Maps only to:
             * src/content/pages/home.md
             */
            {
                name: "homepage",
                label: "Homepage",
                path: "src/content/pages",
                format: "md",

                match: {
                    include: "home",
                },

                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },

                fields: [
                    {
                        type: "string",
                        name: "pageType",
                        label: "Page Type",
                        required: true,
                        options: [
                            {
                                value: "home",
                                label: "Homepage",
                            },
                        ],
                        description:
                            "Internal setting used by Astro to identify the homepage.",
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "SEO Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "sectionOrder",
                        label: "Homepage Section Order",
                        list: true,
                        required: true,
                        description:
                            "Drag to reorder the homepage blocks. Use each option once; visibility is controlled inside each section.",
                        options: [
                            { value: "intro", label: "Hero + Journal" },
                            { value: "about", label: "About Me" },
                            { value: "capabilities", label: "What I Do" },
                            { value: "technology", label: "Technology Stack" },
                            { value: "portfolio", label: "Featured Portfolio" },
                        ],
                    },
                    {
                        type: "object",
                        name: "hero",
                        label: "Homepage Hero",
                        required: true,
                        fields: [
                            {
                                type: "boolean",
                                name: "visible",
                                label: "Show Hero",
                            },
                            {
                                type: "string",
                                name: "eyebrow",
                                label: "Eyebrow",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Headline",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "description",
                                label: "Description",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "image",
                                name: "image",
                                label: "Hero Image",
                            },
                            {
                                type: "object",
                                name: "primaryCta",
                                label: "Primary Button",
                                required: true,
                                fields: linkFields,
                            },
                            {
                                type: "object",
                                name: "secondaryCta",
                                label: "Secondary Button",
                                required: true,
                                fields: linkFields,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "featuredPortfolio",
                        label: "Featured Portfolio Section",
                        required: true,
                        fields: [
                            {
                                type: "boolean",
                                name: "visible",
                                label: "Show Featured Portfolio",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Section Title",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "titleHref",
                                label: "Title Link",
                                required: true,
                                description:
                                    "Site path linked from the section title, such as /portfolio or /journal.",
                            },
                            {
                                type: "string",
                                name: "subtitle",
                                label: "Section Description",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "number",
                                name: "limit",
                                label: "Legacy Project Limit",
                                required: true,
                                description:
                                    "Fallback used only when no Portfolio Tiles are selected.",
                            },
                            {
                                type: "string",
                                name: "emptyMessage",
                                label: "Empty-State Message",
                                required: true,
                            },
                            {
                                type: "object",
                                name: "tiles",
                                label: "Portfolio Tiles",
                                list: true,
                                required: true,
                                description:
                                    "Add and drag tiles to choose the Homepage portfolio order.",
                                ui: {
                                    itemProps: (item) => ({
                                        label:
                                            item?.titleOverride ||
                                            item?.source ||
                                            "Portfolio tile",
                                    }),
                                    defaultItem: {
                                        tileSize: "standard",
                                        emphasis: false,
                                    },
                                },
                                fields: portfolioTileFields,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "journalPreview",
                        label: "Journal Preview Section",
                        required: true,
                        fields: [
                            {
                                type: "boolean",
                                name: "visible",
                                label: "Show Journal Preview",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Section Title",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "titleHref",
                                label: "Title Link",
                                required: true,
                                description:
                                    "Site path linked from the section title, such as /portfolio or /journal.",
                            },
                            {
                                type: "string",
                                name: "subtitle",
                                label: "Section Description",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "reference",
                                name: "featuredEntry",
                                label: "Featured Journal Story",
                                collections: ["entries"],
                                description:
                                    "Choose the homepage feature. Draft or non-Journal entries fall back safely to the newest published story.",
                            },
                            {
                                type: "number",
                                name: "recentLimit",
                                label: "Recent Story Count",
                                required: true,
                                description:
                                    "Number of compact recent stories shown below the feature. The feature is excluded automatically.",
                            },
                            {
                                type: "string",
                                name: "emptyMessage",
                                label: "Empty-State Message",
                                required: true,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "aboutSection",
                        label: "About Me Section",
                        required: true,
                        fields: [
                            {
                                type: "boolean",
                                name: "visible",
                                label: "Show About Me",
                            },
                            {
                                type: "string",
                                name: "eyebrow",
                                label: "Eyebrow",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "description",
                                label: "Description",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "object",
                                name: "link",
                                label: "Link",
                                required: true,
                                fields: linkFields,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "capabilitiesSection",
                        label: "What I Do Section",
                        required: true,
                        fields: [
                            {
                                type: "boolean",
                                name: "visible",
                                label: "Show What I Do",
                            },
                            {
                                type: "string",
                                name: "eyebrow",
                                label: "Eyebrow",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "description",
                                label: "Description",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "object",
                                name: "items",
                                label: "Capabilities",
                                list: true,
                                required: true,
                                ui: {
                                    itemProps: (item) => ({
                                        label: item?.title || "Capability",
                                    }),
                                },
                                fields: [
                                    {
                                        type: "string",
                                        name: "title",
                                        label: "Title",
                                        required: true,
                                    },
                                    {
                                        type: "string",
                                        name: "description",
                                        label: "Description",
                                        required: true,
                                        ui: {
                                            component: "textarea",
                                        },
                                    },
                                    {
                                        type: "string",
                                        name: "href",
                                        label: "Optional Link",
                                    },
                                ],
                            },
                            {
                                type: "object",
                                name: "link",
                                label: "Section Link",
                                required: true,
                                fields: linkFields,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "technologySection",
                        label: "Technology Stack Section",
                        required: true,
                        fields: [
                            {
                                type: "boolean",
                                name: "visible",
                                label: "Show Technology Stack",
                            },
                            {
                                type: "string",
                                name: "eyebrow",
                                label: "Eyebrow",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "description",
                                label: "Description",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "string",
                                name: "items",
                                label: "Tools and Platforms",
                                list: true,
                                required: true,
                                ui: {
                                    component: "tags",
                                },
                            },
                            {
                                type: "object",
                                name: "link",
                                label: "Section Link",
                                required: true,
                                fields: linkFields,
                            },
                        ],
                    },
                ],
            },

            /*
             * ARCHIVE LANDING PAGES
             *
             * Maps only to:
             * src/content/pages/journal.md
             * src/content/pages/portfolio.md
             */
            {
                name: "archivePage",
                label: "Archive Pages",
                path: "src/content/pages",
                format: "md",

                match: {
                    include: "{journal,portfolio}",
                },

                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },

                fields: [
                    {
                        type: "string",
                        name: "pageType",
                        label: "Page Type",
                        required: true,
                        options: [
                            {
                                value: "archive",
                                label: "Archive Page",
                            },
                        ],
                        description:
                            "Internal setting used by Astro to identify an archive landing page.",
                    },
                    {
                        type: "string",
                        name: "title",
                        label: "Page Title",
                        required: true,
                        isTitle: true,
                    },
                    {
                        type: "string",
                        name: "eyebrow",
                        label: "Eyebrow",
                    },
                    {
                        type: "string",
                        name: "headline",
                        label: "Headline",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "headerStyle",
                        label: "Header Style",
                        required: true,
                        options: [
                            {
                                value: "compact",
                                label: "Compact",
                            },
                            {
                                value: "featured",
                                label: "Featured",
                            },
                        ],
                    },
                    {
                        type: "string",
                        name: "sectionTitle",
                        label: "Content Section Title",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "emptyMessage",
                        label: "Empty-State Message",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "topics",
                        label: "Legacy Topic List",
                        list: true,
                        description:
                            "Compatibility field retained during migration. Public Journal navigation now uses the controlled section list.",
                        ui: {
                            component: "tags",
                        },
                    },
                    {
                        type: "reference",
                        name: "featuredEntry",
                        label: "Featured Journal Story",
                        collections: ["entries"],
                        description:
                            "Select the story featured on journal.md. Draft or non-Journal entries are ignored safely.",
                    },
                    {
                        type: "string",
                        name: "portfolioPacking",
                        label: "Portfolio Tile Packing",
                        description:
                            "Dense fills available gaps; Exact preserves the visible list order.",
                        options: [
                            { value: "dense", label: "Dense" },
                            { value: "exact", label: "Exact Order" },
                        ],
                    },
                    {
                        type: "object",
                        name: "portfolioTiles",
                        label: "Portfolio Tiles",
                        list: true,
                        description:
                            "Add and drag tiles to curate the Portfolio landing page. This field is used by portfolio.md only.",
                        ui: {
                            itemProps: (item) => ({
                                label:
                                    item?.titleOverride ||
                                    item?.source ||
                                    "Portfolio tile",
                            }),
                            defaultItem: {
                                tileSize: "standard",
                                emphasis: false,
                            },
                        },
                        fields: portfolioTileFields,
                    },
                ],
            },

            /*
             * STANDARD CONTENT PAGES
             *
             * Maps only to:
             * src/content/pages/about.md
             * src/content/pages/contact.md
             * src/content/pages/resume.md
             */
            {
                name: "standardPage",
                label: "Standard Pages",
                path: "src/content/pages",
                format: "md",

                match: {
                    include: "{about,contact}",
                },

                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },

                fields: [
                    {
                        type: "string",
                        name: "pageType",
                        label: "Page Type",
                        required: true,
                        options: [
                            {
                                value: "standard",
                                label: "Standard Page",
                            },
                        ],
                        description:
                            "Internal setting used by Astro to identify a standard content page.",
                    },
                    {
                        type: "string",
                        name: "title",
                        label: "Page Title",
                        required: true,
                        isTitle: true,
                    },
                    {
                        type: "string",
                        name: "eyebrow",
                        label: "Eyebrow",
                    },
                    {
                        type: "string",
                        name: "headline",
                        label: "Headline",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "headerStyle",
                        label: "Header Style",
                        required: true,
                        options: [
                            {
                                value: "compact",
                                label: "Compact",
                            },
                            {
                                value: "featured",
                                label: "Featured",
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "links",
                        label: "Page Links",
                        list: true,
                        fields: linkFields,
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Page Content",
                        isBody: true,
                    },
                ],
            },

            /*
             * RESUME
             *
             * Maps only to:
             * src/content/pages/resume.md
             */
            {
                name: "resumePage",
                label: "Resume",
                path: "src/content/pages",
                format: "md",

                match: {
                    include: "resume",
                },

                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },

                fields: [
                    {
                        type: "string",
                        name: "pageType",
                        label: "Page Type",
                        required: true,
                        options: [
                            {
                                value: "standard",
                                label: "Standard Page",
                            },
                        ],
                        description:
                            "Internal setting used by Astro to identify the resume page.",
                    },
                    {
                        type: "string",
                        name: "title",
                        label: "Page Title",
                        required: true,
                        isTitle: true,
                    },
                    {
                        type: "string",
                        name: "eyebrow",
                        label: "Eyebrow",
                    },
                    {
                        type: "string",
                        name: "headline",
                        label: "Headline",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "headerStyle",
                        label: "Header Style",
                        required: true,
                        options: [
                            {
                                value: "compact",
                                label: "Compact",
                            },
                            {
                                value: "featured",
                                label: "Featured",
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "links",
                        label: "Page Links",
                        list: true,
                        fields: linkFields,
                    },
                    {
                        type: "string",
                        name: "professionalSummary",
                        label: "Professional Summary",
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "object",
                        name: "competencies",
                        label: "Core Competencies",
                        list: true,
                        ui: {
                            itemProps: (item) => ({
                                label: item?.title || "Competency",
                            }),
                        },
                        fields: [
                            {
                                type: "string",
                                name: "title",
                                label: "Competency",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "description",
                                label: "Supporting Detail",
                                required: true,
                                ui: {
                                    component: "textarea",
                                },
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "experience",
                        label: "Experience",
                        list: true,
                        ui: {
                            itemProps: (item) => ({
                                label: item?.title || "Experience entry",
                            }),
                        },
                        fields: [
                            {
                                type: "string",
                                name: "period",
                                label: "Period",
                                required: true,
                                description: "Example: 2022 - Present",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Role or Title",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "organization",
                                label: "Organization",
                            },
                            {
                                type: "string",
                                name: "location",
                                label: "Location",
                            },
                            {
                                type: "string",
                                name: "description",
                                label: "Description",
                                ui: {
                                    component: "textarea",
                                },
                            },
                            {
                                type: "string",
                                name: "highlights",
                                label: "Highlights",
                                list: true,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "education",
                        label: "Education",
                        list: true,
                        ui: {
                            itemProps: (item) => ({
                                label: item?.degree || "Education entry",
                            }),
                        },
                        fields: [
                            {
                                type: "string",
                                name: "degree",
                                label: "Degree or Credential",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "institution",
                                label: "Institution",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "focus",
                                label: "Focus or Emphasis",
                            },
                            {
                                type: "string",
                                name: "period",
                                label: "Period",
                            },
                        ],
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Additional Resume Content",
                        isBody: true,
                    },
                ],
            },

            /*
             * FLEXIBLE PAGES
             *
             * Maps to:
             * Markdown files under src/content/flexible-pages/
             */
            {
                name: "flexiblePages",
                label: "Flexible Pages",
                path: "src/content/flexible-pages",
                format: "md",

                defaultItem: () => ({
                    draft: true,
                    navigationOrder: 0,
                }),

                ui: {
                    allowedActions: {
                        create: true,
                        delete: true,
                    },
                    filename: {
                        slugify: (values) =>
                            values?.title
                                ?.toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-+|-+$/g, "") || "untitled-page",
                    },
                },

                fields: [
                    {
                        type: "string",
                        name: "title",
                        label: "Page Title",
                        required: true,
                        isTitle: true,
                    },
                    {
                        type: "string",
                        name: "path",
                        label: "URL Path",
                        required: true,
                        description:
                            "Lowercase path without a leading slash, such as services or services/video-production.",
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Page Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "eyebrow",
                        label: "Eyebrow",
                        description:
                            "Optional short label shown above the page title.",
                    },
                    {
                        type: "image",
                        name: "headerImage",
                        label: "Header Image",
                        description:
                            "Optional wide image shown between the page header and body.",
                    },
                    {
                        type: "string",
                        name: "headerImageAlt",
                        label: "Header Image Alt Text",
                        description:
                            "Describe meaningful header images. Leave blank only when the image is decorative.",
                    },
                    {
                        type: "string",
                        name: "navigationLabel",
                        label: "Navigation Label",
                        description:
                            "Optional shorter title for breadcrumbs and future menus. The page title is used when blank.",
                    },
                    {
                        type: "number",
                        name: "navigationOrder",
                        label: "Navigation Order",
                        description:
                            "Lower numbers will appear first among sibling pages in future generated menus.",
                        ui: {
                            component: "number",
                        },
                    },
                    {
                        type: "boolean",
                        name: "draft",
                        label: "Draft",
                        description:
                            "Draft pages are saved in Git but do not receive a public route.",
                    },
                    {
                        type: "string",
                        name: "seoTitle",
                        label: "SEO Title",
                        description:
                            "Optional search and sharing title. The page title is used when blank.",
                    },
                    {
                        type: "string",
                        name: "seoDescription",
                        label: "SEO Description",
                        description:
                            "Optional search and sharing description. The page description is used when blank.",
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "image",
                        name: "seoImage",
                        label: "Social Sharing Image",
                    },
                    {
                        type: "object",
                        name: "blocks",
                        label: "Page Blocks",
                        list: true,
                        templates: flexiblePageBlockTemplates,
                        description:
                            "Add, remove, and drag blocks to control the page order. Existing Page Content remains below these blocks.",
                        openFormOnCreate: true,
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Legacy Page Content",
                        description:
                            "Existing Markdown remains supported and renders after Page Blocks. New modular page sections should use Page Blocks.",
                        isBody: true,
                    },
                ],
            },

            /*
             * UNIFIED CONTENT ENTRIES
             *
             * Maps to:
             * src/content/entries/*.mdx
             *
             * Portfolio and Journal are placements, not separate content types.
             * The legacy collections below remain during the staged migration.
             */
            {
                name: "entries",
                label: "Content Entries",
                path: "src/content/entries",
                format: "mdx",

                fields: [
                    {
                        type: "string",
                        name: "title",
                        label: "Title",
                        required: true,
                        isTitle: true,
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Description",
                        required: true,
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "string",
                        name: "entryType",
                        label: "Entry Type",
                        required: true,
                        options: [
                            { value: "Article", label: "Article" },
                            { value: "Project", label: "Project" },
                            { value: "Case Study", label: "Case Study" },
                            { value: "Gallery", label: "Gallery" },
                        ],
                    },
                    {
                        type: "string",
                        name: "placement",
                        label: "Placement",
                        required: true,
                        description:
                            "Controls where this entry appears without moving or converting the file.",
                        ui: {
                            component: PlacementField,
                        },
                        options: [
                            {
                                value: "portfolio",
                                label: "Portfolio Only",
                            },
                            {
                                value: "both",
                                label: "Portfolio + Journal",
                            },
                            {
                                value: "journal",
                                label: "Journal Only (Archived from Portfolio)",
                            },
                        ],
                    },
                    {
                        type: "datetime",
                        name: "date",
                        label: "Publication Date",
                        description:
                            "Used for Journal chronology. Portfolio ordering is controlled separately.",
                    },
                    {
                        type: "datetime",
                        name: "updatedDate",
                        label: "Updated Date",
                    },
                    {
                        type: "string",
                        name: "primaryTopic",
                        label: "Primary Topic",
                        required: true,
                        description:
                            "A broad label such as Cars, Photography, Software, Writing, or Case Study.",
                    },
                    {
                        type: "string",
                        name: "journalSection",
                        label: "Primary Journal Section",
                        options: journalSectionOptions,
                        description:
                            "Required when Placement includes Journal. Choose one controlled editorial section.",
                    },
                    {
                        type: "object",
                        name: "tags",
                        label: "Tags",
                        list: true,
                        description:
                            "Select controlled subject tags. Add a missing subject in the Tags collection first.",
                        ui: {
                            itemProps: (item) => ({
                                label: item?.tag || "Select a tag",
                            }),
                        },
                        fields: [
                            {
                                type: "reference",
                                name: "tag",
                                label: "Tag",
                                required: true,
                                collections: ["tags"],
                            },
                        ],
                    },
                    {
                        type: "image",
                        name: "coverImage",
                        label: "Cover Image",
                    },
                    {
                        type: "boolean",
                        name: "featured",
                        label: "Featured Entry",
                    },
                    {
                        type: "boolean",
                        name: "draft",
                        label: "Draft",
                    },
                    {
                        type: "number",
                        name: "portfolioOrder",
                        label: "Portfolio Order",
                        description:
                            "Lower numbers appear first. Journal placement ignores this value.",
                    },
                    {
                        type: "string",
                        name: "tileSize",
                        label: "Portfolio Tile Size",
                        options: [
                            { value: "standard", label: "Standard" },
                            { value: "wide", label: "Wide" },
                            { value: "tall", label: "Tall" },
                            { value: "large", label: "Large" },
                        ],
                    },
                    {
                        type: "string",
                        name: "technologies",
                        label: "Technologies",
                        list: true,
                        ui: {
                            component: "tags",
                        },
                    },
                    {
                        type: "object",
                        name: "links",
                        label: "Entry Links",
                        fields: [
                            {
                                type: "string",
                                name: "repository",
                                label: "Repository URL",
                            },
                            {
                                type: "string",
                                name: "demo",
                                label: "Demo URL",
                            },
                            {
                                type: "string",
                                name: "external",
                                label: "External URL",
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "immichGallery",
                        label: "Immich Gallery",
                        description:
                            "Display a live gallery from a public share.angrysquirrel.org album link.",
                        fields: [
                            {
                                type: "string",
                                name: "shareUrl",
                                label: "Public Share URL",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Gallery Title",
                            },
                            {
                                type: "string",
                                name: "imageAltPrefix",
                                label: "Image Description Prefix",
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "media",
                        label: "Entry Media",
                        list: true,
                        fields: [
                            {
                                type: "string",
                                name: "type",
                                label: "Media Type",
                                required: true,
                                options: [
                                    { value: "image", label: "Image" },
                                    { value: "video", label: "Video" },
                                ],
                            },
                            {
                                type: "string",
                                name: "src",
                                label: "Source",
                                required: true,
                            },
                            {
                                type: "string",
                                name: "alt",
                                label: "Alternative Text",
                            },
                            {
                                type: "string",
                                name: "caption",
                                label: "Caption",
                            },
                        ],
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Entry Content",
                        isBody: true,
                        templates: entryRichTextTemplates,
                    },
                ],
            },

        ],
    },
});
