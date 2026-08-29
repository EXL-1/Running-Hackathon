export type GeoPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number | null;
};

export type TrackingSample = {
  point: GeoPoint;
  accepted: boolean;
  distanceMeters: number;
};

const EARTH_RADIUS_M = 6_371_000;

/** Points less accurate than this are ignored: they add phantom distance. */
export const MAX_ACCURACY_M = 30;

/** Movement below this is GPS noise while standing still. */
export const MIN_STEP_M = 3;

/** Faster than ~2:30/km over a single step means the fix jumped. */
export const MAX_SPEED_M_PER_S = 7;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function distanceMeters(from: GeoPoint, to: GeoPoint) {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Decides whether a new fix should count towards the run distance, filtering
 * out low-accuracy fixes, standing-still jitter and impossible jumps.
 */
export function evaluateSample(
  previous: GeoPoint | null,
  point: GeoPoint,
): TrackingSample {
  if (point.accuracy !== null && point.accuracy > MAX_ACCURACY_M) {
    return { point, accepted: false, distanceMeters: 0 };
  }

  if (!previous) {
    return { point, accepted: true, distanceMeters: 0 };
  }

  const distance = distanceMeters(previous, point);
  const elapsedSeconds = (point.timestamp - previous.timestamp) / 1000;

  if (distance < MIN_STEP_M) {
    return { point, accepted: false, distanceMeters: 0 };
  }

  if (elapsedSeconds > 0 && distance / elapsedSeconds > MAX_SPEED_M_PER_S) {
    return { point, accepted: false, distanceMeters: 0 };
  }

  return { point, accepted: true, distanceMeters: distance };
}

/** Seconds per kilometre, or null until there is enough distance to be useful. */
export function paceSecondsPerKm(distance: number, elapsedMs: number) {
  if (distance < MIN_STEP_M || elapsedMs <= 0) {
    return null;
  }

  return elapsedMs / 1000 / (distance / 1000);
}

export function formatPace(secondsPerKm: number | null) {
  if (secondsPerKm === null || !Number.isFinite(secondsPerKm)) {
    return "--:--";
  }

  const total = Math.round(secondsPerKm);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDuration(elapsedMs: number) {
  const total = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const tail = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return hours > 0 ? `${hours}:${tail}` : tail;
}

export function formatDistanceKm(distance: number) {
  return (distance / 1000).toFixed(2);
}
