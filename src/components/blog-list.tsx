"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Search, ArrowRight, User } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

// Client-side blog listing: featured post + category filter + search + grid.
// Ported in structure from the old repo's blog page, restyled to the redesign
// theme. Fed by the server page's getPosts() so it reads the live blog_posts.

function Cover({ post, minHeight }: { post: BlogPost; minHeight: string }) {
  return (
    <div style={{ minHeight, height: "100%", background: "linear-gradient(135deg, #0F1A15 0%, #08110C 100%)", display: "grid", placeItems: "center", overflow: "hidden" }}>
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "72px", color: "rgba(232,185,35,0.18)", userSelect: "none" }}>
          {post.title.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return posts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Search */}
      <div style={{ position: "relative", maxWidth: "480px", marginBottom: "18px" }}>
        <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(245,243,237,0.4)" }} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts…"
          style={{ width: "100%", backgroundColor: "#0F1A15", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", padding: "12px 18px 12px 42px", color: "#F5F3ED", fontSize: "14px", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
        />
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 15px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  border: active ? "1px solid #E8B923" : "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: active ? "#E8B923" : "rgba(255,255,255,0.03)",
                  color: active ? "#0B1410" : "rgba(245,243,237,0.7)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ border: "1px dashed rgba(255,255,255,0.16)", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "clamp(40px, 7vw, 64px) 28px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(18px, 2.2vw, 22px)", color: "#F5F3ED", margin: "0 0 8px" }}>No posts yet</h3>
          <p style={{ fontSize: "15px", color: "rgba(245,243,237,0.55)", margin: 0 }}>Check back soon — we publish monthly newsletters and career insights.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <Link href={`/media/blog/${featured.slug}`} className="group" style={{ display: "block", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflow: "hidden", backgroundColor: "#0F1A15", marginBottom: "28px" }}>
              <div className="grid md:grid-cols-2">
                <div style={{ order: 2 }} className="md:order-2">
                  <Cover post={featured} minHeight="240px" />
                </div>
                <div className="md:order-1" style={{ padding: "clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "999px", backgroundColor: "rgba(232,185,35,0.14)", color: "#E8B923", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(232,185,35,0.25)" }}>Featured</span>
                    <span style={{ padding: "4px 12px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(245,243,237,0.6)", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>{featured.category}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.15, color: "#F5F3ED", margin: "0 0 14px", letterSpacing: "-0.01em" }}>{featured.title}</h2>
                  {featured.excerpt && <p style={{ fontSize: "16px", lineHeight: 1.6, color: "rgba(245,243,237,0.6)", margin: "0 0 20px" }}>{featured.excerpt}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "rgba(245,243,237,0.45)", marginBottom: "20px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><User size={13} /> {featured.author}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Calendar size={13} /> {featured.date}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Clock size={13} /> {featured.readTime}</span>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#E8B923", fontWeight: 600, fontSize: "14px" }}>Read post <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/media/blog/${post.slug}`} className="group" style={{ display: "flex", flexDirection: "column", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflow: "hidden", backgroundColor: "#0F1A15", height: "100%" }}>
                  <div style={{ position: "relative", height: "180px" }}>
                    <Cover post={post} minHeight="180px" />
                    <span style={{ position: "absolute", top: "12px", left: "12px", padding: "4px 10px", borderRadius: "999px", backgroundColor: "rgba(0,0,0,0.5)", color: "#E8B923", fontSize: "11px", fontWeight: 600, border: "1px solid rgba(232,185,35,0.25)" }}>{post.category}</span>
                  </div>
                  <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "18px", lineHeight: 1.3, color: "#F5F3ED", margin: 0 }}>{post.title}</h3>
                    {post.excerpt && <p style={{ fontSize: "14px", lineHeight: 1.55, color: "rgba(245,243,237,0.6)", margin: 0, flex: 1 }}>{post.excerpt}</p>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "12.5px", color: "rgba(245,243,237,0.4)" }}>
                      <span>{post.date} · {post.readTime}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#E8B923", fontWeight: 600 }}>Read <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
