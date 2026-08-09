import React from "react";
import type { CSSProperties, FormEvent } from "react";
import {
    buildImmichAssetsUrl,
    getPublishedWebUrl,
} from "../lib/immichMedia";
import type {
    ImmichEditorAsset,
    PublishedMediaResult,
} from "../lib/immichMedia";

interface Album {
    id: string;
    albumName: string;
    assetCount?: number;
}

interface AssetPage {
    items?: ImmichEditorAsset[];
    nextPage?: number | string | null;
}

interface ImmichImagePickerProps {
    onSelect: (url: string, asset: ImmichEditorAsset) => void;
    buttonLabel?: string;
}

const styles: Record<string, CSSProperties> = {
    button: {
        padding: "10px 14px", border: "1px solid #0f766e", borderRadius: 6,
        background: "#0f766e", color: "#fff", cursor: "pointer", fontSize: 13,
        fontWeight: 700, whiteSpace: "nowrap",
    },
    backdrop: {
        position: "fixed", inset: 0, zIndex: 10000, display: "grid", placeItems: "center",
        padding: 20, background: "rgba(15, 23, 42, 0.72)",
    },
    dialog: {
        width: "min(72rem, 100%)", maxHeight: "min(52rem, calc(100vh - 40px))",
        display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 12,
        background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,.35)", color: "#172033",
    },
    header: {
        display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16,
        padding: "20px 22px 12px", borderBottom: "1px solid #dbe3ee",
    },
    title: { margin: 0, fontSize: 22 },
    help: { margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.5 },
    close: {
        padding: "7px 10px", border: "1px solid #94a3b8", borderRadius: 6,
        background: "#fff", color: "#334155", cursor: "pointer", fontWeight: 700,
    },
    filters: {
        display: "grid", gridTemplateColumns: "minmax(12rem, 1fr) auto minmax(11rem, .5fr) auto",
        gap: 8, padding: "14px 22px", borderBottom: "1px solid #dbe3ee",
    },
    input: {
        minWidth: 0, boxSizing: "border-box", padding: "9px 10px", border: "1px solid #94a3b8",
        borderRadius: 6, background: "#fff", color: "#172033", font: "inherit",
    },
    secondary: {
        padding: "9px 13px", border: "1px solid #2563eb", borderRadius: 6,
        background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 700,
    },
    body: { overflowY: "auto", padding: 22 },
    message: {
        margin: "0 0 14px", padding: "10px 12px", borderRadius: 6,
        background: "#eff6ff", color: "#1e3a8a", fontSize: 13, lineHeight: 1.5,
    },
    error: {
        margin: "0 0 14px", padding: "10px 12px", border: "1px solid #fca5a5",
        borderRadius: 6, background: "#fef2f2", color: "#991b1b", fontSize: 13,
    },
    grid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12,
    },
    card: {
        display: "grid", gridTemplateRows: "130px auto", minWidth: 0, padding: 0,
        overflow: "hidden", border: "1px solid #cbd5e1", borderRadius: 8,
        background: "#f8fafc", color: "#172033", cursor: "pointer", textAlign: "left",
    },
    image: { display: "block", width: "100%", height: 130, objectFit: "cover", background: "#e2e8f0" },
    cardText: { padding: 9, overflowWrap: "anywhere", fontSize: 12, lineHeight: 1.4 },
    footer: { display: "flex", justifyContent: "center", paddingTop: 18 },
};

const responseMessage = async (response: Response, fallback: string) => {
    try {
        const body = await response.json() as { error?: string; message?: string };
        return body.message || body.error || fallback;
    } catch {
        return fallback;
    }
};

export default function ImmichImagePicker({ onSelect, buttonLabel = "Choose from Immich" }: ImmichImagePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [assets, setAssets] = React.useState<ImmichEditorAsset[]>([]);
    const [albums, setAlbums] = React.useState<Album[]>([]);
    const [query, setQuery] = React.useState("");
    const [search, setSearch] = React.useState<"smart" | "filename">("smart");
    const [albumId, setAlbumId] = React.useState("");
    const [nextPage, setNextPage] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [publishingId, setPublishingId] = React.useState("");
    const [error, setError] = React.useState("");

    const loadAssets = React.useCallback(async (page = 1, append = false) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(buildImmichAssetsUrl({ page, query, search, albumId }), {
                credentials: "same-origin",
                headers: { accept: "application/json" },
            });
            if (!response.ok) throw new Error(await responseMessage(response, "Immich images could not be loaded."));
            const result = await response.json() as AssetPage;
            const items = Array.isArray(result.items) ? result.items : [];
            setAssets((current) => append ? [...current, ...items] : items);
            const parsedNext = Number(result.nextPage);
            setNextPage(result.nextPage && Number.isInteger(parsedNext) ? parsedNext : null);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Immich images could not be loaded.");
        } finally {
            setLoading(false);
        }
    }, [albumId, query, search]);

    React.useEffect(() => {
        if (!open) return;
        void loadAssets();
        fetch("/admin/api/media/albums", { credentials: "same-origin", headers: { accept: "application/json" } })
            .then((response) => response.ok ? response.json() : { albums: [] })
            .then((result: unknown) => {
                const list = result && typeof result === "object" && "albums" in result
                    ? (result as { albums?: unknown }).albums
                    : [];
                setAlbums(Array.isArray(list) ? list as Album[] : []);
            })
            .catch(() => setAlbums([]));
    }, [open]);

    React.useEffect(() => {
        if (!open) return;
        const close = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !publishingId) setOpen(false);
        };
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    }, [open, publishingId]);

    const searchAssets = (event: FormEvent) => {
        event.preventDefault();
        void loadAssets();
    };

    const publish = async (asset: ImmichEditorAsset) => {
        setPublishingId(asset.id);
        setError("");
        try {
            const response = await fetch("/admin/api/media/publish", {
                method: "POST",
                credentials: "same-origin",
                headers: { accept: "application/json", "content-type": "application/json" },
                body: JSON.stringify({ assetId: asset.id }),
            });
            if (!response.ok) throw new Error(await responseMessage(response, "The image could not be published to R2."));
            const result = await response.json() as PublishedMediaResult;
            const url = getPublishedWebUrl(result);
            if (!url) throw new Error("R2 publication did not return a valid web image URL.");
            onSelect(url, asset);
            setOpen(false);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "The image could not be published to R2.");
        } finally {
            setPublishingId("");
        }
    };

    return (
        <>
            <button type="button" style={styles.button} onClick={() => setOpen(true)}>{buttonLabel}</button>
            {open && (
                <div style={styles.backdrop} role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !publishingId) setOpen(false);
                }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="immich-picker-title" style={styles.dialog}>
                        <header style={styles.header}>
                            <div>
                                <h2 id="immich-picker-title" style={styles.title}>Choose an Immich image</h2>
                                <p style={styles.help}>Selecting an image publishes or reuses its permanent website copy in R2.</p>
                            </div>
                            <button type="button" style={styles.close} onClick={() => setOpen(false)} disabled={Boolean(publishingId)}>Close</button>
                        </header>
                        <form style={styles.filters} onSubmit={searchAssets}>
                            <input style={styles.input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search images" aria-label="Search images" />
                            <select style={styles.input} value={search} onChange={(event) => setSearch(event.target.value as "smart" | "filename")} aria-label="Search type">
                                <option value="smart">Smart search</option>
                                <option value="filename">Filename</option>
                            </select>
                            <select style={styles.input} value={albumId} onChange={(event) => setAlbumId(event.target.value)} aria-label="Album">
                                <option value="">All images</option>
                                {albums.map((album) => <option key={album.id} value={album.id}>{album.albumName}{typeof album.assetCount === "number" ? ` (${album.assetCount})` : ""}</option>)}
                            </select>
                            <button type="submit" style={styles.secondary} disabled={loading || Boolean(publishingId)}>Search</button>
                        </form>
                        <div style={styles.body}>
                            {error && <p role="alert" style={styles.error}>{error}</p>}
                            {publishingId && <p style={styles.message}>Publishing permanent thumbnail and web copies to R2…</p>}
                            {!loading && !assets.length && !error && <p style={styles.message}>No matching images found.</p>}
                            <div style={styles.grid}>
                                {assets.map((asset) => (
                                    <button key={asset.id} type="button" style={styles.card} disabled={Boolean(publishingId)} onClick={() => void publish(asset)}>
                                        <img src={asset.previewUrl} alt="" style={styles.image} loading="lazy" />
                                        <span style={styles.cardText}>
                                            <strong>{asset.originalFileName}</strong><br />
                                            {[asset.width && asset.height ? `${asset.width} × ${asset.height}` : "", asset.fileCreatedAt ? new Date(asset.fileCreatedAt).toLocaleDateString() : ""].filter(Boolean).join(" · ")}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div style={styles.footer}>
                                {nextPage && <button type="button" style={styles.secondary} disabled={loading || Boolean(publishingId)} onClick={() => void loadAssets(nextPage, true)}>{loading ? "Loading…" : "Load more"}</button>}
                                {loading && !nextPage && <span style={styles.help}>Loading images…</span>}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
