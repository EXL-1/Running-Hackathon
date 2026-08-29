import "server-only";

import type { CreateRunInput } from "@/lib/player/schemas";
import type { RunMode } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/server";

export type Run = {
  id: string;
  mode: RunMode;
  distanceM: number;
  durationS: number;
  points: number;
  startedAt: string;
};

type RunRow = {
  id: string;
  mode: RunMode;
  distance_m: number;
  duration_s: number;
  points: number;
  started_at: string;
};

const RUN_COLUMNS = "id, mode, distance_m, duration_s, points, started_at";

function toRun(row: RunRow): Run {
  return {
    id: row.id,
    mode: row.mode,
    distanceM: row.distance_m,
    durationS: row.duration_s,
    points: row.points,
    startedAt: row.started_at,
  };
}

/** Points are derived server-side so a client can't award itself any. */
export function pointsForRun(input: Pick<CreateRunInput, "distanceM">) {
  return Math.round(input.distanceM / 100);
}

export async function listRuns(playerId: string, limit = 20) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("runs")
    .select(RUN_COLUMNS)
    .eq("player_id", playerId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(toRun);
}

export async function createRun(playerId: string, input: CreateRunInput) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("runs")
    .insert({
      player_id: playerId,
      mode: input.mode,
      distance_m: input.distanceM,
      duration_s: input.durationS,
      points: pointsForRun(input),
      started_at: input.startedAt ?? new Date().toISOString(),
    })
    .select(RUN_COLUMNS)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not save run.");
  }

  return toRun(data);
}
