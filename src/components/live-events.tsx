"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { resizedStorageImage } from "@/lib/images";
import {
  formatEventDate,
  isEventPastByDate,
  resolveEventStatus,
  type EventStatus,
  type EventDatePrecision,
} from "@/lib/events";

// Live events grid — reads the SAME Supabase `events` table the old repo/admin
// writes to (query + past/upcoming split ported from the old EventsSection),
// restyled to the redesign card. Renders only the grid so it can drop into any
// existing section header. Graceful empty state (never "database not connected").
type EventRow = {
  id: string;
  title: string;
  date: string;
  location?: string | null;
  short_description?: string | null;
  description?: string | null;
  image_url?: string | null;
  link?: string | null;
  is_sold_out?: boolean | null;
  event_date_precision?: EventDatePrecision | null;
  event_status?: EventStatus | "past" | null;
};

const STATUS_PILL: Record<EventStatus, { label: string; bg: string; color: string; border: string }> = {
  available: { label: "Open", bg: "rgba(47,191,143,0.12)", color: "#2FBF8F", border: "rgba(47,191,143,0.4)" },
  coming_soon: { label: "Coming soon", bg: "rgba(232,185,35,0.12)", color: "#E8B923", border: "rgba(232,185,35,0.4)" },
  sold_out: { label: "Sold out", bg: "rgba(245,243,237,0.08)", color: "rgba(245,243,237,0.6)", border: "rgba(255,255,255,0.18)" },
  deadline_passed: { label: "Deadline passed", bg: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "rgba(245,158,11,0.4)" },
  completed: { label: "Completed", bg: "rgba(245,243,237,0.06)", color: "rgba(245,243,237,0.5)", border: "rgba(255,255,255,0.15)" },
};

function isPast(e: EventRow): boolean {
  if (resolveEventStatus(e) === "completed") return true;
  return isEventPastByDate(e.date, e.event_date_precision);
}

export function LiveEvents({ limit, showPastEvents = false }: { limit?: number; showPastEvents?: boolean }) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          if (active) { setEvents([]); setLoading(false); }
          return;
        }
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_active", true)
          .neq("is_published", false)
          .order("date", { ascending: true });
        if (!active) return;
        if (error || !data) {
          setEvents([]);
        } else {
          let rows = (data as EventRow[]).filter((e) => (showPastEvents ? isPast(e) : !isPast(e)));
          if (typeof limit === "number" && limit > 0) rows = rows.slice(0, limit);
          setEvents(rows);
        }
      } catch {
        if (active) setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [limit, showPastEvents]);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  };

  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: limit && limit < 3 ? limit : 3 }).map((_, i) => (
          <div key={i} className="animate-pulse" style={{ height: "360px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ border: "1px dashed rgba(255,255,255,0.16)", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "clamp(40px, 7vw, 64px) 28px", textAlign: "center" }}>
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(18px, 2.2vw, 22px)", color: "#F5F3ED", margin: "0 0 8px" }}>
          {showPastEvents ? "No past events yet" : "No upcoming events right now"}
        </h3>
        <p style={{ fontSize: "15px", color: "rgba(245,243,237,0.55)", margin: 0 }}>Check back soon for updates.</p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {events.map((event) => {
        const status = resolveEventStatus(event);
        const pill = STATUS_PILL[status];
        const img = event.image_url ? resizedStorageImage(event.image_url, 800) : undefined;
        const href = event.link || undefined;
        return (
          <div key={event.id} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", backgroundColor: "#0F1A15", display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg, #0F1A15 0%, #08110C 100%)" }}>
              {img ? (
                <img src={img} alt={event.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <img src="/leaf-icon.png" alt="" style={{ height: "44px", opacity: 0.35 }} />
                </div>
              )}
              <div style={{ position: "absolute", top: "12px", left: "12px", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", padding: "5px 10px", borderRadius: "999px", backgroundColor: pill.bg, color: pill.color, border: `1px solid ${pill.border}` }}>
                {pill.label}
              </div>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(245,243,237,0.45)", letterSpacing: "0.04em" }}>
                {formatEventDate(event.date, event.event_date_precision, { includeTime: true })}
              </div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "19px", margin: 0, lineHeight: 1.25, color: "#F5F3ED" }}>
                {event.title}
              </h3>
              {(event.short_description || event.description) && (
                <p style={{ fontSize: "14px", lineHeight: 1.55, color: "rgba(245,243,237,0.6)", margin: 0, flex: 1 }}>
                  {event.short_description || event.description}
                </p>
              )}
              {event.location && (
                <div style={{ fontSize: "13px", color: "rgba(245,243,237,0.45)" }}>{event.location}</div>
              )}
              {href && status === "available" && (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#E8B923", textDecoration: "none", fontWeight: 600, fontSize: "14px", marginTop: "6px" }}>
                  Register <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
