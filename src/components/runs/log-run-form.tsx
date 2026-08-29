"use client";

import { useActionState } from "react";

import { logRun } from "@/lib/runs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LogRunForm() {
  const [state, action, pending] = useActionState(logRun, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="mode">Mode</Label>
          <select
            id="mode"
            name="mode"
            defaultValue="chase"
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            <option value="chase">Chase</option>
            <option value="cheer">Cheer</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="distanceM">Distance (m)</Label>
          <Input
            id="distanceM"
            name="distanceM"
            type="number"
            min={1}
            step={1}
            defaultValue={5000}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="durationS">Duration (s)</Label>
          <Input
            id="durationS"
            name="durationS"
            type="number"
            min={1}
            step={1}
            defaultValue={1800}
            required
          />
        </div>
      </div>

      {Object.values(state?.errors ?? {})
        .flat()
        .map((error) => (
          <p key={error} className="text-destructive text-sm">
            {error}
          </p>
        ))}

      {state?.message ? (
        <p className="text-muted-foreground text-sm">{state.message}</p>
      ) : null}

      <Button type="submit" disabled={pending} className="sm:w-fit">
        {pending ? "Saving…" : "Log run"}
      </Button>
    </form>
  );
}
