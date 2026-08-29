import * as z from "zod";

import { coachVoiceIdSchema } from "@/lib/player/schemas";
import {
  MAX_PACE_S_PER_KM,
  MIN_PACE_S_PER_KM,
  formatPace,
  parsePace,
} from "@/lib/onboarding/pace";

export const goalKinds = ["increase_pace", "target_pace"] as const;
export const voiceSentiments = ["love", "hate"] as const;

export type GoalKind = (typeof goalKinds)[number];
export type VoiceSentiment = (typeof voiceSentiments)[number];

export const MIN_PROMPT_FREQUENCY = 1;
export const MAX_PROMPT_FREQUENCY = 5;

export const MAX_SAMPLE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_SAMPLE_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "video/mp4",
] as const;

/** Pace typed as `mm:ss` per kilometre, stored as whole seconds. */
export const paceSchema = z
  .string()
  .transform((value, ctx) => {
    const seconds = parsePace(value);

    if (seconds === null) {
      ctx.addIssue({ code: "custom", error: "Use mm:ss, for example 5:30." });

      return z.NEVER;
    }

    return seconds;
  })
  .refine(
    (seconds) =>
      seconds >= MIN_PACE_S_PER_KM && seconds <= MAX_PACE_S_PER_KM,
    {
      error: `Pick a pace between ${formatPace(MIN_PACE_S_PER_KM)} and ${formatPace(MAX_PACE_S_PER_KM)} per km.`,
    },
  );

/** Pace sent by the native app, which picks whole seconds on a wheel. */
export const paceSecondsSchema = z.coerce
  .number()
  .int()
  .min(MIN_PACE_S_PER_KM, {
    error: `Pick a pace between ${formatPace(MIN_PACE_S_PER_KM)} and ${formatPace(MAX_PACE_S_PER_KM)} per km.`,
  })
  .max(MAX_PACE_S_PER_KM, {
    error: `Pick a pace between ${formatPace(MIN_PACE_S_PER_KM)} and ${formatPace(MAX_PACE_S_PER_KM)} per km.`,
  });

export const goalSchema = z.object({
  goalKind: z.enum(goalKinds, { error: "Pick what you are training for." }),
  targetPaceSPerKm: paceSchema,
});

export const promptFrequencySchema = z.object({
  promptFrequency: z.coerce
    .number()
    .int()
    .min(MIN_PROMPT_FREQUENCY)
    .max(MAX_PROMPT_FREQUENCY),
});

export const voiceUploadSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, { error: "Give the voice a name." })
    .max(40, { error: "Use at most 40 characters." }),
  sentiment: z.enum(voiceSentiments, {
    error: "Say whether this is someone you love or hate.",
  }),
  sample: z
    .instanceof(File, { error: "Pick an audio file." })
    .refine((file) => file.size > 0, { error: "That file is empty." })
    .refine((file) => file.size <= MAX_SAMPLE_BYTES, {
      error: "Keep the clip under 10 MB.",
    }),
});

/**
 * A partial onboarding update, as the native app sends it. Goal and pace move
 * together because a goal without a pace to compare against says nothing.
 */
export const playerOnboardingPatchSchema = z
  .object({
    goalKind: z.enum(goalKinds).optional(),
    targetPaceSPerKm: paceSecondsSchema.optional(),
    promptFrequency: promptFrequencySchema.shape.promptFrequency.optional(),
    coachVoiceId: coachVoiceIdSchema.optional(),
    onboardingCompleted: z.literal(true).optional(),
  })
  .refine(
    (patch) =>
      (patch.goalKind === undefined) === (patch.targetPaceSPerKm === undefined),
    { error: "Send goalKind and targetPaceSPerKm together." },
  )
  .refine((patch) => Object.values(patch).some((value) => value !== undefined), {
    error: "Nothing to update.",
  });

export type PlayerOnboardingPatch = z.infer<typeof playerOnboardingPatchSchema>;

export type GoalInput = z.infer<typeof goalSchema>;
export type VoiceUploadInput = z.infer<typeof voiceUploadSchema>;
