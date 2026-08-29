export type OnboardingStep = {
  slug: "goal" | "prompts" | "voice";
  href: string;
  title: string;
};

export const onboardingSteps: OnboardingStep[] = [
  { slug: "goal", href: "/onboarding/goal", title: "Your goal" },
  { slug: "prompts", href: "/onboarding/prompts", title: "Prompts" },
  { slug: "voice", href: "/onboarding/voice", title: "Voice" },
];

type OnboardingProgress = {
  goalKind: string | null;
  promptFrequency: number | null;
  onboardingCompletedAt: string | null;
};

/**
 * The first step a player still has to do, or `null` once they are through
 * onboarding. Progress is derived from the player row rather than tracked
 * separately, so a half-finished signup resumes where it stopped.
 */
export function nextOnboardingStep(
  progress: OnboardingProgress,
): OnboardingStep | null {
  if (progress.onboardingCompletedAt) {
    return null;
  }

  if (!progress.goalKind) {
    return onboardingSteps[0];
  }

  if (progress.promptFrequency === null) {
    return onboardingSteps[1];
  }

  return onboardingSteps[2];
}
