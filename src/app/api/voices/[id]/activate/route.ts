import type { NextRequest } from "next/server";

import { getCurrentPlayer } from "@/lib/player/current";
import { listVoices, setActiveVoice } from "@/lib/voice/service";

/** Makes one of the player's own voices the one the coach speaks in. */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  const { id } = await params;
  const voices = await listVoices(player.id);

  if (!voices.some((voice) => voice.id === id)) {
    return Response.json({ error: "No such voice." }, { status: 404 });
  }

  await setActiveVoice(player.id, id);

  return Response.json({
    voices: voices.map((voice) => ({ ...voice, isActive: voice.id === id })),
  });
}
