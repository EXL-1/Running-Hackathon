import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { readPlayerId } from "@/lib/player/session";
import { createServiceClient } from "@/lib/supabase/server";

export type Player = {
  id: string;
  username: string;
  displayName: string | null;
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
    .select("id, username, display_name")
    .eq("id", playerId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
  };
});

export async function requirePlayer(): Promise<Player> {
  const player = await getCurrentPlayer();

  if (!player) {
    redirect("/start");
  }

  return player;
}
