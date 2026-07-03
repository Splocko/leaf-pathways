import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About | LEAF Pathways",
  description:
    "Run by students, for students. LEAF Pathways is one of the UK's fastest-growing student communities across Law, Engineering/Tech and Finance.",
};

const sections = [
  {
    title: "Our mission",
    description: "What LEAF is, our vision, and the purpose that drives everything we do.",
    href: "/about/mission",
  },
  {
    title: "Meet the team",
    description: "The student-run team behind LEAF Pathways.",
    href: "/about/team",
  },
  {
    title: "Our impact",
    description: "The numbers behind the network — and the students behind the numbers.",
    href: "/about/impact",
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
        subtitle="Run by students, for students. LEAF Pathways is one of the UK's fastest-growing student communities — the home of opportunity for the next generation of young professionals."
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                backgroundColor: "#0F1A15",
                padding: "28px",
                textDecoration: "none",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#F5F3ED",
                  margin: "0 0 10px",
                }}
              >
                {section.title}
              </h3>
              <p
                style={{
                  fontSize: "14.5px",
                  lineHeight: 1.55,
                  color: "rgba(245,243,237,0.6)",
                  margin: 0,
                  flex: 1,
                }}
              >
                {section.description}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#E8B923",
                  fontWeight: 600,
                  fontSize: "14px",
                  marginTop: "20px",
                }}
              >
                Learn more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
