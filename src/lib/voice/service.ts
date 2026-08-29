import "server-only";

import { randomUUID } from "node:crypto";

import type { VoiceUploadInput } from "@/lib/onboarding/schemas";
import type {
  VoiceSentiment,
  VoiceStatus,
} from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/server";
import { cloneVoice } from "@/lib/voice/elevenlabs";

const BUCKET = "voice-samples";

export type Voice = {
  id: string;
  label: string;
  sentiment: VoiceSentiment;
  status: VoiceStatus;
  errorMessage: string | null;
  isActive: boolean;
};

export async function listVoices(playerId: string): Promise<Voice[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("player_voices")
    .select("id, label, sentiment, status, error_message, is_active")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => ({
    id: row.id,
    label: row.label,
    sentiment: row.sentiment,
    status: row.status,
    errorMessage: row.error_message,
    isActive: row.is_active,
  }));
}

/**
 * Stores the sample in the private bucket, then asks ElevenLabs to clone it.
 * The row is written before the clone so an upload is never lost to an
 * ElevenLabs outage; the status says what happened.
 */
export async function addVoice(
  playerId: string,
  input: VoiceUploadInput,
): Promise<Voice> {
  const supabase = createServiceClient();
  const samplePath = `${playerId}/${randomUUID()}-${sampleFileName(input.sample.name)}`;

  const upload = await supabase.storage
    .from(BUCKET)
    .upload(samplePath, input.sample, {
      contentType: input.sample.type || "application/octet-stream",
    });

  if (upload.error) {
    throw new Error(upload.error.message);
  }

  const inserted = await supabase
    .from("player_voices")
    .insert({
      player_id: playerId,
      label: input.label,
      sentiment: input.sentiment,
      sample_path: samplePath,
      status: "cloning",
    })
    .select("id")
    .single();

  if (inserted.error) {
    await supabase.storage.from(BUCKET).remove([samplePath]);
    throw new Error(inserted.error.message);
  }

  const clone = await cloneVoice(input.label, input.sample);
  const update =
    clone.status === "ready"
      ? { status: "ready" as const, elevenlabs_voice_id: clone.voiceId }
      : clone.status === "failed"
        ? { status: "failed" as const, error_message: clone.message }
        : { status: "uploaded" as const };

  const updated = await supabase
    .from("player_voices")
    .update(update)
    .eq("id", inserted.data.id)
    .select("id, label, sentiment, status, error_message, is_active")
    .single();

  if (updated.error) {
    throw new Error(updated.error.message);
  }

  const voice: Voice = {
    id: updated.data.id,
    label: updated.data.label,
    sentiment: updated.data.sentiment,
    status: updated.data.status,
    errorMessage: updated.data.error_message,
    isActive: updated.data.is_active,
  };

  if (clone.status === "ready") {
    await setActiveVoice(playerId, voice.id);
    voice.isActive = true;
  }

  return voice;
}

/** Makes one of the player's voices the one the coach speaks in. */
export async function setActiveVoice(playerId: string, voiceId: string) {
  const supabase = createServiceClient();
  const cleared = await supabase
    .from("player_voices")
    .update({ is_active: false })
    .eq("player_id", playerId)
    .eq("is_active", true);

  if (cleared.error) {
    throw new Error(cleared.error.message);
  }

  const activated = await supabase
    .from("player_voices")
    .update({ is_active: true })
    .eq("player_id", playerId)
    .eq("id", voiceId);

  if (activated.error) {
    throw new Error(activated.error.message);
  }
}

function sampleFileName(name: string) {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");

  return cleaned.slice(-60) || "sample";
}
