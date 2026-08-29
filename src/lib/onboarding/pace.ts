export const MIN_PACE_S_PER_KM = 150;
export const MAX_PACE_S_PER_KM = 900;

/** `330` → `"5:30"` */
export function formatPace(secondsPerKm: number) {
  const minutes = Math.floor(secondsPerKm / 60);

  return `${minutes}:${String(secondsPerKm % 60).padStart(2, "0")}`;
}

/** `"5:30"`, `"5.30"` or `"5"` → `330`; anything else → `null`. */
export function parsePace(value: string) {
  const match = /^(\d{1,2})[:.]?(\d{2})?$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const seconds = Number(match[1]) * 60 + Number(match[2] ?? 0);

  return Number(match[2] ?? 0) < 60 ? seconds : null;
}
