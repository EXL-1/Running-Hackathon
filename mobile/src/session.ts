/**
 * In-memory run setup: which coach persona is selected, whether the location
 * primer has been shown, and today's baseline answer. Nothing is persisted yet
 * — the screens read it so the Tap Run flow can skip steps already satisfied.
 */
import { coachVoices, type CoachId } from "@shared/voices";

export type { CoachId };

export type Coach = {
  id: CoachId;
  name: string;
  descriptor: string;
  /** Preview lines, in the voice's own ElevenLabs voice. */
  lines: string[];
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

export type BaselineAnswer = "faster" | "slower" | "on-target";

export const session = {
  coach: null as Coach | null,
  primerSeen: false,
  openStravaOnStart: false,
  baseline: "on-target" as BaselineAnswer,
  baselinePaceSecondsPerKm: 332,
  personalBestSecondsPerKm: 348,
  personalBestLabel: "5K · 12 Aug",
};
