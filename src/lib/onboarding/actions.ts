"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";

import { goalSchema, promptFrequencySchema } from "@/lib/onboarding/schemas";
import {
  completeOnboarding,
  saveGoal,
  savePromptFrequency,
} from "@/lib/onboarding/service";
import { requirePlayer } from "@/lib/player/current";
import type { FormState } from "@/lib/player/schemas";
import { setActiveVoice } from "@/lib/voice/service";

export async function submitGoal(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const player = await requirePlayer();
  const parsed = goalSchema.safeParse({
    goalKind: formData.get("goalKind"),
    targetPaceSPerKm: formData.get("targetPace"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await saveGoal(player.id, parsed.data);
  } catch {
    return { message: "Could not save your goal. Try again." };
  }

  redirect("/onboarding/prompts");
}

export async function submitPromptFrequency(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const player = await requirePlayer();
  const parsed = promptFrequencySchema.safeParse({
    promptFrequency: formData.get("promptFrequency"),
  });

  if (!parsed.success) {
    return { message: "Pick how often you want to be nudged." };
  }

  try {
    await savePromptFrequency(player.id, parsed.data.promptFrequency);
  } catch {
    return { message: "Could not save that setting. Try again." };
  }

  redirect("/onboarding/voice");
}

export async function finishOnboarding() {
  const player = await requirePlayer();

  await completeOnboarding(player.id);
  redirect("/dashboard");
}

export async function chooseVoice(formData: FormData) {
  const player = await requirePlayer();
  const voiceId = formData.get("voiceId");

  if (typeof voiceId !== "string") {
    return;
  }

  await setActiveVoice(player.id, voiceId);
  revalidatePath("/onboarding/voice");
}
