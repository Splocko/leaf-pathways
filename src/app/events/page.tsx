import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";
import { getEventProgrammes, type EventProgramme } from "@/lib/events";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Events | LEAF Pathways",
  description: "Explore LEAF's competitions, bootcamps and hackathons across Law, Engineering, Tech and Finance.",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fontSize: "clamp(24px, 3vw, 32px)",
  color: "#F5F3ED",
  margin: "0 0 24px",
  letterSpacing: "-0.01em",
};

function ProgrammeCard({ programme }: { programme: EventProgramme }) {
  const href = `/events/${programme.slug}`;
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", backgroundColor: "#0F1A15", display: "flex", flexDirection: "column", height: "100%" }}>
      <Link href={href} style={{ position: "relative", aspectRatio: "16/9", display: "block", textDecoration: "none", overflow: "hidden", background: "linear-gradient(135deg, #0F1A15 0%, #08110C 100%)" }}>
        {programme.image ? (
          <img src={programme.image} alt={programme.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <img src="/leaf-icon.png" alt="" style={{ height: "44px", width: "auto", opacity: 0.35 }} />
          </div>
        )}
      </Link>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#2FBF8F", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {programme.category}
        </div>
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "19px", margin: 0, lineHeight: 1.25 }}>
          <Link href={href} style={{ color: "inherit", textDecoration: "none" }}>{programme.title}</Link>
        </h3>
        <p style={{ fontSize: "14px", lineHeight: 1.55, color: "rgba(245,243,237,0.6)", margin: 0, flex: 1 }}>
          {programme.summary}
        </p>
        <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#E8B923", textDecoration: "none", fontWeight: 600, fontSize: "14px", marginTop: "6px" }}>
          Learn more <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function Events() {
  const programmes = getEventProgrammes();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Events"
        title={
          <>
            Our <span style={{ color: "#E8B923" }}>events</span>.
          </>
        }
        subtitle="Workshops, networking evenings, competitions and bootcamps across Law, Engineering, Tech and Finance."
      />

      {/* Calendar — under construction */}
      <section className={`${PAGE_CONTAINER} pb-14 md:pb-20`}>
        <h2 style={sectionHeading}>What&apos;s coming up</h2>
        <ComingSoon
          eyebrow="Under construction"
          title="Our events calendar is being rebuilt"
          message="We're doing some work behind the scenes. Join the community and we'll let you know the moment events go live again."
        />
      </section>

      {/* Programmes we run — evergreen navigation to each detail page */}
      <section className={`${PAGE_CONTAINER} pb-16 md:pb-24`}>
        <h2 style={sectionHeading}>What we run</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {programmes.map((programme) => (
            <ProgrammeCard key={programme.slug} programme={programme} />
          ))}
        </div>
      </section>

      {/* Host an event CTA */}
      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        <div style={{ border: "1px solid rgba(232,185,35,0.3)", backgroundColor: "rgba(232,185,35,0.06)", borderRadius: "12px", padding: "clamp(28px, 5vw, 44px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ maxWidth: "560px" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(22px, 2.6vw, 28px)", color: "#F5F3ED", margin: "0 0 10px" }}>
              Want to host an event with us?
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "rgba(245,243,237,0.68)", margin: 0 }}>
              Partner with LEAF to reach thousands of ambitious students. We handle the logistics — you focus on the impact.
            </p>
          </div>
          <Link href="/events/host-event" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)", color: "#0B1410", fontWeight: 700, fontSize: "15px", padding: "14px 26px", borderRadius: "999px", textDecoration: "none", boxShadow: "0 6px 18px rgba(232,185,35,0.35)", flexShrink: 0 }}>
            Host an event <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
