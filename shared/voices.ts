/**
 * The coach roster, shared by the landing page and the Expo app.
 *
 * ElevenLabs voice ids are not secrets — the API key is, so speech is always
 * requested through `/api/coach-voice`, never from a client. Clients ask for a
 * `line` index rather than sending text so the route can never be used as an
 * open text-to-speech proxy, and so every clip is cacheable.
 *
 * Every voice covers the whole run: the selected voice is the only one heard,
 * and the pace state decides which of its lines fires. Rivals taunt when you
 * drop under aim pace and concede when you hold it; allies encourage either
 * way. See `LineTrigger`.
 */

export type CoachId =
  | "mum"
  | "ex-female"
  | "ex-male"
  | "sergeant"
  | "coach"
  | "nan";

/** Pole the voice speaks from: rivals lean on you, allies carry you. */
export type CoachPole = "rival" | "ally" | "neutral";

/**
 * When a line is allowed to fire, from GPS pace against the aim pace set at
 * setup:
 * - `start` — first prompt of the run, before there is a rolling pace.
 * - `behind` — rolling pace slower than aim. For rivals this is also where the
 *   voice is rendered closer, since distance is pace.
 * - `ahead` — rolling pace at or faster than aim.
 * - `pb-in-sight` — on aim pace with the personal best within reach.
 * - `finish` — after the run ends, over the summary.
 */
export type LineTrigger =
  | "start"
  | "behind"
  | "ahead"
  | "pb-in-sight"
  | "finish";

export type CoachLine = { text: string; trigger: LineTrigger };

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
  lines: CoachLine[];
};

export const coachVoices: CoachVoice[] = [
  {
    id: "mum",
    name: "Mum",
    pole: "ally",
    voiceId: "DVP0tUPMxAGcT3nZxz0b",
    settings: { stability: 0.75, similarity_boost: 0.8, style: 0.15 },
    lines: [
      { text: "Off you go, love. I'll be here the whole way.", trigger: "start" },
      {
        text: "Don't you dare stop, you're doing beautifully.",
        trigger: "behind",
      },
      {
        text: "Have you had water? No? Have some water when you finish.",
        trigger: "behind",
      },
      { text: "You've got more in you. You always have.", trigger: "behind" },
      {
        text: "That's a lovely pace, sweetheart. Don't overdo it.",
        trigger: "ahead",
      },
      {
        text: "You're doing so well, love. I've told the whole street.",
        trigger: "ahead",
      },
      {
        text: "You're ahead of where you were. Go on, finish it.",
        trigger: "pb-in-sight",
      },
      {
        text: "I'm so proud of you I could cry. I might, actually.",
        trigger: "finish",
      },
    ],
  },
  {
    id: "ex-female",
    name: "The Ex (female)",
    pole: "rival",
    voiceId: "m3yAHyFEFKtbCIM5n7GF",
    settings: { stability: 0.45, similarity_boost: 0.75, style: 0.55 },
    lines: [
      { text: "Oh, you run now? Since when?", trigger: "start" },
      {
        text: "You've never been fit enough for me. But keep going, it's sweet.",
        trigger: "behind",
      },
      {
        text: "Is this the pace, or is this the warm-up? Genuine question.",
        trigger: "behind",
      },
      {
        text: "I'm forty metres back and I'm not even out of breath.",
        trigger: "behind",
      },
      {
        text: "I'd say I'm proud of you, but you'd only slow down.",
        trigger: "ahead",
      },
      {
        text: "Nice split. Annoying. Keep that up and you lose me.",
        trigger: "ahead",
      },
      {
        text: "Careful — beat that best and you'll have nothing left to blame me for.",
        trigger: "pb-in-sight",
      },
      { text: "Fine. You escaped. This time.", trigger: "finish" },
    ],
  },
  {
    id: "ex-male",
    name: "The Ex (male)",
    pole: "rival",
    voiceId: "O9Nfm6ANLL7Jj3qDdBKR",
    settings: { stability: 0.45, similarity_boost: 0.75, style: 0.5 },
    lines: [
      { text: "Mate. Mate. Is this the pace?", trigger: "start" },
      {
        text: "You said five minutes a kilometre. No — you said five thirty. I remember.",
        trigger: "behind",
      },
      {
        text: "Calm down. I'm being supportive. This is supportive.",
        trigger: "behind",
      },
      {
        text: "You always do this. You get tired and somehow it's my fault.",
        trigger: "behind",
      },
      {
        text: "That wasn't your best. You're thinking of a different run.",
        trigger: "ahead",
      },
      {
        text: "I'm not chasing you. I'm just going the same way, faster.",
        trigger: "ahead",
      },
      {
        text: "Your watch is wrong, I reckon. Mine's never wrong.",
        trigger: "pb-in-sight",
      },
      {
        text: "Alright, that was quick. I'll tell people it was the shoes.",
        trigger: "finish",
      },
    ],
  },
  {
    id: "sergeant",
    name: "Drill Sergeant",
    pole: "rival",
    voiceId: "DGzg6RaUqxGRTHSBjfgF",
    settings: { stability: 0.3, similarity_boost: 0.75, style: 0.8 },
    lines: [
      { text: "Move. Now.", trigger: "start" },
      { text: "That's not a pace, that's a suggestion.", trigger: "behind" },
      { text: "No excuses. None. Not even that one.", trigger: "behind" },
      {
        text: "Pain is information. This information says keep going.",
        trigger: "behind",
      },
      { text: "Better. Hold it there.", trigger: "ahead" },
      { text: "That's the pace. Do not get comfortable.", trigger: "ahead" },
      { text: "Final kilometre. Empty the tank.", trigger: "pb-in-sight" },
      { text: "Good. Now do it again tomorrow.", trigger: "finish" },
    ],
  },
  {
    id: "coach",
    name: "Classic Coach",
    pole: "neutral",
    voiceId: "84Fal4DSXWfp7nJ8emqQ",
    settings: { stability: 0.85, similarity_boost: 0.75, style: 0 },
    lines: [
      {
        text: "Target pace set. Settle in for the first kilometre.",
        trigger: "start",
      },
      {
        text: "You're eight seconds off target. Lift the cadence, not the stride.",
        trigger: "behind",
      },
      {
        text: "Halfway. Everything from here is a decision.",
        trigger: "behind",
      },
      { text: "You're five seconds under target. Hold this.", trigger: "ahead" },
      {
        text: "Good rhythm. Keep the cadence, shorten the stride.",
        trigger: "ahead",
      },
      {
        text: "You're eight seconds off your best. That's one good kilometre.",
        trigger: "pb-in-sight",
      },
      { text: "New personal best. Logged.", trigger: "finish" },
    ],
  },
  {
    id: "nan",
    name: "Nan, Unhinged",
    pole: "ally",
    voiceId: "0rEo3eAjssGDUCXHYENf",
    settings: { stability: 0.7, similarity_boost: 0.8, style: 0.35 },
    lines: [
      { text: "Right then, darling. Let's frighten them.", trigger: "start" },
      { text: "If you stop, I'll know. I always know.", trigger: "behind" },
      {
        text: "I've put a bet on you. A real one. Don't embarrass me.",
        trigger: "behind",
      },
      { text: "Lovely form, darling. Now destroy him.", trigger: "ahead" },
      {
        text: "Have a biscuit after. You've earned it. Nobody else has.",
        trigger: "ahead",
      },
      {
        text: "One more push, angel, and then we ruin someone's day.",
        trigger: "pb-in-sight",
      },
      {
        text: "There we are. A personal best. I never doubted you, obviously.",
        trigger: "finish",
      },
    ],
  },
];

export function findCoachVoice(id: string): CoachVoice | undefined {
  return coachVoices.find((voice) => voice.id === id);
}

/**
 * Line indices a voice can use in a given pace state, in clip terms — the run
 * loop picks one of these and plays `coachVoiceClipPath(voice.id, index)`.
 */
export function coachLinesFor(voice: CoachVoice, trigger: LineTrigger) {
  return voice.lines
    .map((line, index) => ({ ...line, index }))
    .filter((line) => line.trigger === trigger);
}

/** Relative URL of the clip for one of a coach's lines. */
export function coachVoiceClipPath(id: CoachId, line: number) {
  return `/api/coach-voice?coach=${id}&line=${line}`;
}
