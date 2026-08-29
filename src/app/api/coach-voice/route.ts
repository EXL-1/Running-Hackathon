import type { NextRequest } from "next/server";

import { speakCoachLine } from "@/lib/voice/speech";
import { findCoachVoice } from "@shared/voices";

/**
 * Streams a coach line as mp3. Takes a coach id and a line index rather than
 * free text so it can't be used as a general text-to-speech proxy, and so a
 * clip URL is stable enough to cache forever.
 *
 * 503 (rather than 500) when no API key is configured: clients treat it as
 * "no audio yet" and fall back to their silent preview.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const voice = findCoachVoice(params.get("coach") ?? "");
  const line = Number(params.get("line") ?? "0");

  if (!voice) {
    return Response.json({ error: "Unknown coach." }, { status: 404 });
  }

  if (!Number.isInteger(line) || line < 0 || line >= voice.lines.length) {
    return Response.json({ error: "Unknown line." }, { status: 404 });
  }

  const result = await speakCoachLine(voice, line);

  if (result.status === "unconfigured") {
    return Response.json(
      { error: "Voice playback is not configured yet." },
      { status: 503 },
    );
  }

  if (result.status === "failed") {
    return Response.json({ error: result.message }, { status: 502 });
  }

  return new Response(result.audio, {
    headers: {
      "content-type": "audio/mpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
