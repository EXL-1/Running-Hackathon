import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { onboardingSteps, type OnboardingStep } from "@/lib/onboarding/steps";

type OnboardingShellProps = {
  slug: OnboardingStep["slug"];
  title: string;
  description: ReactNode;
  children: ReactNode;
};

export function OnboardingShell({
  slug,
  title,
  description,
  children,
}: OnboardingShellProps) {
  const index = onboardingSteps.findIndex((step) => step.slug === slug);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Step {index + 1} of {onboardingSteps.length} ·{" "}
          {onboardingSteps[index].title}
        </p>
        <Progress value={((index + 1) / onboardingSteps.length) * 100} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
