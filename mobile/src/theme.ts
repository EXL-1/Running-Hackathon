/**
 * Peanut Butter brand tokens (dark palette — the app ships dark-first).
 *
 * Colour names come straight from the design brief; the light "Toast" palette
 * is kept alongside for the eventual light mode.
 */
export const palette = {
  peanutButter: "#E0A050",
  roast: "#7A4E1E",
  jam: "#9B2F4E",
  jamBright: "#E1567A",
  toast: "#1E140D",
  fresh: "#6FA45C",
} as const;

export const lightPalette = {
  peanutButter: "#C6862F",
  roast: "#7A4E1E",
  jam: "#9B2F4E",
  jamBright: "#C43F63",
  toast: "#F7EEDD",
  fresh: "#4C7A3F",
} as const;

export const theme = {
  background: palette.toast,
  card: "#271A11",
  cardRaised: "#2E2013",
  border: "#3B2A1B",
  text: "#F4E7D2",
  muted: "#B49A7C",
  primary: palette.jam,
  primaryText: "#FDF3E4",
  accent: palette.peanutButter,
  accentText: "#2A1A08",
  live: palette.jamBright,
  good: palette.fresh,
  danger: "#E1567A",
  radius: 20,
  radiusPill: 999,
} as const;

export const font = {
  display: "Baloo2_700Bold",
  displaySemi: "Baloo2_600SemiBold",
  body: "IBMPlexSans_400Regular",
  bodyMedium: "IBMPlexSans_500Medium",
  bodySemi: "IBMPlexSans_600SemiBold",
  data: "IBMPlexMono_400Regular",
  dataMedium: "IBMPlexMono_500Medium",
} as const;
