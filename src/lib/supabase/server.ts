import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { supabaseSecretKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * The only Supabase client in the app. It uses the secret key, so it bypasses
 * Row Level Security and must never be imported from a Client Component.
 * Callers are responsible for scoping queries to the current player.
 *
 * When accounts are added, a second cookie-based client (`@supabase/ssr`) can
 * be introduced for user-scoped reads while this one stays for admin work.
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(supabaseUrl(), supabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
