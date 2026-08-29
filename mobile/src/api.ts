import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { CoachId } from "@shared/voices";

/**
 * The Next.js app is the only thing that talks to Supabase and ElevenLabs, so
 * every key stays on the server. Point EXPO_PUBLIC_API_URL at the deployed app
 * (or your machine's LAN address in dev — a phone can't reach the host's
 * localhost).
 */
export const apiBaseUrl = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export type Player = {
  id: string;
  username: string;
  displayName: string | null;
  goalKind: "increase_pace" | "target_pace" | null;
  targetPaceSPerKm: number | null;
  promptFrequency: number | null;
  coachVoiceId: CoachId | null;
  onboardingCompletedAt: string | null;
};

export type BaselineAnswer = "faster" | "slower" | "on-target";

export type Run = {
  id: string;
  mode: "chase" | "cheer";
  distanceM: number;
  durationS: number;
  points: number;
  startedAt: string;
  coachVoiceId: CoachId | null;
  baseline: BaselineAnswer | null;
  avgPaceSPerKm: number | null;
};

export type RunStats = {
  runs: Run[];
  runCount: number;
  totalPoints: number;
  personalBest: Run | null;
};

export type PlayerPatch = {
  goalKind?: "increase_pace" | "target_pace";
  targetPaceSPerKm?: number;
  promptFrequency?: number;
  coachVoiceId?: CoachId;
  onboardingCompleted?: true;
};

export type NewRun = {
  mode: "chase" | "cheer";
  distanceM: number;
  durationS: number;
  startedAt?: string;
  coachVoiceId?: CoachId;
  baseline?: BaselineAnswer;
};

/**
 * There is no login: a username is claimed once and the signed token the server
 * hands back identifies the player from then on. SecureStore is native-only, so
 * the web build keeps the token in memory for the session.
 */
const TOKEN_KEY = "runaway_player_token";

const secureStorable = Platform.OS !== "web";

let token: string | null = null;

export async function loadStoredToken() {
  if (!secureStorable) {
    return token;
  }

  token = await SecureStore.getItemAsync(TOKEN_KEY);

  return token;
}

async function storeToken(value: string) {
  token = value;

  if (secureStorable) {
    await SecureStore.setItemAsync(TOKEN_KEY, value);
  }
}

export async function forgetToken() {
  token = null;

  if (secureStorable) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, `Can't reach ${apiBaseUrl}.`);
  }

  const body = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error ?? `Request failed (${response.status}).`,
    );
  }

  if (!body) {
    throw new ApiError(response.status, "Unreadable response.");
  }

  return body;
}

/** Claims the username, storing the token every later call is signed with. */
export async function claimUsername(username: string) {
  const result = await request<{ token: string; player: Player }>(
    "/api/auth/session",
    { method: "POST", body: JSON.stringify({ username }) },
  );

  await storeToken(result.token);

  return result.player;
}

export async function fetchPlayer() {
  const { player } = await request<{ player: Player }>("/api/players/me");

  return player;
}

export async function updatePlayer(patch: PlayerPatch) {
  const { player } = await request<{ player: Player }>("/api/players/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

  return player;
}

export async function fetchRunStats(limit?: number) {
  return request<RunStats>(
    `/api/runs${limit === undefined ? "" : `?limit=${limit}`}`,
  );
}

export async function saveRun(run: NewRun) {
  return request<{ run: Run } & Omit<RunStats, "runs">>("/api/runs", {
    method: "POST",
    body: JSON.stringify(run),
  });
}
