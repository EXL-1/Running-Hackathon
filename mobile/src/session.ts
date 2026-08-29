/**
 * Coach personas and the run setup that only matters until the run ends. What
 * a player keeps — their username, coach and runs — lives in Supabase behind
 * `src/api.ts`; the primer flag and today's baseline answer stay here.
 */
import { coachVoices, type CoachId, type CoachLine } from "@shared/voices";

import type { BaselineAnswer } from "./api";

export type { BaselineAnswer, CoachId };

export type Coach = {
  id: CoachId;
  name: string;
  descriptor: string;
  /** Every line this voice can speak, tagged with the pace state that fires it. */
  lines: CoachLine[];
};

const descriptors: Record<CoachId, string> = {
  mum: "Warm, worried, proud of you",
  "ex-female": "Approval, but only on her terms",
  "ex-male": "Sure you said a slower target",
  sergeant: "No excuses, ever",
  coach: "Calm and clear",
  nan: "Sweet, and completely feral",
};

export const coaches: Coach[] = coachVoices.map((voice) => ({
  id: voice.id,
  name: voice.name,
  descriptor: descriptors[voice.id],
  lines: voice.lines,
}));

export function findCoach(id: CoachId | null | undefined) {
  return coaches.find((coach) => coach.id === id) ?? null;
}

/** Aim pace for a player who hasn't set a target yet: 5:32 /km. */
export const DEFAULT_AIM_PACE_S_PER_KM = 332;

export const session = {
  primerSeen: false,
  openStravaOnStart: false,
  baseline: "on-target" as BaselineAnswer,
};
