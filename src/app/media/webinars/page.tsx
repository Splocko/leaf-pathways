import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";
import { getWebinars, webinarThumb } from "@/lib/webinars";

export const metadata = {
  title: "Pathways Webinar Series | LEAF Pathways",
  description: "Watch upcoming and past webinars with industry experts and mentors.",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function Webinars() {
  const webinars = await getWebinars();

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
        {webinars.length === 0 ? (
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
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {webinars.map((w) => {
              const thumb = webinarThumb(w.thumbnail_url);
              const card = (
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", backgroundColor: "#0F1A15", height: "100%" }}>
                  <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #0F1A15 0%, #08110C 100%)", display: "grid", placeItems: "center", position: "relative" }}>
                    {thumb ? (
                      <img src={thumb} alt={w.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src="/leaf-icon.png" alt="" style={{ height: "40px", opacity: 0.35 }} />
                    )}
                  </div>
                  <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    {w.topic && (
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#2FBF8F" }}>{w.topic}</div>
                    )}
                    <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "18px", color: "#F5F3ED", margin: 0, lineHeight: 1.3 }}>{w.title}</h3>
                    {w.description && (
                      <p style={{ fontSize: "14px", lineHeight: 1.55, color: "rgba(245,243,237,0.6)", margin: 0, flex: 1 }}>{w.description}</p>
                    )}
                    <div style={{ fontSize: "12.5px", color: "rgba(245,243,237,0.45)", marginTop: "6px" }}>
                      {[w.speaker_name, formatDate(w.webinar_date), w.duration_minutes ? `${w.duration_minutes} min` : null].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
              );
              return w.video_url ? (
                <a key={w.id} href={w.video_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{card}</a>
              ) : (
                <div key={w.id}>{card}</div>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
