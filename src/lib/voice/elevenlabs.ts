import "server-only";

import { elevenLabsApiKey } from "@/lib/supabase/env";

const CLONE_URL = "https://api.elevenlabs.io/v1/voices/add";

export type CloneResult =
  | { status: "ready"; voiceId: string }
  | { status: "skipped" }
  | { status: "failed"; message: string };

/**
 * Instant voice clone from a single sample. Returns `skipped` when no API key is
 * configured so the rest of onboarding still works locally, and never throws —
 * a failed clone is recorded on the voice row instead of losing the upload.
 */
export async function cloneVoice(
  name: string,
  sample: File,
): Promise<CloneResult> {
  const apiKey = elevenLabsApiKey();

  if (!apiKey) {
    return { status: "skipped" };
  }

  const body = new FormData();
  body.set("name", name);
  body.append("files", sample, sample.name || "sample.mp3");

  try {
    const response = await fetch(CLONE_URL, {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body,
    });

    if (!response.ok) {
      return {
        status: "failed",
        message: await readError(response),
      };
    }

    const payload: unknown = await response.json();
    const voiceId =
      typeof payload === "object" &&
      payload !== null &&
      "voice_id" in payload &&
      typeof payload.voice_id === "string"
        ? payload.voice_id
        : null;

    return voiceId
      ? { status: "ready", voiceId }
      : { status: "failed", message: "ElevenLabs returned no voice id." };
  } catch {
    return { status: "failed", message: "Could not reach ElevenLabs." };
  }
}

async function readError(response: Response) {
  const text = await response.text().catch(() => "");

  return text.slice(0, 200) || `ElevenLabs replied ${response.status}.`;
}
