"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ExternalLink,
  Share2,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { JoinCommunityDialog } from "@/components/join-community-dialog";
import { getSupabaseClient } from "@/lib/supabase";
import { resizedStorageImage } from "@/lib/images";
import {
  formatEventDate,
  formatEventTime,
  resolveEventStatus,
  type EventStatus,
  type EventDatePrecision,
} from "@/lib/events";

// Per-event detail page — ported from the old repo's app/events/[id]/page.tsx,
// restyled to the redesign theme. Fetches a single event by UUID from the same
// Supabase `events` table and shows hero / meta / description / register / share.
type EventRow = {
  id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  short_description?: string;
  full_description?: string;
  event_type?: "In-Person" | "Virtual";
  image_url?: string | null;
  link: string | null;
  is_active: boolean;
  is_published?: boolean;
  is_sold_out?: boolean;
  event_date_precision?: EventDatePrecision | null;
  event_status?: EventStatus | "past";
};

const STATUS_INFO: Record<EventStatus, { label: string; icon: typeof Sparkles; bg: string; color: string; border: string } | undefined> = {
  available: undefined,
  coming_soon: { label: "Coming soon", icon: Sparkles, bg: "rgba(232,185,35,0.12)", color: "#E8B923", border: "rgba(232,185,35,0.4)" },
  sold_out: { label: "Sold out", icon: XCircle, bg: "rgba(239,68,68,0.12)", color: "#F98080", border: "rgba(239,68,68,0.35)" },
  deadline_passed: { label: "Deadline reached", icon: AlertTriangle, bg: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "rgba(245,158,11,0.35)" },
  completed: { label: "Event completed", icon: CheckCircle2, bg: "rgba(245,243,237,0.06)", color: "rgba(245,243,237,0.6)", border: "rgba(255,255,255,0.15)" },
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Small, safe markdown → HTML renderer (escapes first, then applies syntax).
function renderMarkdown(md: string) {
  if (!md) return "";
  let s = escapeHtml(md);
  s = s.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>');
  s = s.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>');
  s = s.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gold underline hover:text-gold/80 transition-colors">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em class="italic">$1</em>');
  s = s.replace(/_([^_\n]+)_/g, '<em class="italic">$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1.5 py-0.5 text-sm font-mono text-gold">$1</code>');
  s = s.replace(/^[*-] (.+)$/gm, '<li class="ml-4">$1</li>');
  s = s.replace(/(<li class="ml-4">.+<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 my-3 text-white/85">$&</ul>');
  s = s.replace(/^(?:---|\*\*\*)$/gm, '<hr class="border-t border-white/20 my-6" />');
  const paragraphs = s.split(/\n\s*\n/).map((block) => {
    if (block.match(/^<(h[1-3]|ul|ol|hr)/)) return block;
    return `<p class="text-white/85 leading-relaxed mb-4">${block.replace(/\n/g, "<br/>")}</p>`;
  });
  return paragraphs.join("\n");
}

const metaIcon: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  display: "grid",
  placeItems: "center",
  backgroundColor: "rgba(232,185,35,0.1)",
  color: "#E8B923",
  flexShrink: 0,
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = params?.id as string | undefined;
    if (!id) return;
    let active = true;
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
        if (!active) return;
        if (error) {
          setEvent(null);
        } else if (data.is_published === false) {
          router.replace("/events");
        } else {
          setEvent(data as EventRow);
        }
      } catch {
        if (active) setEvent(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [params?.id, router]);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share && event) {
      navigator.share({ title: event.title, text: event.short_description || event.description || "", url: window.location.href }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className={`${PAGE_CONTAINER}`} style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div className="animate-spin" style={{ width: "44px", height: "44px", borderRadius: "999px", border: "2px solid rgba(232,185,35,0.25)", borderBottomColor: "#E8B923", margin: "0 auto" }} />
            <p style={{ marginTop: "16px", color: "rgba(245,243,237,0.7)" }}>Loading event…</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!event) {
    return (
      <PageShell>
        <div className={`${PAGE_CONTAINER}`} style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
          <div>
            <div style={{ width: "72px", height: "72px", borderRadius: "999px", display: "grid", placeItems: "center", margin: "0 auto 20px", background: "rgba(232,185,35,0.1)", border: "1px solid rgba(232,185,35,0.3)", color: "#E8B923" }}>
              <Calendar size={30} />
            </div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 36px)", color: "#F5F3ED", margin: "0 0 12px" }}>Event not found</h1>
            <p style={{ color: "rgba(245,243,237,0.6)", margin: "0 0 28px" }}>This event doesn&apos;t exist or may have been removed.</p>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)", color: "#0B1410", fontWeight: 700, padding: "13px 24px", borderRadius: "999px", textDecoration: "none" }}>
              <ArrowLeft size={16} /> Back to events
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const status = resolveEventStatus(event);
  const statusInfo = STATUS_INFO[status];
  const showRegistration = Boolean(event.link) && status === "available";
  const descSrc = event.full_description || event.short_description || event.description || "";

  return (
    <PageShell>
      {/* Top bar over hero */}
      <section style={{ position: "relative" }}>
        <div style={{ paddingTop: "24px", paddingBottom: "16px" }}>
          <div className={PAGE_CONTAINER} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 16px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.06)", color: "#F5F3ED", fontSize: "14px", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              <ArrowLeft size={15} /> All events
            </Link>
            <span style={{ padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, color: "#0B1410", background: event.event_type === "Virtual" ? "#2FBF8F" : "#E8B923" }}>
              {event.event_type || "In-Person"}
            </span>
          </div>
        </div>

        {/* Hero image — fully visible, not cropped */}
        <div className={PAGE_CONTAINER}>
          <div style={{ position: "relative", height: "clamp(180px, 30vh, 320px)", borderRadius: "16px", overflow: "hidden", background: "linear-gradient(135deg, #0F1A15 0%, #08110C 100%)", display: "grid", placeItems: "center" }}>
            {event.image_url ? (
              <img src={resizedStorageImage(event.image_url, 1000)} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <img src="/leaf-icon.png" alt="" style={{ height: "56px", opacity: 0.3 }} />
            )}
          </div>
        </div>
      </section>

      {/* Content card */}
      <section className={PAGE_CONTAINER} style={{ position: "relative", marginTop: "24px", paddingBottom: "clamp(48px, 8vw, 96px)", zIndex: 2 }}>
        <div style={{ maxWidth: "920px", margin: "0 auto", backgroundColor: "#0F1A15", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 48px rgba(0,0,0,0.45)", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "clamp(24px, 4vw, 44px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#F5F3ED", margin: "0 0 28px" }}>
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={metaIcon}><Calendar size={18} /></span>
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(245,243,237,0.5)" }}>Date</div>
                  <div style={{ color: "#F5F3ED", fontWeight: 500 }}>{mounted ? formatEventDate(event.date, event.event_date_precision, { includeWeekday: true }) : "…"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={metaIcon}><Clock size={18} /></span>
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(245,243,237,0.5)" }}>Time</div>
                  <div style={{ color: "#F5F3ED", fontWeight: 500 }}>{mounted ? formatEventTime(event.date, event.event_date_precision) : "--:--"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={metaIcon}><MapPin size={18} /></span>
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(245,243,237,0.5)" }}>Location</div>
                  <div style={{ color: "#F5F3ED", fontWeight: 500 }}>{event.location}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              {showRegistration ? (
                <a href={event.link!} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "9px", padding: "14px 26px", borderRadius: "999px", background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)", color: "#0B1410", fontWeight: 700, fontSize: "16px", textDecoration: "none", boxShadow: "0 6px 18px rgba(232,185,35,0.35)" }}>
                  Register now <ExternalLink size={18} />
                </a>
              ) : statusInfo ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", padding: "14px 24px", borderRadius: "999px", fontWeight: 600, fontSize: "15px", backgroundColor: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.border}` }}>
                  <statusInfo.icon size={18} /> {statusInfo.label}
                </div>
              ) : null}
              <button onClick={handleShare} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 22px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.06)", color: "#F5F3ED", fontWeight: 500, fontSize: "15px", border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: "clamp(24px, 4vw, 44px)" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "#F5F3ED", margin: "0 0 16px" }}>About this event</h2>
            {descSrc ? (
              <div style={{ fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(descSrc) }} />
            ) : (
              <p style={{ color: "rgba(245,243,237,0.5)", fontStyle: "italic" }}>No description available.</p>
            )}
          </div>

          {/* Join CTA */}
          <div style={{ padding: "clamp(24px, 4vw, 44px)", borderTop: "1px solid rgba(255,255,255,0.1)", background: "linear-gradient(90deg, rgba(47,191,143,0.08), transparent)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "#F5F3ED", margin: "0 0 4px" }}>Don&apos;t miss future events</h3>
              <p style={{ fontSize: "14px", color: "rgba(245,243,237,0.65)", margin: 0 }}>Join the LEAF community for early access and exclusive invites.</p>
            </div>
            <JoinCommunityDialog style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "999px", backgroundColor: "#1F6B4A", color: "#F5F3ED", fontWeight: 600, fontSize: "15px", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
              Join the community
            </JoinCommunityDialog>
          </div>
        </div>

        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#E8B923", fontWeight: 600, textDecoration: "none" }}>
            <ArrowLeft size={15} /> View all events
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
