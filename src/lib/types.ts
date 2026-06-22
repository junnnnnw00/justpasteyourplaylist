export interface Track {
  title: string;
  artist: string;
  album?: string;
}

export interface YouTubeResult {
  track: Track;
  videoId: string | null;
  videoTitle: string | null;
}

export interface ConversionResult {
  playlistTitle: string;
  source: "spotify" | "apple-music";
  tracks: YouTubeResult[];
  youtubePlaylistUrl: string | null;
}
