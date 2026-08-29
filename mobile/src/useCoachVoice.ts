import { useAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";

import type { LineTrigger } from "@shared/voices";
import { session } from "./session";
import { coachClipUrl } from "./voice";

const TICK_MS = 15_000;
/** Ticks to wait before repeating a prompt while the pace state is unchanged. */
const TICKS_BETWEEN_PROMPTS = 3;

/**
 * Speaks the selected coach's lines for the current pace state — the state
 * changes the moment you cross the aim pace, otherwise a prompt lands about
 * every 45s so the voice never becomes wallpaper. Returns the line being
 * spoken so the screen caption can show it.
 */
export function useCoachVoice(trigger: LineTrigger | null) {
  const player = useAudioPlayer();
  const [spoken, setSpoken] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const lastTrigger = useRef<LineTrigger | null>(null);
  const lastTick = useRef(-TICKS_BETWEEN_PROMPTS);
  const cursor = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setTick((current) => current + 1), TICK_MS);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const coach = session.coach;

    if (!trigger || !coach) {
      return;
    }

    const changed = trigger !== lastTrigger.current;

    if (!changed && tick - lastTick.current < TICKS_BETWEEN_PROMPTS) {
      return;
    }

    const options = coach.lines
      .map((line, index) => ({ ...line, index }))
      .filter((line) => line.trigger === trigger);

    if (options.length === 0) {
      return;
    }

    const line = options[cursor.current % options.length];

    lastTrigger.current = trigger;
    lastTick.current = tick;
    cursor.current += 1;

    player.replace({ uri: coachClipUrl(coach.id, line.index) });
    player.play();
    setSpoken(line.text);
  }, [player, tick, trigger]);

  return spoken;
}
