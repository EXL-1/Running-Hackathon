import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { nextOnboardingStep } from "@/lib/onboarding/steps";
import { readPlayerId } from "@/lib/player/session";
import { findPlayer, type Player } from "@/lib/player/service";

export type { Player };

/**
 * The single place that answers "who is making this request?".
 *
 * Today that is a username kept in a signed cookie (browser) or bearer token
 * (native app). To move to real accounts, resolve the Supabase Auth user here
 * (and look the player up by `players.auth_user_id`) — every caller keeps
 * working unchanged.
 */
export const getCurrentPlayer = cache(async (): Promise<Player | null> => {
  const playerId = await readPlayerId();

  return playerId ? findPlayer(playerId) : null;
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
