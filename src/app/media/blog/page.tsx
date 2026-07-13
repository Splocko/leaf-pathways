import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const metadata = {
  title: "Blog | LEAF Pathways",
  description: "Monthly newsletters, career insights, industry news and community updates.",
};

export default function Blog() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Media"
        title={
          <>
            The LEAF <span style={{ color: "#E8B923" }}>blog</span>.
          </>
        }
        subtitle="Monthly newsletters, career insights, industry news and community updates — curated for driven young professionals."
        back={{ href: "/media", label: "Back to Media" }}
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <ComingSoon
            eyebrow="Under construction"
            title="The blog is being rebuilt"
            message="We're doing some work behind the scenes. Join the community below and we'll let you know the moment new posts go live."
          />
        </div>
      </section>
    </PageShell>
  );
}
