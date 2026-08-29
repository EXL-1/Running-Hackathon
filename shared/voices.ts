/**
 * The coach roster, shared by the landing page and the Expo app.
 *
 * ElevenLabs voice ids are not secrets — the API key is, so speech is always
 * requested through `/api/coach-voice`, never from a client. Clients ask for a
 * `line` index rather than sending text so the route can never be used as an
 * open text-to-speech proxy, and so every clip is cacheable.
 */

export type CoachId =
  | "mum"
  | "ex-female"
  | "ex-male"
  | "sergeant"
  | "coach"
  | "nan";

/** Pole the voice speaks from: rivals fire below aim pace, allies at or above. */
export type CoachPole = "rival" | "ally" | "neutral";

export type CoachVoice = {
  id: CoachId;
  name: string;
  pole: CoachPole;
  /** ElevenLabs voice id. */
  voiceId: string;
  /**
   * Per-voice delivery, matching the casting brief: `style` buys exaggeration,
   * `stability` trades consistency for emotional range.
   */
  settings: { stability: number; similarity_boost: number; style: number };
  lines: string[];
};

export const coachVoices: CoachVoice[] = [
  {
    id: "mum",
    name: "Mum",
    pole: "ally",
    voiceId: "DVP0tUPMxAGcT3nZxz0b",
    settings: { stability: 0.75, similarity_boost: 0.8, style: 0.15 },
    lines: [
      "You're doing so well, love. I've told the whole street.",
      "Have you had water? No? Have some water when you finish.",
      "That's a lovely pace, sweetheart. Don't overdo it.",
      "You're ahead of where you were. That's all I ever ask.",
      "I'm so proud of you I could cry. I might, actually.",
      "Don't you dare stop, you're doing beautifully.",
    ],
  },
  {
    id: "ex-female",
    name: "The Ex (female)",
    pole: "rival",
    voiceId: "m3yAHyFEFKtbCIM5n7GF",
    settings: { stability: 0.45, similarity_boost: 0.75, style: 0.55 },
    lines: [
      "Oh, you run now? Since when?",
      "You've never been fit enough for me. But keep going, it's sweet.",
      "I'd say I'm proud of you, but you'd only slow down.",
      "Is this the pace, or is this the warm-up? Genuine question.",
      "See, you can do it. You just needed me to be disappointed first.",
      "Fine. You escaped. This time.",
    ],
  },
  {
    id: "ex-male",
    name: "The Ex (male)",
    pole: "rival",
    voiceId: "O9Nfm6ANLL7Jj3qDdBKR",
    settings: { stability: 0.45, similarity_boost: 0.75, style: 0.5 },
    lines: [
      "Mate. Mate. Is this the pace?",
      "You said five minutes a kilometre. No — you said five thirty. I remember.",
      "Calm down. I'm being supportive. This is supportive.",
      "That wasn't your PB. You're thinking of a different run.",
      "You always do this. You get tired and somehow it's my fault.",
      "Alright, that was quick. I'll tell people it was the shoes.",
    ],
  },
  {
    id: "sergeant",
    name: "Drill Sergeant",
    pole: "rival",
    voiceId: "DGzg6RaUqxGRTHSBjfgF",
    settings: { stability: 0.3, similarity_boost: 0.75, style: 0.8 },
    lines: [
      "Move. Now.",
      "That's not a pace, that's a suggestion.",
      "No excuses. None. Not even that one.",
      "Pain is information. This information says keep going.",
      "Final kilometre. Empty the tank.",
      "Good. Now do it again tomorrow.",
    ],
  },
  {
    id: "coach",
    name: "Classic Coach",
    pole: "neutral",
    voiceId: "84Fal4DSXWfp7nJ8emqQ",
    settings: { stability: 0.85, similarity_boost: 0.75, style: 0 },
    lines: [
      "You're five seconds under target. Hold this.",
      "Good rhythm. Keep the cadence, shorten the stride.",
      "Halfway. Everything from here is a decision.",
      "You're eight seconds off PB pace. That's one good kilometre.",
      "Last kilometre. Start it honest, finish it hard.",
      "New personal best. Logged.",
    ],
  },
  {
    id: "nan",
    name: "Nan, Unhinged",
    pole: "ally",
    voiceId: "0rEo3eAjssGDUCXHYENf",
    settings: { stability: 0.7, similarity_boost: 0.8, style: 0.35 },
    lines: [
      "Lovely form, darling. Now destroy him.",
      "Have a biscuit after. You've earned it. Nobody else has.",
      "I've put a bet on you. A real one. Don't embarrass me.",
      "If you stop, I'll know. I always know.",
      "One more push, angel, and then we ruin someone's day.",
      "There we are. A personal best. I never doubted you, obviously.",
    ],
  },
];

export function findCoachVoice(id: string): CoachVoice | undefined {
  return coachVoices.find((voice) => voice.id === id);
}

/** Relative URL of the clip for one of a coach's lines. */
export function coachVoiceClipPath(id: CoachId, line: number) {
  return `/api/coach-voice?coach=${id}&line=${line}`;
}
