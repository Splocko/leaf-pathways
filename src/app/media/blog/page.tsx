import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { BlogList } from "@/components/blog-list";
import { getPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | LEAF Pathways",
  description: "Monthly newsletters, career insights, industry news and community updates.",
};

// Reads live posts from Supabase (blog_posts) server-side, then hands off to the
// client BlogList for featured / category filter / search / grid.
export default async function Blog() {
  const posts = await getPosts();

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
        <BlogList posts={posts} />
      </section>
    </PageShell>
  );
}
