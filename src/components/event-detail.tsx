import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { JoinCommunityDialog } from "@/components/join-community-dialog";
import { ComingSoon } from "@/components/coming-soon";
import type { EventProgramme } from "@/lib/events";
import type { ReactNode } from "react";

// 16/9 event image. Pulls from the DB-provided URL; falls back to a branded
// tile when there's no image yet (replaces the old grey "[Event image]" box).
function EventImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16/9",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        marginBottom: "32px",
        background: "linear-gradient(135deg, #0F1A15 0%, #08110C 100%)",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <img src="/leaf-icon.png" alt="" style={{ height: "56px", width: "auto", opacity: 0.35 }} />
        </div>
      )}
    </div>
  );
}

// Shared layout for every /events/* detail page, so they all match the site
// width, background and styling. Pass `children` for a page with full content;
// omit it to render a clean coming-soon body from the programme summary.
export function EventDetailShell({
  programme,
  children,
  registerLabel = "Register interest",
}: {
  programme: EventProgramme;
  children?: ReactNode;
  registerLabel?: string;
}) {
  return (
    <PageShell>
      <div
        className={`${PAGE_CONTAINER} pt-28 md:pt-36 pb-20 md:pb-28`}
        style={{ maxWidth: "920px" }}
      >
        <Link
          href="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(245,243,237,0.6)",
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={15} /> Back to events
        </Link>

        <EventImage src={programme.image} alt={programme.title} />

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#2FBF8F",
            marginBottom: "14px",
          }}
        >
          {programme.category}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(34px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "#F5F3ED",
          }}
        >
          {programme.title}
        </h1>

        <div style={{ marginTop: "28px" }}>
          {children ?? (
            <ComingSoon
              title="Full details coming soon"
              message={`${programme.summary} Dates, format and how to apply will be announced here — register your interest to be the first to know.`}
            />
          )}
        </div>

        <div style={{ marginTop: "36px" }}>
          <JoinCommunityDialog
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)",
              color: "#0B1410",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "15px",
              padding: "15px 28px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(232,185,35,0.35)",
            }}
          >
            {registerLabel}
          </JoinCommunityDialog>
        </div>
      </div>
    </PageShell>
  );
}
