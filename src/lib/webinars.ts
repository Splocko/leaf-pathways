// Webinars data layer. Reads published rows from the same Supabase `webinars`
// table the old repo's admin CMS manages.

import { createClient } from "@supabase/supabase-js";
import { resizedStorageImage } from "@/lib/images";

export type Webinar = {
  id: string;
  title: string;
  description: string | null;
  speaker_name: string | null;
  speaker_title: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  topic: string | null;
  webinar_date: string | null;
};

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function webinarThumb(url: string | null): string | undefined {
  return url ? resizedStorageImage(url, 800) : undefined;
}

export async function getWebinars(): Promise<Webinar[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("webinars")
      .select("*")
      .eq("is_published", true)
      .order("webinar_date", { ascending: false });
    if (error || !data) return [];
    return data as Webinar[];
  } catch {
    return [];
  }
}
