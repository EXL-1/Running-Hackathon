import type { NextRequest } from "next/server";
import * as z from "zod";

import { playerOnboardingPatchSchema } from "@/lib/onboarding/schemas";
import { applyOnboardingPatch } from "@/lib/onboarding/service";
import { nextOnboardingStep } from "@/lib/onboarding/steps";
import { getCurrentPlayer } from "@/lib/player/current";

export async function GET() {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  return Response.json({
    player,
    nextStep: nextOnboardingStep(player)?.slug ?? null,
  });
}

/** Onboarding answers, one step at a time. */
export async function PATCH(request: NextRequest) {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  const parsed = playerOnboardingPatchSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid update.",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const updated = await applyOnboardingPatch(player.id, parsed.data);

    return Response.json({
      player: updated,
      nextStep: nextOnboardingStep(updated)?.slug ?? null,
    });
  } catch {
    return Response.json(
      { error: "Could not save that setting." },
      { status: 500 },
    );
  }
}
