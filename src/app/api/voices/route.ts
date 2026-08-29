import type { NextRequest } from "next/server";
import * as z from "zod";

import { voiceUploadSchema } from "@/lib/onboarding/schemas";
import { getCurrentPlayer } from "@/lib/player/current";
import { addVoice, listVoices } from "@/lib/voice/service";

export async function GET() {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  return Response.json({ voices: await listVoices(player.id) });
}

/**
 * Multipart rather than a Server Action: audio clips run past the 1MB action
 * body cap, and the client wants per-upload progress and errors.
 */
export async function POST(request: NextRequest) {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return Response.json({ error: "Expected a file upload." }, { status: 400 });
  }

  const parsed = voiceUploadSchema.safeParse({
    label: formData.get("label"),
    sentiment: formData.get("sentiment"),
    sample: formData.get("sample"),
  });

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid voice.",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    return Response.json(
      { voice: await addVoice(player.id, parsed.data) },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Could not save that clip. Try again." },
      { status: 500 },
    );
  }
}
