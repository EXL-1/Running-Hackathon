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

export const DEFAULT_RUN_LIMIT = 20;
export const MAX_RUN_LIMIT = 200;

export async function listRuns(playerId: string, limit = DEFAULT_RUN_LIMIT) {
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

/** Lifetime totals, so they stay correct beyond the runs listed on a page. */
export async function getRunTotals(playerId: string) {
  const supabase = createServiceClient();
  const { data, error, count } = await supabase
    .from("runs")
    .select("points", { count: "exact" })
    .eq("player_id", playerId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    runCount: count ?? data.length,
    totalPoints: data.reduce((total, row) => total + row.points, 0),
  };
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
