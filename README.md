# Just Paste Your Playlist

> Paste a Spotify or Apple Music playlist link → get a YouTube playlist you can share with anyone.

**[justpasteyourplaylist.vercel.app](https://justpasteyourplaylist.vercel.app)**

Your friends shouldn't need a subscription to hear your playlist. This converts any Spotify or Apple Music playlist into a YouTube playlist — free, instant, no sign-up.

YouTube is the one platform everyone can access for free. That's the whole idea.

## How It Works

1. Paste a Spotify or Apple Music playlist URL
2. The app fetches every track and finds it on YouTube
3. Get a single YouTube link with all your songs — share it anywhere

## Contributing

We're building this as a community. The site is live and open — your contributions ship to real users.

### Getting Started

No API keys needed. Clone and run:

```bash
git clone https://github.com/junnnnnw00/justpasteyourplaylist.git
cd justpasteyourplaylist
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). That's it.

### What We Need Help With

**Platform Support**
- [ ] Tidal playlist support
- [ ] Amazon Music playlist support
- [ ] SoundCloud playlist support
- [ ] Deezer playlist support

**Core Features**
- [ ] Progress indicator during conversion (track-by-track)
- [ ] Playlist caching — don't re-search tracks we've already found
- [ ] Better YouTube matching algorithm (title similarity scoring)
- [ ] Handle large playlists (500+ tracks) gracefully with streaming

**UX**
- [ ] Dark/light mode toggle
- [ ] Mobile-responsive polish
- [ ] Copy individual YouTube links per track
- [ ] Drag-and-drop reorder before generating playlist
- [ ] Share button with native share API
- [ ] Playlist preview with album art

**Reliability**
- [ ] Apple Music parsing is fragile — needs a more robust extraction method
- [ ] Fallback search when youtube-sr fails
- [ ] Rate limiting to prevent abuse
- [ ] Error tracking and monitoring

**Infra**
- [ ] Tests — unit tests for URL parsing, integration tests for API
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Analytics (privacy-respecting)

### Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main UI — paste input, results display
│   ├── layout.tsx        # Root layout, metadata, OG tags
│   ├── globals.css       # Tailwind imports
│   └── api/
│       └── convert/
│           └── route.ts  # POST /api/convert — orchestrates the conversion
└── lib/
    ├── types.ts          # Shared TypeScript types
    ├── spotify.ts        # Spotify embed page parsing
    ├── apple-music.ts    # Apple Music HTML parsing
    └── youtube.ts        # YouTube search via youtube-sr (no API key)
```

### Guidelines

- **Keep it simple.** This is a single-purpose tool. Features should serve the core flow: paste → convert → share.
- **No accounts.** No sign-up, no login. The app works instantly.
- **No API keys. Period.** We use scraping for everything — Spotify embeds, Apple Music pages, youtube-sr. No developer accounts, no quotas, no costs. Keep it that way.
- **TypeScript only.** All code is strictly typed.
- **Test your changes.** Run `npm run build` before submitting a PR.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Spotify | Embed page parsing (no API key) |
| Apple Music | Public page parsing (no API key) |
| YouTube | youtube-sr scraping (no API key) |
| Hosting | Vercel |

### Running Checks

```bash
npm run dev      # local development
npm run build    # production build + type check
npm run lint     # ESLint
```

## Cost

**$0. Zero API keys.** Everything uses public page scraping — no Spotify developer account, no YouTube API key, no Apple Music token. Just clone and run. Vercel hosting is free tier.

## License

[MIT](LICENSE)
