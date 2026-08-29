import type { NextRequest } from "next/server";
import * as z from "zod";

import { nextOnboardingStep } from "@/lib/onboarding/steps";
import { claimUsernameSchema } from "@/lib/player/schemas";
import { claimPlayer } from "@/lib/player/service";
import { createPlayerToken } from "@/lib/player/session";

/**
 * Username sign-in for clients without a cookie jar. Returns the same signed
 * value the browser gets in its cookie, to be sent back as
 * `Authorization: Bearer`.
 */
export async function POST(request: NextRequest) {
  const parsed = claimUsernameSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid username.",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 422 },
    );
  }

  let player;

  try {
    player = await claimPlayer(parsed.data.username);
  } catch {
    return Response.json(
      { error: "Could not claim that username." },
      { status: 500 },
    );
  }

  return Response.json(
    {
      token: createPlayerToken(player.id),
      player,
      nextStep: nextOnboardingStep(player)?.slug ?? null,
    },
    { status: 201 },
  );
}
