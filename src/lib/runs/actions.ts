"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { requirePlayer } from "@/lib/player/current";
import { createRunSchema, type FormState } from "@/lib/player/schemas";
import { createRun } from "@/lib/runs/service";

export async function logRun(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const player = await requirePlayer();
  const parsed = createRunSchema.safeParse({
    mode: formData.get("mode"),
    distanceM: formData.get("distanceM"),
    durationS: formData.get("durationS"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await createRun(player.id, parsed.data);
  } catch {
    return { message: "Could not save that run. Try again." };
  }

  revalidatePath("/dashboard");

  return { message: "Run saved." };
}
