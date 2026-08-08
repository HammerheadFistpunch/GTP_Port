import { listAlbums, MediaServiceError } from "../../../../src/server/media-backend.js";

export const onRequestGet = async ({ env }) => {
    try {
        return Response.json({ albums: await listAlbums(env) }, {
            headers: { "cache-control": "private, no-store" },
        });
    } catch (error) {
        const status = error instanceof MediaServiceError ? error.status : 500;
        const message = error instanceof MediaServiceError ? error.message : "Unable to load Immich albums.";
        return Response.json({ error: message }, {
            status,
            headers: { "cache-control": "no-store" },
        });
    }
};
