import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// The publishable key (starts with "sb_publishable_") is safe to use in the browser.
// Row Level Security still limits what each user can see.
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * "Local mode" keeps data in this browser only. It is used when Supabase
 * isn't set up yet, and by the Playwright tests.
 */
export const isLocalMode =
  process.env.NEXT_PUBLIC_USE_LOCAL_STORE === "1" || !url || !publishableKey;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !publishableKey) throw new Error("Supabase is not configured");
  if (!client) {
    client = createClient(url, publishableKey, {
      auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" },
    });
  }
  return client;
}
