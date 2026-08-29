import type { NextRequest } from "next/server";
import * as z from "zod";

import { getCurrentPlayer } from "@/lib/player/current";
import { createRunSchema } from "@/lib/player/schemas";
import { createRun, listRuns } from "@/lib/runs/service";

export async function GET() {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  return Response.json({ runs: await listRuns(player.id) });
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
