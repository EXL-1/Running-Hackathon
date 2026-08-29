"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { submitPromptFrequency } from "@/lib/onboarding/actions";
import {
  MAX_PROMPT_FREQUENCY,
  MIN_PROMPT_FREQUENCY,
} from "@/lib/onboarding/schemas";

const levels: Record<number, { title: string; description: string }> = {
  1: {
    title: "Barely a word",
    description: "Only when you are way off your pace.",
  },
  2: {
    title: "Now and then",
    description: "A prompt every few minutes at most.",
  },
  3: {
    title: "Balanced",
    description: "A nudge whenever you drift off pace for a while.",
  },
  4: {
    title: "Chatty",
    description: "Quick corrections as soon as you slip.",
  },
  5: {
    title: "In your ear",
    description: "Constant coaching, every drift, up or down.",
  },
};

export function PromptFrequencyForm({
  defaultFrequency,
}: {
  defaultFrequency: number | null;
}) {
  const [state, action, pending] = useActionState(
    submitPromptFrequency,
    undefined,
  );
  const [frequency, setFrequency] = useState(defaultFrequency ?? 3);
  const level = levels[frequency];

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="promptFrequency" value={frequency} />

      <div className="flex flex-col gap-4">
        <Slider
          value={[frequency]}
          onValueChange={([next]) => setFrequency(next)}
          min={MIN_PROMPT_FREQUENCY}
          max={MAX_PROMPT_FREQUENCY}
          step={1}
          aria-label="Prompt frequency"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Fewer prompts</span>
          <span>More prompts</span>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <p className="font-medium">{level.title}</p>
        <p className="text-muted-foreground text-sm">{level.description}</p>
      </div>

      {state?.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Next"}
      </Button>
    </form>
  );
}
