import "server-only";

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }

  return value;
}

export function supabaseUrl() {
  return required("SUPABASE_URL", process.env.SUPABASE_URL);
}

export function supabaseSecretKey() {
  return required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);
}

export function sessionSecret() {
  return required("SESSION_SECRET", process.env.SESSION_SECRET);
}

/**
 * Optional: without it samples are still stored, they just stay unclonable and
 * the voice sits in `uploaded` until a key is configured.
 */
export function elevenLabsApiKey() {
  return process.env.ELEVENLABS_API_KEY ?? null;
}
