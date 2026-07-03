import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Mission | LEAF Pathways",
  description: "LEAF's mission, vision, and the purpose that drives everything we do.",
};

const blocks = [
  {
    h: "What we do",
    p: "LEAF Pathways is one of the UK's fastest-growing student communities — the home of opportunity for the next generation of ambitious young professionals. Through events, bootcamps, competitions and community, we connect driven students with the careers they've been working towards across Law, Engineering, Tech and Finance.",
  },
  {
    h: "Our vision",
    p: "A future where every young person has a competitive shot at success, regardless of their background. Where the brightest talent is discovered early, nurtured thoughtfully, and connected with opportunities that were once out of reach — because success is built together, not alone.",
  },
  {
    h: "Our purpose",
    p: "We exist to inspire youth early and democratise access to opportunity. Whether you're exploring a career path, preparing for an apprenticeship, sharpening your technical skills or building your network, LEAF provides the events, mentorship and community to help you thrive — so talent, not privilege, is what gets noticed.",
  },
];

export default function Mission() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About us"
        title={
          <>
            Our <span style={{ color: "#E8B923" }}>mission</span> &amp; vision.
          </>
        }
        subtitle="Inspiring youth early, so every young person has a competitive shot at success — regardless of their background."
        back={{ href: "/about", label: "Back to About" }}
      />

      <section className={`${PAGE_CONTAINER} pb-16 md:pb-24`} style={{ maxWidth: "860px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {blocks.map((b) => (
            <div key={b.h}>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 2.4vw, 28px)",
                  color: "#F5F3ED",
                  margin: "0 0 12px",
                  letterSpacing: "-0.01em",
                }}
              >
                {b.h}
              </h2>
              <p style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(245,243,237,0.72)", margin: 0 }}>
                {b.p}
              </p>
            </div>
          ))}

          <div
            style={{
              border: "1px solid rgba(232,185,35,0.3)",
              backgroundColor: "rgba(232,185,35,0.06)",
              borderRadius: "12px",
              padding: "28px 32px",
              marginTop: "8px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "20px",
                color: "#F5F3ED",
                margin: 0,
              }}
            >
              "Success is built together, not alone."
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "8px" }}>
            <Link
              href="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)",
                color: "#0B1410",
                fontWeight: 700,
                fontSize: "15px",
                padding: "14px 26px",
                borderRadius: "999px",
                textDecoration: "none",
                boxShadow: "0 6px 18px rgba(232,185,35,0.35)",
              }}
            >
              Explore our events <ArrowRight size={16} />
            </Link>
            <Link
              href="/about/team"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#F5F3ED",
                fontWeight: 600,
                fontSize: "15px",
                padding: "14px 24px",
                borderRadius: "999px",
                textDecoration: "none",
              }}
            >
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
