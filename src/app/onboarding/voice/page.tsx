import type { Metadata } from "next";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { VoiceSampleHelp } from "@/components/onboarding/voice-sample-help";
import { VoiceUploadForm } from "@/components/onboarding/voice-upload-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { chooseVoice, finishOnboarding } from "@/lib/onboarding/actions";
import { requirePlayer } from "@/lib/player/current";
import type { VoiceStatus } from "@/lib/supabase/database.types";
import { listVoices } from "@/lib/voice/service";

export const metadata: Metadata = {
  title: "Voice — Runaway",
};

const statusLabels: Record<VoiceStatus, string> = {
  uploaded: "Saved, not cloned yet",
  cloning: "Cloning…",
  ready: "Ready",
  failed: "Cloning failed",
};

export default async function VoicePage() {
  const player = await requirePlayer();
  const voices = await listVoices(player.id);

  return (
    <OnboardingShell
      slug="voice"
      title="Whose voice do you want in your ear?"
      description="Upload a clip of someone you love — or someone you'd run away from. We rebuild their voice and it does the coaching."
    >
      <div className="flex flex-col gap-6">
        <VoiceSampleHelp />

        <Separator />

        <VoiceUploadForm />

        {voices.length > 0 ? (
          <>
            <Separator />
            <ul className="divide-border divide-y">
              {voices.map((voice) => (
                <li
                  key={voice.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{voice.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {voice.sentiment === "love" ? "Loved" : "Hated"} ·{" "}
                      {statusLabels[voice.status]}
                      {voice.errorMessage ? ` · ${voice.errorMessage}` : ""}
                    </p>
                  </div>
                  {voice.isActive ? (
                    <Badge>Using this one</Badge>
                  ) : (
                    <form action={chooseVoice}>
                      <input type="hidden" name="voiceId" value={voice.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Use this voice
                      </Button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <form action={finishOnboarding}>
          <Button type="submit" className="w-full" variant={voices.length > 0 ? "default" : "outline"}>
            {voices.length > 0 ? "Finish" : "Skip for now"}
          </Button>
        </form>
      </div>
    </OnboardingShell>
  );
}
