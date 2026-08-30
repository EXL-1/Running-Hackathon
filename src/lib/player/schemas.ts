import * as z from "zod";

import { coachIds, type CoachId } from "@shared/voices";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, { error: "Use at least 3 characters." })
  .max(20, { error: "Use at most 20 characters." })
  .regex(/^[a-z0-9_]+$/, {
    error: "Letters, numbers and underscores only.",
  });

export const claimUsernameSchema = z.object({
  username: usernameSchema,
});

export const coachVoiceIdSchema = z.enum(coachIds as [CoachId, ...CoachId[]], {
  error: "Pick one of the coaches.",
});

export const runBaselines = ["faster", "slower", "on-target"] as const;

export const createRunSchema = z.object({
  mode: z.enum(["chase", "cheer"]),
  distanceM: z.coerce.number().int().positive().max(500_000),
  durationS: z.coerce.number().int().positive().max(86_400),
  startedAt: z.iso.datetime().optional(),
  coachVoiceId: coachVoiceIdSchema.optional(),
  baseline: z.enum(runBaselines).optional(),
});

export type CreateRunInput = z.infer<typeof createRunSchema>;

export type FormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;
