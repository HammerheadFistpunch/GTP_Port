import { searchAssets, MediaServiceError } from "../../../../src/server/media-backend.js";

export const onRequestGet = async ({ env, request }) => {
    try {
        return Response.json(await searchAssets(env, new URL(request.url)), {
            headers: { "cache-control": "private, no-store" },
        });
    } catch (error) {
        const status = error instanceof MediaServiceError ? error.status : 500;
        const message = error instanceof MediaServiceError ? error.message : "Unable to load Immich assets.";
        return Response.json({ error: message }, {
            status,
            headers: { "cache-control": "no-store" },
        });
    }
};
