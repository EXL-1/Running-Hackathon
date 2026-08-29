import { getCurrentPlayer } from "@/lib/player/current";

export async function GET() {
  const player = await getCurrentPlayer();

  if (!player) {
    return Response.json({ error: "No player selected." }, { status: 401 });
  }

  return Response.json({ player });
}
