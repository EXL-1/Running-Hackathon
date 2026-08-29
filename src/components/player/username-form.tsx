"use client";

import { useActionState } from "react";

import { claimUsername } from "@/lib/player/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UsernameForm() {
  const [state, action, pending] = useActionState(claimUsername, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="fastfeet"
          required
        />
        <p className="text-muted-foreground text-sm">
          3–20 characters: letters, numbers and underscores.
        </p>
        {state?.errors?.username?.map((error) => (
          <p key={error} className="text-destructive text-sm">
            {error}
          </p>
        ))}
      </div>

      {state?.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Getting ready…" : "Start running"}
      </Button>
    </form>
  );
}
