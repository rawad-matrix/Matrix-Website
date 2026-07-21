// Accepts any common YouTube URL shape an admin might paste — watch, youtu.be,
// shorts, or an already-correct /embed/ link — and normalizes it to the
// /embed/VIDEO_ID form required to load inside an <iframe>. YouTube refuses
// to frame watch/shorts URLs directly ("This content is blocked").
export function toYouTubeEmbedUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed

  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const re of patterns) {
    const match = trimmed.match(re)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }

  // Not a recognized YouTube link (e.g. Vimeo) — pass through unchanged.
  return trimmed
}
