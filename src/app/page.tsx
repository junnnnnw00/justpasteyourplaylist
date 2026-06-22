"use client";

import { useState } from "react";
import { ConversionResult } from "@/lib/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleConvert() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't convert that link. Check it's a public playlist.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network hiccup. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result?.youtubePlaylistUrl) return;
    navigator.clipboard.writeText(result.youtubePlaylistUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const found = result?.tracks.filter((t) => t.videoId).length ?? 0;
  const total = result?.tracks.length ?? 0;

  return (
    <div className="min-h-screen flex flex-col font-sans text-ink selection:bg-ink selection:text-paper">
      <main className="w-full max-w-xl mx-auto flex-1 flex flex-col px-6 pt-10 pb-8">
        {/* Wordmark */}
        <header className="flex items-center gap-2.5">
          <svg viewBox="0 0 100 100" className="w-6 h-6 rounded-[7px] border border-hairline shrink-0" aria-hidden>
            <rect width="100" height="100" rx="23" fill="#faf9f6" />
            <rect x="36" y="26" width="28" height="6" rx="3" fill="#17181c" />
            <rect x="36" y="68" width="28" height="6" rx="3" fill="#17181c" />
            <rect x="47" y="26" width="6" height="48" fill="#17181c" />
          </svg>
          <span className="font-mono text-[13px] tracking-tight text-muted">
            justpasteyourplaylist<span className="caret text-ink">_</span>
          </span>
        </header>

        {/* Hero + paste field */}
        <section className="mt-16">
          <h1 className="text-[2rem] leading-[1.15] font-semibold tracking-tight">
            Paste a playlist link.
            <br />
            Get one for YouTube.
          </h1>

          <div className="mt-8">
            <div className="flex items-stretch border border-hairline rounded-lg bg-white overflow-hidden focus-within:border-ink transition-colors">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleConvert()}
                placeholder="https://open.spotify.com/playlist/…"
                aria-label="Playlist link"
                className="flex-1 min-w-0 bg-transparent px-4 py-3.5 font-mono text-sm placeholder:text-muted/60 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={handleConvert}
                disabled={loading || !url.trim()}
                className="px-5 bg-ink text-paper text-sm font-medium disabled:opacity-30 hover:bg-ink/90 transition-colors"
              >
                {loading ? "…" : "Convert"}
              </button>
            </div>
            <p className="mt-2.5 text-[13px] text-muted">
              Works with Spotify and Apple Music. No account, no app.
            </p>
            {error && <p className="mt-2.5 text-[13px] text-accent">{error}</p>}
          </div>
        </section>

        {/* Result */}
        {result && (
          <section className="mt-12 rise">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {result.source === "spotify" ? "Spotify" : "Apple Music"} → YouTube
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{result.playlistTitle}</h2>
            <p className="mt-1 font-mono text-[12px] text-muted">
              {found} of {total} tracks matched
            </p>

            {result.youtubePlaylistUrl && (
              <div className="mt-5 flex gap-2.5">
                <a
                  href={result.youtubePlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 rounded-lg bg-accent text-white text-sm font-medium hover:brightness-110 transition"
                >
                  Open in YouTube
                </a>
                <button
                  onClick={handleCopy}
                  className="px-5 py-3 rounded-lg border border-hairline text-sm font-medium text-ink hover:border-ink transition-colors"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            )}

            <ol className="mt-7 border-t border-hairline">
              {result.tracks.map((t, i) => {
                const inner = (
                  <>
                    <span className="font-mono text-[11px] text-muted w-6 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 min-w-0 truncate text-sm">
                      {t.track.title}
                      <span className="text-muted"> — {t.track.artist}</span>
                    </span>
                    {t.videoId ? (
                      <span className="shrink-0 text-muted text-sm group-hover:text-accent transition-colors">
                        ↗
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted/50">
                        no match
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={i} className="border-b border-hairline">
                    {t.videoId ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${t.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 py-2.5"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 py-2.5 opacity-50">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* Athens banner */}
        <a
          href="https://www.producthunt.com/products/athens"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-16 flex items-center gap-3.5 rounded-lg border border-hairline px-4 py-3.5 hover:border-ink/30 transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/athens-logo.png"
            alt="Athens"
            width={40}
            height={40}
            className="w-10 h-10 rounded-[9px] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Athens</p>
            <p className="text-[12.5px] text-muted truncate">Rate music head-to-head, build your taste.</p>
          </div>
          <span className="font-mono text-[11px] text-muted group-hover:text-ink transition-colors shrink-0">
            Product Hunt →
          </span>
        </a>

        <footer className="mt-auto pt-10 font-mono text-[11px] text-muted">
          <a
            href="https://github.com/junnnnnw00/justpasteyourplaylist"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            open source
          </a>
          {" · no keys · free"}
        </footer>
      </main>
    </div>
  );
}
