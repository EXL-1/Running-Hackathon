import "server-only";

import type { GoalInput } from "@/lib/onboarding/schemas";
import { createServiceClient } from "@/lib/supabase/server";

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
