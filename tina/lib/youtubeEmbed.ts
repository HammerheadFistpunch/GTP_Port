const youtubeHosts = new Set([
    "youtube.com",
    "youtube-nocookie.com",
    "youtu.be",
]);

export const getYouTubeEmbedUrl = (value: string) => {
    try {
        const parsed = new URL(value);
        const host = parsed.hostname.toLowerCase().replace(/^(www\.|m\.)/, "");

        if (parsed.protocol !== "https:" || !youtubeHosts.has(host)) return "";

        const pathParts = parsed.pathname.split("/").filter(Boolean);
        const id = host === "youtu.be"
            ? pathParts[0]
            : parsed.searchParams.get("v") ||
              (["embed", "shorts", "live"].includes(pathParts[0]) ? pathParts[1] : undefined);

        return id && /^[A-Za-z0-9_-]{6,20}$/.test(id)
            ? `https://www.youtube-nocookie.com/embed/${id}`
            : "";
    } catch {
        return "";
    }
};
