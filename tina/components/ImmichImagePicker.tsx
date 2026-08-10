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
    previewUrl?: string | null;
}

interface AssetPage {
    items?: ImmichEditorAsset[];
    nextPage?: number | string | null;
}

interface ImmichImagePickerProps {
    onSelect: (url: string, asset: ImmichEditorAsset) => void;
    buttonLabel?: string;
    compact?: boolean;
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
        display: "grid", gridTemplateColumns: "minmax(12rem, 1fr) auto auto",
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
    navigation: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 14 },
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
    albumCard: {
        display: "grid", gridTemplateRows: "112px auto", minWidth: 0, padding: 0,
        overflow: "hidden", border: "1px solid #cbd5e1", borderRadius: 8,
        background: "#f8fafc", color: "#172033", cursor: "pointer", textAlign: "left",
    },
    albumImage: { display: "block", width: "100%", height: 112, objectFit: "cover", background: "#e2e8f0" },
    albumPlaceholder: {
        display: "grid", placeItems: "center", width: "100%", height: 112,
        background: "#e2e8f0", color: "#64748b", fontSize: 28,
    },
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

export default function ImmichImagePicker({ onSelect, buttonLabel = "Choose from Immich", compact = false }: ImmichImagePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState<"photos" | "albums">("photos");
    const [assets, setAssets] = React.useState<ImmichEditorAsset[]>([]);
    const [albums, setAlbums] = React.useState<Album[]>([]);
    const [query, setQuery] = React.useState("");
    const [search, setSearch] = React.useState<"smart" | "filename">("smart");
    const [albumId, setAlbumId] = React.useState("");
    const [albumName, setAlbumName] = React.useState("");
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
        if (!open || view !== "photos") return;
        void loadAssets();
    }, [open, view, albumId]);

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

    const openAlbum = (album: Album) => {
        setQuery("");
        setAlbumId(album.id);
        setAlbumName(album.albumName);
        setView("photos");
    };

    const showAllPhotos = () => {
        setQuery("");
        setAlbumId("");
        setAlbumName("");
        setView("photos");
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
            <button
                type="button"
                className={compact ? "immich-picker-trigger immich-picker-trigger--compact" : "immich-picker-trigger"}
                style={{ ...styles.button, ...(compact ? { width: 34, height: 34, padding: 0, display: "grid", placeItems: "center", fontSize: 16 } : {}) }}
                onClick={() => setOpen(true)}
                aria-label={buttonLabel}
                title={compact ? buttonLabel : undefined}
            >{compact ? "▧" : buttonLabel}</button>
            {open && (
                <div className="immich-picker-backdrop" style={styles.backdrop} role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !publishingId) setOpen(false);
                }}>
                    <section className="immich-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="immich-picker-title" style={styles.dialog}>
                        <header className="immich-picker-header" style={styles.header}>
                            <div>
                                <h2 id="immich-picker-title" style={styles.title}>Choose an Immich image</h2>
                                <p style={styles.help}>Selecting an image publishes or reuses its permanent website copy in R2.</p>
                            </div>
                            <button type="button" style={styles.close} onClick={() => setOpen(false)} disabled={Boolean(publishingId)}>Close</button>
                        </header>
                        {view === "photos" && <form className="immich-picker-filters" style={styles.filters} onSubmit={searchAssets}>
                            <input style={styles.input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search images" aria-label="Search images" />
                            <select style={styles.input} value={search} onChange={(event) => setSearch(event.target.value as "smart" | "filename")} aria-label="Search type">
                                <option value="smart">Smart search</option>
                                <option value="filename">Filename</option>
                            </select>
                            <button type="submit" style={styles.secondary} disabled={loading || Boolean(publishingId)}>Search</button>
                        </form>}
                        <div className="immich-picker-body" style={styles.body}>
                            <nav style={styles.navigation} aria-label="Immich library">
                                <button type="button" style={view === "albums" ? styles.secondary : styles.close} onClick={() => setView("albums")}>Albums</button>
                                <button type="button" style={view === "photos" && !albumId ? styles.secondary : styles.close} onClick={showAllPhotos}>All photos</button>
                                {albumId && <strong style={styles.help}>Album: {albumName}</strong>}
                            </nav>
                            {error && <p role="alert" style={styles.error}>{error}</p>}
                            {publishingId && <p style={styles.message}>Publishing permanent thumbnail and web copies to R2…</p>}
                            {view === "albums" && !albums.length && <p style={styles.message}>No albums found.</p>}
                            {view === "albums" && <div className="immich-picker-album-grid" style={styles.grid}>
                                {albums.map((album) => (
                                    <button key={album.id} type="button" style={styles.albumCard} onClick={() => openAlbum(album)}>
                                        {album.previewUrl
                                            ? <img src={album.previewUrl} alt="" style={styles.albumImage} loading="lazy" />
                                            : <span style={styles.albumPlaceholder} aria-hidden="true">▧</span>}
                                        <span style={styles.cardText}>
                                            <strong>{album.albumName}</strong><br />
                                            {typeof album.assetCount === "number" ? `${album.assetCount} photo${album.assetCount === 1 ? "" : "s"}` : "Open album"}
                                        </span>
                                    </button>
                                ))}
                            </div>}
                            {view === "photos" && !loading && !assets.length && !error && <p style={styles.message}>No matching images found.</p>}
                            {view === "photos" && <div className="immich-picker-asset-grid" style={styles.grid}>
                                {assets.map((asset) => (
                                    <button key={asset.id} type="button" style={styles.card} disabled={Boolean(publishingId)} onClick={() => void publish(asset)}>
                                        <img src={asset.previewUrl} alt="" style={styles.image} loading="lazy" />
                                        <span style={styles.cardText}>
                                            <strong>{asset.originalFileName}</strong><br />
                                            {[asset.width && asset.height ? `${asset.width} × ${asset.height}` : "", asset.fileCreatedAt ? new Date(asset.fileCreatedAt).toLocaleDateString() : ""].filter(Boolean).join(" · ")}
                                        </span>
                                    </button>
                                ))}
                            </div>}
                            {view === "photos" && <div style={styles.footer}>
                                {nextPage && <button type="button" style={styles.secondary} disabled={loading || Boolean(publishingId)} onClick={() => void loadAssets(nextPage, true)}>{loading ? "Loading…" : "Load more"}</button>}
                                {loading && !nextPage && <span style={styles.help}>Loading images…</span>}
                            </div>}
                        </div>
                    </section>
                </div>
            )}
            <style>{`
                @media (max-width: 640px) {
                    .immich-picker-backdrop { padding: 0 !important; place-items: stretch !important; }
                    .immich-picker-dialog {
                        width: 100vw !important; height: 100dvh !important; max-height: none !important;
                        border-radius: 0 !important;
                    }
                    .immich-picker-header { padding: 14px 12px 10px !important; }
                    .immich-picker-header h2 { font-size: 18px !important; }
                    .immich-picker-header p { display: none; }
                    .immich-picker-filters { grid-template-columns: minmax(0, 1fr) !important; padding: 10px 12px !important; }
                    .immich-picker-filters input,
                    .immich-picker-filters select,
                    .immich-picker-filters button { min-height: 44px; width: 100%; }
                    .immich-picker-body { padding: 12px !important; }
                    .immich-picker-asset-grid,
                    .immich-picker-album-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 8px !important; }
                    .immich-picker-asset-grid button { grid-template-rows: 104px auto !important; }
                    .immich-picker-asset-grid img { height: 104px !important; }
                }
                @media (max-width: 360px) {
                    .immich-picker-asset-grid,
                    .immich-picker-album-grid { grid-template-columns: minmax(0, 1fr) !important; }
                }
            `}</style>
        </>
    );
}
