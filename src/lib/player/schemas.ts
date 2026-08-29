import * as z from "zod";

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

export const createRunSchema = z.object({
  mode: z.enum(["chase", "cheer"]),
  distanceM: z.coerce.number().int().positive().max(500_000),
  durationS: z.coerce.number().int().positive().max(86_400),
  startedAt: z.iso.datetime().optional(),
});

export type CreateRunInput = z.infer<typeof createRunSchema>;

export type FormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;
