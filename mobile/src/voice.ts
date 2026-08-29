import { preload } from "expo-audio";

import { coachVoiceClipPath, findCoachVoice, type CoachId } from "@shared/voices";

/**
 * Clips come from the Next.js app rather than ElevenLabs directly, so the API
 * key stays on the server. Point EXPO_PUBLIC_API_URL at the deployed app (or
 * your machine's LAN address in dev — a phone can't reach the host's
 * localhost).
 */
const apiBaseUrl = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export function coachClipUrl(coach: CoachId, line: number) {
  return `${apiBaseUrl}${coachVoiceClipPath(coach, line)}`;
}

/**
 * Warms every clip for a coach so a run can narrate without the network.
 * Resolves once the cacheable clips are on disk; failures are left to the
 * player, which falls back to silence.
 */
export async function preloadCoachClips(coach: CoachId) {
  const voice = findCoachVoice(coach);

  if (!voice) {
    return;
  }

  await Promise.all(
    voice.lines.map((_, line) =>
      preload({ uri: coachClipUrl(coach, line) }).catch(() => undefined),
    ),
  );
}
