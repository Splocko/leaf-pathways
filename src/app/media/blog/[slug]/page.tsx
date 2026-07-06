import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { ContentUnavailable } from "@/components/content-unavailable";
import { getPost } from "@/lib/blog";

export const metadata = {
  title: "Blog | LEAF Pathways",
  description: "Read the latest from the LEAF community.",
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Media"
          title="Post not available"
          subtitle="This article isn't available yet."
          back={{ href: "/media/blog", label: "Back to the blog" }}
        />
        <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
          <ContentUnavailable
            eyebrow="Not found"
            title="This post isn't available"
            message="It may have been moved or isn't published yet. Head back to the blog to see the latest articles."
          />
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        back={{ href: "/media/blog", label: "Back to the blog" }}
      />
      <article className={`${PAGE_CONTAINER} pb-20 md:pb-28`} style={{ maxWidth: "760px" }}>
        <div style={{ fontSize: "13.5px", color: "rgba(245,243,237,0.5)", marginBottom: "28px" }}>
          {post.author} · {post.date} · {post.readTime}
        </div>
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "32px" }} />
        )}
        {/* Body is trusted HTML authored in the admin CMS (TipTap). */}
        <div
          style={{ fontSize: "17px", lineHeight: 1.75, color: "rgba(245,243,237,0.8)" }}
          dangerouslySetInnerHTML={{ __html: post.body ?? `<p>${post.excerpt}</p>` }}
        />
      </article>
    </PageShell>
  );
}
