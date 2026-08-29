/**
 * In-memory run setup: which coach persona is selected, whether the location
 * primer has been shown, and today's baseline answer. Nothing is persisted yet
 * — the screens read it so the Tap Run flow can skip steps already satisfied.
 */
export type CoachId = "mum" | "ex-female" | "ex-male" | "sergeant" | "coach";

export type Coach = {
  id: CoachId;
  name: string;
  descriptor: string;
};

export const coaches: Coach[] = [
  { id: "mum", name: "Mum", descriptor: "Warm, worried, proud of you" },
  {
    id: "ex-female",
    name: "The Ex (female)",
    descriptor: "Approval, but only on her terms",
  },
  {
    id: "ex-male",
    name: "The Ex (male)",
    descriptor: "Sure you said a slower target",
  },
  { id: "sergeant", name: "Drill Sergeant", descriptor: "No excuses, ever" },
  { id: "coach", name: "Classic Coach", descriptor: "Calm and clear" },
];

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
