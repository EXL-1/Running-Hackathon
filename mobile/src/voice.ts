import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";

import { coachVoiceClipPath, findCoachVoice, type CoachId } from "@shared/voices";
import { apiBaseUrl } from "./api";

/**
 * Clips come from the Next.js app rather than ElevenLabs directly, so the API
 * key stays on the server. Point EXPO_PUBLIC_API_URL at the deployed app (or
 * your machine's LAN address in dev — a phone can't reach the host's
 * localhost).
 */
export function coachClipUrl(coach: CoachId, line: number) {
  return `${apiBaseUrl}${coachVoiceClipPath(coach, line)}`;
}

const cacheable = Platform.OS !== "web";

function clipFile(coach: CoachId, line: number) {
  return new File(Paths.cache, "coach-clips", `${coach}-${line}.mp3`);
}

/**
 * The clip to hand to the audio player: the cached copy once it is on disk, so
 * a run narrates without the network, and the URL until then.
 */
export function coachClipSource(coach: CoachId, line: number) {
  if (cacheable) {
    const file = clipFile(coach, line);

    if (file.exists) {
      return { uri: file.uri };
    }
  }

  return { uri: coachClipUrl(coach, line) };
}

/**
 * Warms every clip for a coach onto disk. Resolves once the downloads settle;
 * failures are left to `coachClipSource`, which falls back to the URL.
 */
export async function preloadCoachClips(coach: CoachId) {
  const voice = findCoachVoice(coach);

  if (!voice || !cacheable) {
    return;
  }

  new Directory(Paths.cache, "coach-clips").create({
    idempotent: true,
    intermediates: true,
  });

  await Promise.all(
    voice.lines.map(async (_, line) => {
      const file = clipFile(coach, line);

      if (file.exists) {
        return;
      }

      try {
        await File.downloadFileAsync(coachClipUrl(coach, line), file);
      } catch {
        // Left to the player, which falls back to the URL.
      }
    }),
  );
}
