import { z } from "astro/zod";
import { getImageSourceError } from "./image-sources";

const optionalText = z.string().optional();
const optionalImageSource = z.string().superRefine((value, context) => {
    const error = getImageSourceError(value);
    if (error) context.addIssue({ code: "custom", message: error });
}).optional();

export const flexiblePageBlockSchema = z.discriminatedUnion("_template", [
    z.object({
        _template: z.literal("richText"),
        heading: optionalText,
        markdown: z.string().default(""),
    }),
    z.object({
        _template: z.literal("image"),
        heading: optionalText,
        src: optionalImageSource,
        alt: optionalText,
        caption: optionalText,
    }),
    z.object({
        _template: z.literal("youtube"),
        heading: optionalText,
        url: optionalText,
        title: optionalText,
        caption: optionalText,
    }),
    z.object({
        _template: z.literal("immichGallery"),
        heading: optionalText,
        shareUrl: optionalText,
        imageAltPrefix: optionalText,
    }),
    z.object({
        _template: z.literal("childPages"),
        heading: optionalText,
        introduction: optionalText,
        paths: z.array(z.string()).default([]),
    }),
    z.object({
        _template: z.literal("callToAction"),
        heading: optionalText,
        text: optionalText,
        label: optionalText,
        href: optionalText,
        style: z.enum(["primary", "secondary"]).default("primary"),
    }),
]);

export type FlexiblePageBlock = z.infer<typeof flexiblePageBlockSchema>;
