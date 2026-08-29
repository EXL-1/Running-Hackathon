"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitGoal } from "@/lib/onboarding/actions";
import { formatPace } from "@/lib/onboarding/pace";
import type { GoalKind } from "@/lib/onboarding/schemas";

const goalOptions: {
  value: GoalKind;
  title: string;
  description: string;
  paceLabel: string;
  paceHint: string;
}[] = [
  {
    value: "increase_pace",
    title: "Get faster",
    description: "Chip away at your pace run by run.",
    paceLabel: "Pace you run now",
    paceHint: "We nudge you a little quicker than this.",
  },
  {
    value: "target_pace",
    title: "Train for a pace",
    description: "Hold one pace until it feels easy.",
    paceLabel: "Pace you're aiming for",
    paceHint: "Prompts fire when you drift off it.",
  },
];

type GoalFormProps = {
  defaultGoalKind: GoalKind | null;
  defaultPaceSPerKm: number | null;
};

export function GoalForm({ defaultGoalKind, defaultPaceSPerKm }: GoalFormProps) {
  const [state, action, pending] = useActionState(submitGoal, undefined);
  const [goalKind, setGoalKind] = useState<GoalKind>(
    defaultGoalKind ?? "increase_pace",
  );
  const selected =
    goalOptions.find((option) => option.value === goalKind) ?? goalOptions[0];

  return (
    <form action={action} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">
          What do you want from Runaway?
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {goalOptions.map((option) => (
            <label
              key={option.value}
              className="hover:bg-accent has-checked:border-primary has-checked:bg-accent flex cursor-pointer flex-col gap-1 rounded-lg border p-4"
            >
              <input
                type="radio"
                name="goalKind"
                value={option.value}
                checked={goalKind === option.value}
                onChange={() => setGoalKind(option.value)}
                className="sr-only"
              />
              <span className="font-medium">{option.title}</span>
              <span className="text-muted-foreground text-sm">
                {option.description}
              </span>
            </label>
          ))}
        </div>
        {state?.errors?.goalKind?.map((error) => (
          <p key={error} className="text-destructive text-sm">
            {error}
          </p>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="targetPace">{selected.paceLabel} (min/km)</Label>
        <Input
          id="targetPace"
          name="targetPace"
          inputMode="numeric"
          placeholder="5:30"
          defaultValue={
            defaultPaceSPerKm === null ? "" : formatPace(defaultPaceSPerKm)
          }
          required
        />
        <p className="text-muted-foreground text-sm">{selected.paceHint}</p>
        {state?.errors?.targetPaceSPerKm?.map((error) => (
          <p key={error} className="text-destructive text-sm">
            {error}
          </p>
        ))}
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
