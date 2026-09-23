import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Null when env vars are missing — shop falls back to hardcoded catalog in data.ts */
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
