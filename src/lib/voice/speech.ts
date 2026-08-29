import "server-only";

import { elevenLabsApiKey } from "@/lib/supabase/env";
import type { CoachVoice } from "@shared/voices";

const TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const MODEL_ID = "eleven_multilingual_v2";
const OUTPUT_FORMAT = "mp3_44100_128";

export type SpeechResult =
  | { status: "ready"; audio: ArrayBuffer }
  | { status: "unconfigured" }
  | { status: "failed"; message: string };

/**
 * Clips are the same fixed lines every time, so one generation per line is
 * enough. The map is per server instance — a cold start just re-generates.
 */
const cache = new Map<string, ArrayBuffer>();
const CACHE_LIMIT = 200;

/**
 * Renders one of a coach's lines. Returns `unconfigured` rather than throwing
 * when no API key is set, so both clients can fall back to their silent
 * previews instead of showing an error.
 */
export async function speakCoachLine(
  voice: CoachVoice,
  line: number,
): Promise<SpeechResult> {
  const text = voice.lines[line]?.text;

  if (!text) {
    return { status: "failed", message: "No such line." };
  }

  const apiKey = elevenLabsApiKey();

  if (!apiKey) {
    return { status: "unconfigured" };
  }

  const key = `${voice.voiceId}:${line}`;
  const cached = cache.get(key);

  if (cached) {
    return { status: "ready", audio: cached };
  }

  try {
    const response = await fetch(
      `${TTS_URL}/${voice.voiceId}?output_format=${OUTPUT_FORMAT}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: voice.settings,
        }),
      },
    );

    if (!response.ok) {
      return { status: "failed", message: await readError(response) };
    }

    const audio = await response.arrayBuffer();

    if (cache.size >= CACHE_LIMIT) {
      cache.clear();
    }

    cache.set(key, audio);

    return { status: "ready", audio };
  } catch {
    return { status: "failed", message: "Could not reach ElevenLabs." };
  }
}

async function readError(response: Response) {
  const text = await response.text().catch(() => "");

  return text.slice(0, 200) || `ElevenLabs replied ${response.status}.`;
}
