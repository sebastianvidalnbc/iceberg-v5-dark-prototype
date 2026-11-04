// Sample artwork and copy used to make new widgets look like a live page. Files
// live in public/widget-art/ (generated placeholder SVGs, not licensed imagery).
// Asset fields store the bare file name (e.g. "poster-1.svg"); `widgetArtUrl`
// resolves it under the app base so both the editor and the renderer can use it.

export const POSTERS = Array.from({ length: 8 }, (_, i) => `poster-${i + 1}.svg`);
export const BACKDROPS = Array.from({ length: 4 }, (_, i) => `backdrop-${i + 1}.svg`);
export const LOGOS = Array.from({ length: 6 }, (_, i) => `logo-${i + 1}.svg`);

// Fictional programme titles, so sample rails never reuse real IP.
export const SHOW_TITLES = [
  "Harbor Lights",
  "The Long Season",
  "Night Shift",
  "Field Notes",
  "Ember Falls",
  "Summer Court",
  "Lowtide",
  "City of Glass",
];

export const LOGO_NAMES = [
  "Northline FC",
  "Metro Hoops",
  "Harbor Rugby",
  "Summit Motorsport",
  "Coastal Tennis",
  "Bluefield Golf",
];

export const SHOW_META = [
  "Drama · 2026 · 8 episodes",
  "Sports doc · 2025 · 6 episodes",
  "Comedy · 2026 · 10 episodes",
  "Thriller · 2024 · 1 season",
  "Reality · 2026 · 12 episodes",
  "Movie · 2025 · 1h 52m",
  "Documentary · 2026 · 4 episodes",
  "Drama · 2025 · 3 seasons",
];

const BASE = import.meta.env.BASE_URL;

export function widgetArtUrl(value: string): string {
  if (/^(https?:|\/|data:)/.test(value)) return value;
  return `${BASE}widget-art/${value}`;
}

export function isArtFile(value: string): boolean {
  return /\.svg$/i.test(value.trim());
}
