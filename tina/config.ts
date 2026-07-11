import { defineConfig } from "tinacms";

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
                        type: "object",
                        name: "hero",
                        label: "Homepage Hero",
                        required: true,
                        fields: [
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
                        name: "featuredWork",
                        label: "Featured Work Section",
                        required: true,
                        fields: [
                            {
                                type: "string",
                                name: "title",
                                label: "Section Title",
                                required: true,
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
                                label: "Number of Projects",
                                required: true,
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
                        name: "journalPreview",
                        label: "Journal Preview Section",
                        required: true,
                        fields: [
                            {
                                type: "string",
                                name: "title",
                                label: "Section Title",
                                required: true,
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
                                label: "Number of Articles",
                                required: true,
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
                        name: "aboutCallout",
                        label: "About Callout",
                        required: true,
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
                                type: "object",
                                name: "link",
                                label: "Link",
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
                        label: "Topics",
                        list: true,
                        ui: {
                            component: "tags",
                        },
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
                    include: "{about,contact,resume}",
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
             * JOURNAL ENTRIES
             *
             * Maps to:
             * src/content/journal/*.md
             */
            {
                name: "journal",
                label: "Journal Entries",
                path: "src/content/journal",
                format: "md",

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
                        type: "datetime",
                        name: "date",
                        label: "Publication Date",
                        required: true,
                    },
                    {
                        type: "datetime",
                        name: "updatedDate",
                        label: "Updated Date",
                    },
                    {
                        type: "string",
                        name: "category",
                        label: "Category",
                        required: true,
                        options: [
                            {
                                value: "Technology",
                                label: "Technology",
                            },
                            {
                                value: "Cars",
                                label: "Cars",
                            },
                            {
                                value: "Photography",
                                label: "Photography",
                            },
                            {
                                value: "Projects",
                                label: "Projects",
                            },
                            {
                                value: "Personal",
                                label: "Personal",
                            },
                        ],
                    },
                    {
                        type: "string",
                        name: "tags",
                        label: "Tags",
                        list: true,
                        ui: {
                            component: "tags",
                        },
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
                        type: "rich-text",
                        name: "body",
                        label: "Article Content",
                        isBody: true,
                    },
                ],
            },

            /*
             * PORTFOLIO PROJECTS
             *
             * Maps to:
             * src/content/projects/*.md
             */
            {
                name: "projects",
                label: "Portfolio Projects",
                path: "src/content/projects",
                format: "md",

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
                        type: "datetime",
                        name: "date",
                        label: "Project Date",
                    },
                    {
                        type: "string",
                        name: "projectType",
                        label: "Project Type",
                        required: true,
                        options: [
                            {
                                value: "Software",
                                label: "Software",
                            },
                            {
                                value: "Photography",
                                label: "Photography",
                            },
                            {
                                value: "Video",
                                label: "Video",
                            },
                            {
                                value: "Writing",
                                label: "Writing",
                            },
                            {
                                value: "Case Study",
                                label: "Case Study",
                            },
                            {
                                value: "Electronics",
                                label: "Electronics",
                            },
                            {
                                value: "Other",
                                label: "Other",
                            },
                        ],
                    },
                    {
                        type: "string",
                        name: "tags",
                        label: "Tags",
                        list: true,
                        ui: {
                            component: "tags",
                        },
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
                        type: "image",
                        name: "coverImage",
                        label: "Cover Image",
                    },
                    {
                        type: "boolean",
                        name: "featured",
                        label: "Featured Project",
                    },
                    {
                        type: "boolean",
                        name: "draft",
                        label: "Draft",
                    },
                    {
                        type: "object",
                        name: "links",
                        label: "Project Links",
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
                        name: "media",
                        label: "Project Media",
                        list: true,
                        fields: [
                            {
                                type: "string",
                                name: "type",
                                label: "Media Type",
                                required: true,
                                options: [
                                    {
                                        value: "image",
                                        label: "Image",
                                    },
                                    {
                                        value: "video",
                                        label: "Video",
                                    },
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
                        label: "Project Content",
                        isBody: true,
                    },
                ],
            },
        ],
    },
});