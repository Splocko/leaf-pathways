import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About | LEAF Pathways",
  description:
    "Run by students, for students. LEAF Pathways is one of the UK's fastest-growing student communities across Law, Engineering/Tech and Finance.",
};

const blocks = [
  {
    h: "What we do",
    p: "Through events, bootcamps, competitions and community, we connect driven students with the careers they've been working towards across Law, Engineering, Tech and Finance.",
  },
  {
    h: "Our vision",
    p: "A future where every young person has a competitive shot at success, regardless of their background. Where the brightest talent is discovered early, nurtured thoughtfully, and connected with opportunities that were once out of reach — because success is built together, not alone.",
  },
  {
    h: "Our purpose",
    p: "We exist to inspire youth early and democratise access to opportunity. Whether you're exploring a career path, preparing for an apprenticeship, sharpening your technical skills or building your network, LEAF provides the events, mentorship and community to help you thrive, so talent, not privilege, is what gets noticed.",
  },
];

export default function About() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About us"
        title={
          <>
            More than a network. A <span style={{ color: "#E8B923" }}>home for ambition</span>.
          </>
        }
        subtitle="Run by students, for students. LEAF Pathways is one of the UK's fastest-growing student communities: the home of opportunity for the next generation of young professionals."
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        <div style={{ maxWidth: "820px", display: "flex", flexDirection: "column", gap: "36px" }}>
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

          <div style={{ marginTop: "4px" }}>
            <Link
              href="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#F5F3ED",
                fontWeight: 600,
                fontSize: "14px",
                padding: "11px 20px",
                borderRadius: "999px",
                textDecoration: "none",
              }}
            >
              Explore our events <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
