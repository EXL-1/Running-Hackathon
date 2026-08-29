import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

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

/** `<playerId>.<hmac>`, used both as the cookie value and as the bearer token. */
export function createPlayerToken(playerId: string) {
  return `${playerId}.${sign(playerId)}`;
}

function playerIdFromToken(token: string) {
  const separator = token.lastIndexOf(".");

  if (separator < 1) {
    return null;
  }

  const playerId = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  return verify(playerId, signature) ? playerId : null;
}

/**
 * The player id proven by this request, or `null` if absent/tampered.
 *
 * Browsers send the signed cookie; the native app has no cookie jar and sends
 * the same token as `Authorization: Bearer`. The bearer header wins so a phone
 * is never mistaken for whoever last used the browser.
 */
export async function readPlayerId() {
  const authorization = (await headers()).get("authorization");
  const bearer = authorization?.match(/^Bearer (.+)$/i)?.[1];

  if (bearer) {
    return playerIdFromToken(bearer.trim());
  }

  const cookie = (await cookies()).get(COOKIE_NAME)?.value;

  return cookie ? playerIdFromToken(cookie) : null;
}

export async function writePlayerSession(playerId: string) {
  (await cookies()).set(COOKIE_NAME, createPlayerToken(playerId), {
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
