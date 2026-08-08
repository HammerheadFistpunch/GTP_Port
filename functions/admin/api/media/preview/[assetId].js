import { getPreview, MediaServiceError } from "../../../../../src/server/media-backend.js";

export const onRequestGet = async ({ env, params, request }) => {
    try {
        const size = new URL(request.url).searchParams.get("size");
        return await getPreview(env, params.assetId, size);
    } catch (error) {
        const status = error instanceof MediaServiceError ? error.status : 500;
        const message = error instanceof MediaServiceError ? error.message : "Unable to load the Immich preview.";
        return Response.json({ error: message }, {
            status,
            headers: { "cache-control": "no-store" },
        });
    }
};
