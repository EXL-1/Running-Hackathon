import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  evaluateSample,
  paceSecondsPerKm,
  type GeoPoint,
} from "@shared/tracking";

export type TrackerStatus = "idle" | "requesting" | "running" | "stopped";

export type TrackerState = {
  status: TrackerStatus;
  distanceMeters: number;
  elapsedMs: number;
  paceSecondsPerKm: number | null;
  currentPaceSecondsPerKm: number | null;
  accuracyMeters: number | null;
  fixCount: number;
  error: string | null;
};

const INITIAL_STATE: TrackerState = {
  status: "idle",
  distanceMeters: 0,
  elapsedMs: 0,
  paceSecondsPerKm: null,
  currentPaceSecondsPerKm: null,
  accuracyMeters: null,
  fixCount: 0,
  error: null,
};

function toGeoPoint(location: Location.LocationObject): GeoPoint {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp,
    accuracy: location.coords.accuracy ?? null,
  };
}

/**
 * Foreground-only GPS session used to validate tracking. Nothing is persisted:
 * every value lives in memory and is thrown away when the session is reset.
 */
export function useRunTracker() {
  const [state, setState] = useState<TrackerState>(INITIAL_STATE);

  const subscription = useRef<Location.LocationSubscription | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number | null>(null);
  const lastPoint = useRef<GeoPoint | null>(null);
  const distance = useRef(0);

  const teardown = useCallback(() => {
    subscription.current?.remove();
    subscription.current = null;

    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
  }, []);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(async () => {
    teardown();
    startedAt.current = null;
    lastPoint.current = null;
    distance.current = 0;
    setState({ ...INITIAL_STATE, status: "requesting" });

    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      setState({
        ...INITIAL_STATE,
        status: "idle",
        error: permission.canAskAgain
          ? "Location permission denied. Tap start and allow location to track a run."
          : "Location permission is blocked. Enable it for Expo Go in system settings.",
      });

      return;
    }

    const services = await Location.hasServicesEnabledAsync();

    if (!services) {
      setState({
        ...INITIAL_STATE,
        status: "idle",
        error: "Location services are switched off on this device.",
      });

      return;
    }

    startedAt.current = Date.now();
    setState({ ...INITIAL_STATE, status: "running" });

    ticker.current = setInterval(() => {
      setState((current) => {
        if (current.status !== "running" || startedAt.current === null) {
          return current;
        }

        const elapsedMs = Date.now() - startedAt.current;

        return {
          ...current,
          elapsedMs,
          paceSecondsPerKm: paceSecondsPerKm(current.distanceMeters, elapsedMs),
        };
      });
    }, 1000);

    try {
      subscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 0,
          timeInterval: 1000,
        },
        (location) => {
          const sample = evaluateSample(lastPoint.current, toGeoPoint(location));

          if (sample.accepted) {
            lastPoint.current = sample.point;
            distance.current += sample.distanceMeters;
          }

          setState((current) => {
            const elapsedMs =
              startedAt.current === null ? 0 : Date.now() - startedAt.current;

            return {
              ...current,
              distanceMeters: distance.current,
              elapsedMs,
              paceSecondsPerKm: paceSecondsPerKm(distance.current, elapsedMs),
              currentPaceSecondsPerKm:
                location.coords.speed && location.coords.speed > 0.3
                  ? 1000 / location.coords.speed
                  : null,
              accuracyMeters: location.coords.accuracy ?? null,
              fixCount: current.fixCount + 1,
            };
          });
        },
        (reason) => setState((current) => ({ ...current, error: reason })),
      );
    } catch {
      teardown();
      setState({
        ...INITIAL_STATE,
        status: "idle",
        error: "Could not start GPS tracking on this device.",
      });
    }
  }, [teardown]);

  const stop = useCallback(() => {
    teardown();
    setState((current) => ({
      ...current,
      status: current.status === "running" ? "stopped" : current.status,
      currentPaceSecondsPerKm: null,
    }));
  }, [teardown]);

  const reset = useCallback(() => {
    teardown();
    startedAt.current = null;
    lastPoint.current = null;
    distance.current = 0;
    setState(INITIAL_STATE);
  }, [teardown]);

  return { ...state, start, stop, reset };
}
