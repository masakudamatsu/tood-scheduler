import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * "Local mode" keeps data in this browser only. It is used when Supabase
 * isn't set up yet, and by the Playwright tests.
 */
export const isLocalMode =
  process.env.NEXT_PUBLIC_USE_LOCAL_STORE === "1" || !url || !anonKey;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" },
    });
  }
  return client;
}
