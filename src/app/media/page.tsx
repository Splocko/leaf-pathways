import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { BookOpen, Video, Radio, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Media Hub | LEAF Pathways",
  description: "Explore LEAF's blog, webinar series, and podcast.",
};

const mediaTypes = [
  {
    icon: BookOpen,
    title: "Blog",
    description: "Newsletters, community spotlights and in-depth case studies.",
    href: "/media/blog",
    action: "Read the blog",
  },
  {
    icon: Video,
    title: "Pathways Webinar Series",
    description: "Live and recorded webinars featuring industry experts and mentors.",
    href: "/media/webinars",
    action: "Watch webinars",
  },
  {
    icon: Radio,
    title: "Branching Out Podcast",
    description: "Stories from founders, innovators and LEAF community members.",
    href: "/media/podcast",
    action: "Listen now",
  },
];

export default function Media() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Media"
        title={
          <>
            The LEAF <span style={{ color: "#E8B923" }}>media hub</span>.
          </>
        }
        subtitle="Stories, insights and learning from across the LEAF community."
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaTypes.map((media) => {
            const Icon = media.icon;
            return (
              <Link
                key={media.href}
                href={media.href}
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
                <span style={{ width: "44px", height: "44px", borderRadius: "10px", display: "grid", placeItems: "center", backgroundColor: "rgba(47,191,143,0.1)", border: "1px solid rgba(47,191,143,0.25)", color: "#2FBF8F", marginBottom: "18px" }}>
                  <Icon size={20} />
                </span>
                <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "20px", color: "#F5F3ED", margin: "0 0 10px" }}>
                  {media.title}
                </h3>
                <p style={{ fontSize: "14.5px", lineHeight: 1.55, color: "rgba(245,243,237,0.6)", margin: 0, flex: 1 }}>
                  {media.description}
                </p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#E8B923", fontWeight: 600, fontSize: "14px", marginTop: "20px" }}>
                  {media.action} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
