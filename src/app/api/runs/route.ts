import type { NextRequest } from "next/server";
import * as z from "zod";

import { getCurrentPlayer } from "@/lib/player/current";
import { createRunSchema } from "@/lib/player/schemas";
import {
  createRun,
  DEFAULT_RUN_LIMIT,
  getRunTotals,
  listRuns,
  MAX_RUN_LIMIT,
} from "@/lib/runs/service";

const limitSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(MAX_RUN_LIMIT)
  .default(DEFAULT_RUN_LIMIT);

export async function GET(request: NextRequest) {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  const limit = limitSchema.safeParse(
    request.nextUrl.searchParams.get("limit") ?? undefined,
  );

  if (!limit.success) {
    return Response.json(
      { error: `limit must be an integer between 1 and ${MAX_RUN_LIMIT}.` },
      { status: 422 },
    );
  }

  const [runs, { runCount, totalPoints }] = await Promise.all([
    listRuns(player.id, limit.data),
    getRunTotals(player.id),
  ]);

  return Response.json({ runs, limit: limit.data, runCount, totalPoints });
}

export async function POST(request: NextRequest) {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  const parsed = createRunSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid run.", details: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  return Response.json({ run: await createRun(player.id, parsed.data) }, { status: 201 });
}
