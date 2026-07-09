import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export const metadata = {
  title: "Page not found | LEAF Pathways",
};

export default function NotFound() {
  return (
    <PageShell>
      <div
        className={PAGE_CONTAINER}
        style={{ minHeight: "72vh", display: "grid", placeItems: "center", textAlign: "center", paddingTop: "96px", paddingBottom: "96px" }}
      >
        <div style={{ maxWidth: "560px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(72px, 16vw, 140px)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#E8B923",
              margin: 0,
            }}
          >
            404
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2FBF8F", margin: "8px 0 20px" }}>
            Page not found
          </div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F5F3ED", margin: "0 0 16px" }}>
            This one took a different <span style={{ color: "#E8B923" }}>pathway</span>.
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.6, color: "rgba(245,243,237,0.65)", margin: "0 0 32px" }}>
            The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)", color: "#0B1410", fontWeight: 700, fontSize: "15px", padding: "14px 26px", borderRadius: "999px", textDecoration: "none", boxShadow: "0 6px 18px rgba(232,185,35,0.35)" }}>
              <ArrowLeft size={16} /> Back home
            </Link>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(255,255,255,0.18)", color: "#F5F3ED", fontWeight: 600, fontSize: "15px", padding: "14px 24px", borderRadius: "999px", textDecoration: "none" }}>
              <Calendar size={16} /> Browse events
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
