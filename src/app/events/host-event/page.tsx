import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata = {
  title: "Host an Event with LEAF | LEAF Pathways",
  description: "Partner with LEAF to create a transformative event for your organization.",
};

const offer = [
  "Reach thousands of ambitious students across Law, Engineering, Tech and Finance.",
  "End-to-end logistics: promotion, registration, venue and on-the-day delivery.",
  "Warm introductions to the talent most relevant to your organisation.",
  "Formats from intimate workshops to large-scale competitions and hackathons.",
];

export default function HostEvent() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Partnerships"
        title={
          <>
            Host an <span style={{ color: "#E8B923" }}>event</span> with LEAF.
          </>
        }
        subtitle="Reach thousands of ambitious students across the UK. We handle the logistics — you focus on the impact."
        back={{ href: "/events", label: "Back to events" }}
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`} style={{ maxWidth: "860px" }}>
        <p style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(245,243,237,0.72)", margin: "0 0 32px" }}>
          Want to reach talented, driven students? Partner with LEAF to host a workshop, careers talk,
          competition or hackathon. We&apos;ll bring the community and run the operation, so your team can
          focus on creating a genuinely valuable experience.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
          {offer.map((item) => (
            <div key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, width: "24px", height: "24px", borderRadius: "999px", display: "grid", placeItems: "center", backgroundColor: "rgba(47,191,143,0.12)", color: "#2FBF8F", marginTop: "1px" }}>
                <Check size={14} />
              </span>
              <span style={{ fontSize: "16px", lineHeight: 1.6, color: "rgba(245,243,237,0.8)" }}>{item}</span>
            </div>
          ))}
        </div>

        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)",
            color: "#0B1410",
            fontWeight: 700,
            fontSize: "15px",
            padding: "15px 28px",
            borderRadius: "999px",
            textDecoration: "none",
            boxShadow: "0 6px 18px rgba(232,185,35,0.35)",
          }}
        >
          Get in touch <ArrowRight size={16} />
        </Link>
      </section>
    </PageShell>
  );
}
