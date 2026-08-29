import type { Metadata } from "next";
import Link from "next/link";

import { LogRunForm } from "@/components/runs/log-run-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPace } from "@/lib/onboarding/pace";
import { switchPlayer } from "@/lib/player/actions";
import { requireOnboardedPlayer } from "@/lib/player/current";
import { listRuns } from "@/lib/runs/service";
import { listVoices } from "@/lib/voice/service";

const goalLabels = {
  increase_pace: "Getting faster",
  target_pace: "Training for a pace",
} as const;

export const metadata: Metadata = {
  title: "Your runs — Runaway",
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
}

export default async function DashboardPage() {
  const player = await requireOnboardedPlayer();
  const [runs, voices] = await Promise.all([
    listRuns(player.id),
    listVoices(player.id),
  ]);
  const totalPoints = runs.reduce((total, run) => total + run.points, 0);
  const activeVoice = voices.find((voice) => voice.isActive);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{player.username}</h1>
          <p className="text-muted-foreground text-sm">
            {runs.length} run{runs.length === 1 ? "" : "s"} · {totalPoints}{" "}
            points
          </p>
        </div>
        <form action={switchPlayer}>
          <Button type="submit" variant="outline">
            Switch player
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your setup</CardTitle>
          <CardDescription>
            Change any of it by walking through{" "}
            <Link href="/onboarding/goal" className="underline">
              setup
            </Link>{" "}
            again.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-xs">Goal</p>
            <p>
              {player.goalKind ? goalLabels[player.goalKind] : "—"}
              {player.targetPaceSPerKm
                ? ` · ${formatPace(player.targetPaceSPerKm)}/km`
                : ""}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Prompts</p>
            <p>{player.promptFrequency ?? "—"} of 5</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Voice</p>
            <p>{activeVoice ? activeVoice.label : "None yet"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log a run</CardTitle>
          <CardDescription>
            Points are worked out on the server from your distance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogRunForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent runs</CardTitle>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No runs yet. Log your first one above.
            </p>
          ) : (
            <ul className="divide-border divide-y">
              {runs.map((run) => (
                <li
                  key={run.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="capitalize">{run.mode}</span>
                  <span className="text-muted-foreground">
                    {(run.distanceM / 1000).toFixed(2)} km ·{" "}
                    {formatDuration(run.durationS)} · {run.points} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
