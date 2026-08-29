"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACCEPTED_SAMPLE_TYPES,
  voiceSentiments,
  type VoiceSentiment,
} from "@/lib/onboarding/schemas";

const sentimentLabels: Record<VoiceSentiment, string> = {
  love: "Someone I love",
  hate: "Someone I hate",
};

export function VoiceUploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function upload(formData: FormData) {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/voices", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);

        setError(
          typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
            ? payload.error
            : "Could not upload that clip.",
        );

        return;
      }

      router.refresh();
    } catch {
      setError("Could not upload that clip.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={upload} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Whose voice is it?</Label>
        <Input
          id="label"
          name="label"
          placeholder="My ex"
          maxLength={40}
          required
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">How do you feel about them?</legend>
        <div className="flex gap-3">
          {voiceSentiments.map((sentiment, index) => (
            <label
              key={sentiment}
              className="hover:bg-accent has-checked:border-primary has-checked:bg-accent flex flex-1 cursor-pointer items-center justify-center rounded-lg border p-3 text-sm"
            >
              <input
                type="radio"
                name="sentiment"
                value={sentiment}
                defaultChecked={index === 0}
                className="sr-only"
              />
              {sentimentLabels[sentiment]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sample">Audio clip</Label>
        <Input
          id="sample"
          name="sample"
          type="file"
          accept={ACCEPTED_SAMPLE_TYPES.join(",")}
          required
        />
        <p className="text-muted-foreground text-sm">
          30 seconds of clear speech is plenty. Up to 10 MB.
        </p>
      </div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Cloning the voice…" : "Add this voice"}
      </Button>
    </form>
  );
}
