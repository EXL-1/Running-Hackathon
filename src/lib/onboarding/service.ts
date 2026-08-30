import "server-only";

import type {
  GoalInput,
  PlayerOnboardingPatch,
} from "@/lib/onboarding/schemas";
import { PLAYER_COLUMNS, toPlayer } from "@/lib/player/service";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Applies a partial onboarding update in one round trip and returns the player
 * as it now stands, so a native client never has to re-fetch to know where it
 * is in the flow.
 */
export async function applyOnboardingPatch(
  playerId: string,
  patch: PlayerOnboardingPatch,
) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("players")
    .update({
      ...(patch.goalKind !== undefined ? { goal_kind: patch.goalKind } : {}),
      ...(patch.targetPaceSPerKm !== undefined
        ? { target_pace_s_per_km: patch.targetPaceSPerKm }
        : {}),
      ...(patch.promptFrequency !== undefined
        ? { prompt_frequency: patch.promptFrequency }
        : {}),
      ...(patch.coachVoiceId !== undefined
        ? { coach_voice_id: patch.coachVoiceId }
        : {}),
      ...(patch.onboardingCompleted
        ? { onboarding_completed_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", playerId)
    .select(PLAYER_COLUMNS)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not save that setting.");
  }

  return toPlayer(data);
}

export async function saveGoal(playerId: string, goal: GoalInput) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("players")
    .update({
      goal_kind: goal.goalKind,
      target_pace_s_per_km: goal.targetPaceSPerKm,
    })
    .eq("id", playerId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function savePromptFrequency(
  playerId: string,
  promptFrequency: number,
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("players")
    .update({ prompt_frequency: promptFrequency })
    .eq("id", playerId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeOnboarding(playerId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("players")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", playerId);

  if (error) {
    throw new Error(error.message);
  }
}
