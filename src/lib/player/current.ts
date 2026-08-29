import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { nextOnboardingStep } from "@/lib/onboarding/steps";
import { readPlayerId } from "@/lib/player/session";
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

/**
 * The single place that answers "who is making this request?".
 *
 * Today that is a username kept in a signed cookie. To move to real accounts,
 * resolve the Supabase Auth user here (and look the player up by
 * `players.auth_user_id`) — every caller keeps working unchanged.
 */
export const getCurrentPlayer = cache(async (): Promise<Player | null> => {
  const playerId = await readPlayerId();

  if (!playerId) {
    return null;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("players")
    .select(
      "id, username, display_name, goal_kind, target_pace_s_per_km, prompt_frequency, onboarding_completed_at",
    )
    .eq("id", playerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    goalKind: data.goal_kind,
    targetPaceSPerKm: data.target_pace_s_per_km,
    promptFrequency: data.prompt_frequency,
    onboardingCompletedAt: data.onboarding_completed_at,
  };
});

export async function requirePlayer(): Promise<Player> {
  const player = await getCurrentPlayer();

  if (!player) {
    redirect("/start");
  }

  return player;
}

/**
 * Like `requirePlayer()`, but also sends players who signed up without
 * finishing setup back to the step they stopped at.
 */
export async function requireOnboardedPlayer(): Promise<Player> {
  const player = await requirePlayer();
  const step = nextOnboardingStep(player);

  if (step) {
    redirect(step.href);
  }

  return player;
}
