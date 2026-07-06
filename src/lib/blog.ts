// Blog data layer. Reads published posts from the SAME Supabase `blog_posts`
// table the old repo's admin CMS (TipTap) writes to. Returns the shape the
// public blog pages expect; renders empty state gracefully when unconfigured.

import { createClient } from "@supabase/supabase-js";
import { resizedStorageImage } from "@/lib/images";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  coverImage?: string;
  /** Rendered post body (HTML from TipTap) — used by the [slug] page. */
  body?: string;
};

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function estimateReadTime(content: string | null): string {
  if (!content) return "1 min read";
  const text = content.replace(/<[^>]+>/g, "");
  const minutes = Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
  return `${minutes} min read`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function mapPost(row: any): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    author: row.author_name || "LEAF Pathways",
    date: formatDate(row.published_at || row.created_at),
    readTime: estimateReadTime(row.content),
    category: row.category || "General",
    coverImage: row.cover_image_url
      ? resizedStorageImage(row.cover_image_url, 1200)
      : undefined,
    body: row.content || undefined,
  };
}

export async function getPosts(): Promise<BlogPost[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data.map(mapPost);
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (error || !data) return null;
    return mapPost(data);
  } catch {
    return null;
  }
}
