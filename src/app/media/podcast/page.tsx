import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = {
  title: "Branching Out Podcast | LEAF Pathways",
  description: "Stories from founders, innovators, and LEAF community members.",
};

export default function Podcast() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Media"
        title={
          <>
            Branching Out <span style={{ color: "#E8B923" }}>Podcast</span>.
          </>
        }
        subtitle="Real stories from entrepreneurs, innovators and community members who are branching out and making an impact."
        back={{ href: "/media", label: "Back to Media" }}
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`} style={{ maxWidth: "900px" }}>
        <ComingSoon
          title="Episodes are coming soon"
          message="We're recording our first episodes now. They'll be available on Spotify, Apple Podcasts and YouTube — join the community to be notified when they land."
        />

        <div style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "clamp(28px, 5vw, 40px)", marginTop: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "22px", color: "#F5F3ED", margin: "0 0 14px" }}>About the podcast</h2>
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(245,243,237,0.68)", margin: 0 }}>
            Branching Out sits down with founders, innovators and members of the LEAF community to unpack the real,
            unfiltered stories behind their journeys — the pivots, the setbacks and the breakthroughs.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
