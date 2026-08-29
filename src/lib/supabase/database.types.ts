/**
 * Types for the tables in `supabase/migrations`.
 *
 * Regenerate after changing the schema:
 * `npx supabase gen types typescript --project-id <ref> --schema public > src/lib/supabase/database.types.ts`
 */
export type RunMode = "chase" | "cheer";
export type GoalKind = "increase_pace" | "target_pace";
export type VoiceStatus = "uploaded" | "cloning" | "ready" | "failed";
export type VoiceSentiment = "love" | "hate";

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
          goal_kind: GoalKind | null;
          target_pace_s_per_km: number | null;
          prompt_frequency: number | null;
          onboarding_completed_at: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          display_name?: string | null;
          auth_user_id?: string | null;
          last_seen_at?: string;
          goal_kind?: GoalKind | null;
          target_pace_s_per_km?: number | null;
          prompt_frequency?: number | null;
          onboarding_completed_at?: string | null;
        };
        Update: {
          display_name?: string | null;
          auth_user_id?: string | null;
          last_seen_at?: string;
          goal_kind?: GoalKind | null;
          target_pace_s_per_km?: number | null;
          prompt_frequency?: number | null;
          onboarding_completed_at?: string | null;
        };
        Relationships: [];
      };
      player_voices: {
        Row: {
          id: string;
          player_id: string;
          label: string;
          sentiment: VoiceSentiment;
          sample_path: string;
          elevenlabs_voice_id: string | null;
          status: VoiceStatus;
          error_message: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          label: string;
          sentiment: VoiceSentiment;
          sample_path: string;
          elevenlabs_voice_id?: string | null;
          status?: VoiceStatus;
          error_message?: string | null;
          is_active?: boolean;
        };
        Update: {
          label?: string;
          sentiment?: VoiceSentiment;
          elevenlabs_voice_id?: string | null;
          status?: VoiceStatus;
          error_message?: string | null;
          is_active?: boolean;
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
      goal_kind: GoalKind;
      voice_status: VoiceStatus;
      voice_sentiment: VoiceSentiment;
    };
    CompositeTypes: Record<never, never>;
  };
};
