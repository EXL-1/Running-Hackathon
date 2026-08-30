import type { Metadata } from "next";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { PromptFrequencyForm } from "@/components/onboarding/prompt-frequency-form";
import { requirePlayer } from "@/lib/player/current";

export const metadata: Metadata = {
  title: "Prompts — Peanut Butter",
};

export default async function PromptsPage() {
  const player = await requirePlayer();

  return (
    <OnboardingShell
      slug="prompts"
      title="How much should we talk?"
      description="You'll hear from us when you drop below your pace or push above it. Decide how often."
    >
      <PromptFrequencyForm defaultFrequency={player.promptFrequency} />
    </OnboardingShell>
  );
}
