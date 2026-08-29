import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { sessionSecret } from "@/lib/supabase/env";

const COOKIE_NAME = "runaway_player";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function sign(playerId: string) {
  return createHmac("sha256", sessionSecret()).update(playerId).digest("base64url");
}

function verify(playerId: string, signature: string) {
  const expected = Buffer.from(sign(playerId));
  const received = Buffer.from(signature);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

/** Returns the player id from the signed cookie, or `null` if absent/tampered. */
export async function readPlayerId() {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;

  if (!cookie) {
    return null;
  }

  const separator = cookie.lastIndexOf(".");

  if (separator < 1) {
    return null;
  }

  const playerId = cookie.slice(0, separator);
  const signature = cookie.slice(separator + 1);

  return verify(playerId, signature) ? playerId : null;
}

export async function writePlayerSession(playerId: string) {
  (await cookies()).set(COOKIE_NAME, `${playerId}.${sign(playerId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearPlayerSession() {
  (await cookies()).delete(COOKIE_NAME);
}
