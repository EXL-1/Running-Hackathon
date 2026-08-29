import "server-only";

import type { GoalKind } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/server";

export type Player = {
  id: string;
  username: string;
  displayName: string | null;
  goalKind: GoalKind | null;
  targetPaceSPerKm: number | null;
  promptFrequency: number | null;
  onboardingCompletedAt: string | null;
};

type PlayerRow = {
  id: string;
  username: string;
  display_name: string | null;
  goal_kind: GoalKind | null;
  target_pace_s_per_km: number | null;
  prompt_frequency: number | null;
  onboarding_completed_at: string | null;
};

export const PLAYER_COLUMNS =
  "id, username, display_name, goal_kind, target_pace_s_per_km, prompt_frequency, onboarding_completed_at";

export function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    goalKind: row.goal_kind,
    targetPaceSPerKm: row.target_pace_s_per_km,
    promptFrequency: row.prompt_frequency,
    onboardingCompletedAt: row.onboarding_completed_at,
  };
}

export async function findPlayer(playerId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("players")
    .select(PLAYER_COLUMNS)
    .eq("id", playerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? toPlayer(data) : null;
}

/**
 * Creates the player on first use of a username and reuses the same row
 * afterwards. There is no secret involved yet, so a username is a handle rather
 * than an account: anyone who types it becomes that player.
 */
export async function claimPlayer(username: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("players")
    .upsert(
      { username, last_seen_at: new Date().toISOString() },
      { onConflict: "username" },
    )
    .select(PLAYER_COLUMNS)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not claim that username.");
  }

  return toPlayer(data);
}
