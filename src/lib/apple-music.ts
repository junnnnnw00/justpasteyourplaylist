import { Track } from "./types";

export function parseAppleMusicUrl(url: string): { storefront: string; id: string } | null {
  const match = url.match(
    /music\.apple\.com\/([a-z]{2})\/playlist\/[^/]+\/(pl\.[a-zA-Z0-9\-]+)/
  );
  if (match) {
    return { storefront: match[1], id: match[2] };
  }
  return null;
}

export async function getAppleMusicPlaylist(
  storefront: string,
  playlistId: string
): Promise<{ title: string; tracks: Track[] }> {
  const pageUrl = `https://music.apple.com/${storefront}/playlist/-/${playlistId}`;

  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Apple Music playlist: ${res.status}`);
  }

  const html = await res.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  let title = "Apple Music Playlist";
  if (titleMatch) {
    title = titleMatch[1]
      .replace(/ - Playlist - Apple Music$/, "")
      .replace(/ on Apple Music$/, "")
      .trim();
  }

  const tracks: Track[] = [];

  // Extract from impression metrics: "artistName":"X"..."name":"Y"
  const pattern = /"artistName":"([^"]+)","impressionMetrics":\{[^}]*"id":\{[^}]*\},"fields":\{[^}]*"name":"([^"]+)"/g;
  let match2;
  while ((match2 = pattern.exec(html)) !== null) {
    tracks.push({
      title: match2[2],
      artist: match2[1],
    });
  }

  if (tracks.length === 0) {
    // Fallback: try to find artistName and name separately with kind:"song"
    const songPattern = /"kind":"song"[^}]*"name":"([^"]+)"/g;
    const artistPattern = /"artistName":"([^"]+)"/g;

    const names: string[] = [];
    const artists: string[] = [];

    let m;
    while ((m = songPattern.exec(html)) !== null) names.push(m[1]);
    while ((m = artistPattern.exec(html)) !== null) artists.push(m[1]);

    const count = Math.min(names.length, artists.length);
    for (let i = 0; i < count; i++) {
      tracks.push({ title: names[i], artist: artists[i] });
    }
  }

  if (tracks.length === 0) {
    throw new Error(
      "Could not extract tracks from Apple Music playlist. The playlist may be private or the page structure may have changed."
    );
  }

  return { title, tracks };
}
