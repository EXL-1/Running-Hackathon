"use server";

import { redirect } from "next/navigation";
import * as z from "zod";

import { nextOnboardingStep } from "@/lib/onboarding/steps";
import { claimUsernameSchema, type FormState } from "@/lib/player/schemas";
import { claimPlayer } from "@/lib/player/service";
import { clearPlayerSession, writePlayerSession } from "@/lib/player/session";

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

  let player;

  try {
    player = await claimPlayer(parsed.data.username);
  } catch {
    return { message: "Could not save that username. Try again." };
  }

  await writePlayerSession(player.id);

  redirect(nextOnboardingStep(player)?.href ?? "/dashboard");
}

export async function switchPlayer() {
  await clearPlayerSession();
  redirect("/start");
}
