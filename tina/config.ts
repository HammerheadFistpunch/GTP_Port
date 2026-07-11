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
            {
                name: "settings",
                label: "Site Settings",
                path: "src/content/settings",
                format: "md",
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
                        ui: {
                            component: "textarea",
                        },
                        required: true,
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
                        ui: {
                            component: "textarea",
                        },
                        required: true,
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
                        label: "Navigation",
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

            {
                name: "journal",
                label: "Journal",
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
                        ui: {
                            component: "textarea",
                        },
                        required: true,
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
                            "Technology",
                            "Cars",
                            "Photography",
                            "Projects",
                            "Personal",
                        ],
                    },
                    {
                        type: "string",
                        name: "tags",
                        label: "Tags",
                        list: true,
                    },
                    {
                        type: "image",
                        name: "coverImage",
                        label: "Cover Image",
                    },
                    {
                        type: "boolean",
                        name: "featured",
                        label: "Featured",
                    },
                    {
                        type: "boolean",
                        name: "draft",
                        label: "Draft",
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Article",
                        isBody: true,
                    },
                ],
            },

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
                        ui: {
                            component: "textarea",
                        },
                        required: true,
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
                            "Software",
                            "Photography",
                            "Video",
                            "Writing",
                            "Case Study",
                            "Electronics",
                            "Other",
                        ],
                    },
                    {
                        type: "string",
                        name: "tags",
                        label: "Tags",
                        list: true,
                    },
                    {
                        type: "string",
                        name: "technologies",
                        label: "Technologies",
                        list: true,
                    },
                    {
                        type: "image",
                        name: "coverImage",
                        label: "Cover Image",
                    },
                    {
                        type: "boolean",
                        name: "featured",
                        label: "Featured",
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
                        label: "Media",
                        list: true,
                        fields: [
                            {
                                type: "string",
                                name: "type",
                                label: "Media Type",
                                required: true,
                                options: ["image", "video"],
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

            {
                name: "pages",
                label: "Pages",
                path: "src/content/pages",
                format: "md",
                fields: [
                    {
                        type: "string",
                        name: "pageType",
                        label: "Page Type",
                        required: true,
                        options: ["home", "archive", "standard"],
                    },
                    {
                        type: "string",
                        name: "title",
                        label: "Title",
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
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Description",
                        ui: {
                            component: "textarea",
                        },
                        required: true,
                    },
                    {
                        type: "string",
                        name: "headerStyle",
                        label: "Header Style",
                        options: ["compact", "featured"],
                    },
                    {
                        type: "string",
                        name: "sectionTitle",
                        label: "Section Title",
                    },
                    {
                        type: "string",
                        name: "emptyMessage",
                        label: "Empty-State Message",
                    },
                    {
                        type: "string",
                        name: "topics",
                        label: "Topics",
                        list: true,
                    },
                    {
                        type: "object",
                        name: "links",
                        label: "Links",
                        list: true,
                        fields: linkFields,
                    },
                    {
                        type: "object",
                        name: "hero",
                        label: "Homepage Hero",
                        fields: [
                            {
                                type: "string",
                                name: "eyebrow",
                                label: "Eyebrow",
                            },
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
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
                                type: "image",
                                name: "image",
                                label: "Image",
                            },
                            {
                                type: "object",
                                name: "primaryCta",
                                label: "Primary Button",
                                fields: linkFields,
                            },
                            {
                                type: "object",
                                name: "secondaryCta",
                                label: "Secondary Button",
                                fields: linkFields,
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "featuredWork",
                        label: "Featured Work Section",
                        fields: [
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
                            },
                            {
                                type: "string",
                                name: "subtitle",
                                label: "Subtitle",
                            },
                            {
                                type: "number",
                                name: "limit",
                                label: "Number of Projects",
                            },
                            {
                                type: "string",
                                name: "emptyMessage",
                                label: "Empty-State Message",
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "journalPreview",
                        label: "Journal Preview Section",
                        fields: [
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
                            },
                            {
                                type: "string",
                                name: "subtitle",
                                label: "Subtitle",
                            },
                            {
                                type: "number",
                                name: "limit",
                                label: "Number of Articles",
                            },
                            {
                                type: "string",
                                name: "emptyMessage",
                                label: "Empty-State Message",
                            },
                        ],
                    },
                    {
                        type: "object",
                        name: "aboutCallout",
                        label: "About Callout",
                        fields: [
                            {
                                type: "string",
                                name: "title",
                                label: "Title",
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
                                type: "object",
                                name: "link",
                                label: "Link",
                                fields: linkFields,
                            },
                        ],
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Page Content",
                        isBody: true,
                    },
                ],
            },
        ],
    },
});