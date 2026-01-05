// lib/supabase/admin.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing ${name}`);
  return v.trim();
}

/**
 * Lazy init so build doesn't crash when env vars aren't present.
 * Only runs when a request actually calls it.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  // Use whichever you store in Vercel. Common patterns:
  // - NEXT_PUBLIC_SUPABASE_URL
  // - SUPABASE_URL
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();

  if (!url) throw new Error("supabaseUrl is required (set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL)");

  // Use your service role key env name (pick one and stick to it)
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim();

  if (!serviceKey) throw new Error("supabase service role key is required (set SUPABASE_SERVICE_ROLE_KEY)");

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return cached;
}
