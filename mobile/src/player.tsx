import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CoachId } from "@shared/voices";
import {
  ApiError,
  claimUsername,
  fetchPlayer,
  fetchRunStats,
  forgetToken,
  loadStoredToken,
  saveRun,
  updatePlayer,
  type NewRun,
  type Player,
  type PlayerPatch,
  type RunStats,
} from "./api";

type PlayerState = {
  /** `loading` until the stored token is checked, then a player or not. */
  status: "loading" | "signed-out" | "ready";
  player: Player | null;
  stats: RunStats | null;
  error: string | null;
  claim: (username: string) => Promise<void>;
  patch: (patch: PlayerPatch) => Promise<void>;
  chooseCoach: (coach: CoachId) => Promise<void>;
  finishRun: (run: NewRun) => Promise<void>;
  refresh: () => Promise<void>;
};

const PlayerContext = createContext<PlayerState | null>(null);

function messageFor(error: unknown) {
  return error instanceof ApiError ? error.message : "Something went wrong.";
}

/**
 * The player behind the username, and their runs. Everything the app persists
 * goes through here so a screen never talks to the API directly.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PlayerState["status"]>("loading");
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<RunStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setStats(await fetchRunStats());
    } catch {
      // Home falls back to "no runs yet" rather than blocking the run flow.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const token = await loadStoredToken();

      if (!token) {
        if (!cancelled) {
          setStatus("signed-out");
        }

        return;
      }

      try {
        const restored = await fetchPlayer();

        if (cancelled) {
          return;
        }

        setPlayer(restored);
        setStatus("ready");
        void loadStats();
      } catch (cause) {
        if (cancelled) {
          return;
        }

        // A token the server no longer accepts is worse than none at all.
        if (cause instanceof ApiError && cause.status === 401) {
          await forgetToken();
        }

        setStatus("signed-out");
        setError(messageFor(cause));
      }
    }

    void restore();

    return () => {
      cancelled = true;
    };
  }, [loadStats]);

  const claim = useCallback(
    async (username: string) => {
      setError(null);
      setPlayer(await claimUsername(username));
      setStatus("ready");
      await loadStats();
    },
    [loadStats],
  );

  const patch = useCallback(async (update: PlayerPatch) => {
    setPlayer(await updatePlayer(update));
  }, []);

  const chooseCoach = useCallback(
    async (coach: CoachId) => {
      // The choice is kept even if the write fails; the next patch retries it.
      setPlayer((current) =>
        current ? { ...current, coachVoiceId: coach } : current,
      );

      try {
        setPlayer(await updatePlayer({ coachVoiceId: coach }));
      } catch (cause) {
        setError(messageFor(cause));
      }
    },
    [],
  );

  const finishRun = useCallback(async (run: NewRun) => {
    const { run: saved, ...totals } = await saveRun(run);

    setStats((current) => ({
      runs: [saved, ...(current?.runs ?? [])],
      ...totals,
    }));
  }, []);

  const value = useMemo<PlayerState>(
    () => ({
      status,
      player,
      stats,
      error,
      claim,
      patch,
      chooseCoach,
      finishRun,
      refresh: loadStats,
    }),
    [chooseCoach, claim, error, finishRun, loadStats, patch, player, stats, status],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const value = useContext(PlayerContext);

  if (!value) {
    throw new Error("usePlayer must be used inside a PlayerProvider.");
  }

  return value;
}
