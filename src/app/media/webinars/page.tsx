import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = {
  title: "Pathways Webinar Series | LEAF Pathways",
  description: "Watch upcoming and past webinars with industry experts and mentors.",
};

export default function Webinars() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Media"
        title={
          <>
            Pathways <span style={{ color: "#E8B923" }}>Webinar Series</span>.
          </>
        }
        subtitle="Learn from industry experts, founders and leaders — free for LEAF members."
        back={{ href: "/media", label: "Back to Media" }}
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <ComingSoon
            title="Our first webinars are on the way"
            message="We're lining up sessions with industry professionals, founders and mentors. Join the community to be notified the moment new webinars drop."
          />
          <div style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "clamp(28px, 5vw, 40px)", marginTop: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "22px", color: "#F5F3ED", margin: "0 0 14px" }}>About the series</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(245,243,237,0.68)", margin: "0 0 14px" }}>
              The Pathways Webinar Series brings together industry professionals, experienced founders and thought leaders to share their insight with the LEAF community.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(245,243,237,0.68)", margin: 0 }}>
              Whether you&apos;re exploring a career, launching a business or developing new skills, our webinars offer valuable knowledge and networking — all free for LEAF members.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
