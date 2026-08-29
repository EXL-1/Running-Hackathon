/**
 * Types for the tables in `supabase/migrations`.
 *
 * Regenerate after changing the schema:
 * `npx supabase gen types typescript --project-id <ref> --schema public > src/lib/supabase/database.types.ts`
 */
export type RunMode = "chase" | "cheer";

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          auth_user_id: string | null;
          created_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name?: string | null;
          auth_user_id?: string | null;
          last_seen_at?: string;
        };
        Update: {
          display_name?: string | null;
          auth_user_id?: string | null;
          last_seen_at?: string;
        };
        Relationships: [];
      };
      runs: {
        Row: {
          id: string;
          player_id: string;
          mode: RunMode;
          distance_m: number;
          duration_s: number;
          points: number;
          started_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          mode: RunMode;
          distance_m: number;
          duration_s: number;
          points?: number;
          started_at?: string;
        };
        Update: {
          mode?: RunMode;
          distance_m?: number;
          duration_s?: number;
          points?: number;
          started_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      run_mode: RunMode;
    };
    CompositeTypes: Record<never, never>;
  };
};
