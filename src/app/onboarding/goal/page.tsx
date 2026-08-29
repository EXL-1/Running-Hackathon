import type { Metadata } from "next";

import { GoalForm } from "@/components/onboarding/goal-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { requirePlayer } from "@/lib/player/current";

export const metadata: Metadata = {
  title: "Your goal — Runaway",
};

export default async function GoalPage() {
  const player = await requirePlayer();

  return (
    <OnboardingShell
      slug="goal"
      title="What are you training for?"
      description="Your Strava history tells us how you run. This tells us where you want to get to."
    >
      <GoalForm
        defaultGoalKind={player.goalKind}
        defaultPaceSPerKm={player.targetPaceSPerKm}
      />
    </OnboardingShell>
  );
}
