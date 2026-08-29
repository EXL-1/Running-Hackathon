"use server";

import { redirect } from "next/navigation";
import * as z from "zod";

import { claimUsernameSchema, type FormState } from "@/lib/player/schemas";
import { clearPlayerSession, writePlayerSession } from "@/lib/player/session";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Claims a username, creating the player on first use and reusing the same row
 * afterwards. There is no secret involved yet, so a username is a handle rather
 * than an account: anyone who types it becomes that player.
 */
export async function claimUsername(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = claimUsernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("players")
    .upsert(
      { username: parsed.data.username, last_seen_at: new Date().toISOString() },
      { onConflict: "username" },
    )
    .select("id")
    .single();

  if (error || !data) {
    return { message: "Could not save that username. Try again." };
  }

  await writePlayerSession(data.id);
  redirect("/dashboard");
}

export async function switchPlayer() {
  await clearPlayerSession();
  redirect("/start");
}
