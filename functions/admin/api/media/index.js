import { getMediaConfiguration, MediaServiceError } from "../../../../src/server/media-backend.js";

export const onRequestGet = async ({ env }) => {
    try {
        const config = getMediaConfiguration(env);
        return Response.json({
            configured: true,
            publicBaseUrl: config.publicBase.toString().replace(/\/$/, ""),
            variants: ["thumbnail", "web"],
            variantVersion: config.variantVersion,
        }, { headers: { "cache-control": "no-store" } });
    } catch (error) {
        const status = error instanceof MediaServiceError ? error.status : 500;
        const message = error instanceof MediaServiceError ? error.message : "Unable to check media configuration.";
        return Response.json({ configured: false, error: message }, {
            status,
            headers: { "cache-control": "no-store" },
        });
    }
};
