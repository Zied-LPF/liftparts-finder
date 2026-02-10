import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Supplier } from "./suppliers";

let supabase: SupabaseClient | null = null;

function getSupabase() {
  if (typeof window === "undefined") return null;

  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn("Supabase env vars missing");
      return null;
    }

    supabase = createClient(url, key);
  }

  return supabase;
}

export async function searchParts(query: string, suppliers: Supplier[]) {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("parts")
    .select("*")
    .ilike("reference", `%${query}%`);

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}
