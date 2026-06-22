import { Track } from "./types";

export function parseSpotifyUrl(url: string): string | null {
  const patterns = [
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    /spotify\.com\/.*\/playlist\/([a-zA-Z0-9]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface EmbedTrack {
  title: string;
  subtitle: string;
}

interface EmbedEntity {
  name: string;
  trackList: EmbedTrack[];
}

interface EmbedData {
  props?: {
    pageProps?: {
      state?: {
        data?: {
          entity?: EmbedEntity;
        };
      };
    };
  };
}

export async function getSpotifyPlaylist(
  playlistId: string
): Promise<{ title: string; tracks: Track[] }> {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;

  const res = await fetch(embedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Spotify playlist: ${res.status}`);
  }

  const html = await res.text();

  const nextDataMatch = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );

  if (!nextDataMatch) {
    throw new Error("Could not parse Spotify playlist page");
  }

  const data: EmbedData = JSON.parse(nextDataMatch[1]);
  const entity = data.props?.pageProps?.state?.data?.entity;

  if (!entity || !entity.trackList) {
    throw new Error("No tracks found in Spotify playlist");
  }

  const tracks: Track[] = entity.trackList.map((t) => ({
    title: t.title,
    artist: t.subtitle,
  }));

  return { title: entity.name, tracks };
}
