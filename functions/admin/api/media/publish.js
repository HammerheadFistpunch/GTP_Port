import { publishAsset, MediaServiceError } from "../../../../src/server/media-backend.js";

export const onRequestPost = async ({ env, request }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const result = await publishAsset(env, body.assetId);
        return Response.json(result, {
            status: result.variants.every((variant) => variant.reused) ? 200 : 201,
            headers: { "cache-control": "no-store" },
        });
    } catch (error) {
        const status = error instanceof MediaServiceError ? error.status : 500;
        const message = error instanceof MediaServiceError ? error.message : "Unable to publish the image.";
        const code = error instanceof MediaServiceError ? error.code : "media_error";
        return Response.json({ error: message, code }, {
            status,
            headers: { "cache-control": "no-store" },
        });
    }
};
