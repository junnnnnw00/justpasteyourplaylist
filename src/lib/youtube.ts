import YouTube from "youtube-sr";
import { Track, YouTubeResult } from "./types";

export async function searchYouTube(track: Track): Promise<YouTubeResult> {
  const query = `${track.title} ${track.artist}`;

  try {
    const results = await YouTube.search(query, { limit: 1, type: "video" });

    if (results.length > 0 && results[0].id) {
      return {
        track,
        videoId: results[0].id,
        videoTitle: results[0].title || null,
      };
    }
  } catch (e) {
    console.error(`YouTube search failed for "${query}":`, e);
  }

  return { track, videoId: null, videoTitle: null };
}

export async function searchYouTubeBatch(
  tracks: Track[]
): Promise<YouTubeResult[]> {
  const BATCH_SIZE = 3;
  const results: YouTubeResult[] = [];

  for (let i = 0; i < tracks.length; i += BATCH_SIZE) {
    const batch = tracks.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(searchYouTube));
    results.push(...batchResults);
  }

  return results;
}

export function buildYouTubePlaylistUrl(videoIds: string[]): string | null {
  const validIds = videoIds.filter(Boolean);
  if (validIds.length === 0) return null;
  return `https://www.youtube.com/watch_videos?video_ids=${validIds.join(",")}`;
}
