import { NextRequest, NextResponse } from "next/server";
import { parseSpotifyUrl, getSpotifyPlaylist } from "@/lib/spotify";
import { parseAppleMusicUrl, getAppleMusicPlaylist } from "@/lib/apple-music";
import { searchYouTubeBatch, buildYouTubePlaylistUrl } from "@/lib/youtube";
import { ConversionResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const trimmed = url.trim();
    let playlistTitle: string;
    let tracks: { title: string; artist: string; album?: string }[];
    let source: "spotify" | "apple-music";

    // Detect platform
    const spotifyId = parseSpotifyUrl(trimmed);
    const appleMusicInfo = parseAppleMusicUrl(trimmed);

    if (spotifyId) {
      source = "spotify";
      const playlist = await getSpotifyPlaylist(spotifyId);
      playlistTitle = playlist.title;
      tracks = playlist.tracks;
    } else if (appleMusicInfo) {
      source = "apple-music";
      const playlist = await getAppleMusicPlaylist(
        appleMusicInfo.storefront,
        appleMusicInfo.id
      );
      playlistTitle = playlist.title;
      tracks = playlist.tracks;
    } else {
      return NextResponse.json(
        { error: "Unsupported URL. Please paste a Spotify or Apple Music playlist link." },
        { status: 400 }
      );
    }

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: "No tracks found in this playlist." },
        { status: 404 }
      );
    }

    const youtubeResults = await searchYouTubeBatch(tracks);
    const videoIds = youtubeResults
      .map((r) => r.videoId)
      .filter((id): id is string => id !== null);

    const result: ConversionResult = {
      playlistTitle,
      source,
      tracks: youtubeResults,
      youtubePlaylistUrl: buildYouTubePlaylistUrl(videoIds),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Conversion error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
