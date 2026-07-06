import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact Us | LEAF Pathways",
  description: "Get in touch with the LEAF team. We'd love to hear from you.",
};

const departments = [
  {
    name: "General",
    email: "info@leafpathways.com",
    description: "Questions about LEAF, our mission, or the community.",
  },
  {
    name: "Account & membership",
    email: "support@leafpathways.com",
    description: "Need help with your account or membership?",
  },
  {
    name: "Partnerships",
    email: "partnerships@leafpathways.com",
    description: "Interested in working with us or sponsoring an initiative?",
  },
];

const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/leaf-network/" },
  { name: "Instagram", href: "https://www.instagram.com/leafpathways/" },
  { name: "TikTok", href: "https://www.tiktok.com/@leafnetwork" },
];

const faqs = [
  {
    q: "How do I join LEAF?",
    a: "You can join LEAF by signing up on our website or attending one of our events. Membership is free and open to students from all universities across the UK.",
  },
  {
    q: "Are the events really free?",
    a: "Most of our events are free for LEAF members. Some premium bootcamps may have a small fee, but we always provide support for those who need it.",
  },
  {
    q: "How can my organisation partner with LEAF?",
    a: "We'd love to work with you. Email partnerships@leafpathways.com to discuss sponsorship, recruitment, or event collaboration.",
  },
  {
    q: "What's the best way to reach the team?",
    a: "For most inquiries, email info@leafpathways.com. For account help use support@leafpathways.com. You can also reach us on LinkedIn or Instagram.",
  },
];

export default function Contact() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Get in <span style={{ color: "#E8B923" }}>touch</span>.
          </>
        }
        subtitle="Have a question, or want to partner with us? Reach out to the right team below — we'd love to hear from you."
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`}>
        {/* Direct contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div key={dept.email} style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#0F1A15", borderRadius: "10px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E8B923", marginBottom: "8px" }}>
                <Mail size={16} />
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "#F5F3ED" }}>{dept.name}</span>
              </div>
              <a href={`mailto:${dept.email}`} style={{ color: "#2FBF8F", textDecoration: "none", fontSize: "15px", fontWeight: 600 }}>
                {dept.email}
              </a>
              <p style={{ fontSize: "14px", lineHeight: 1.55, color: "rgba(245,243,237,0.55)", margin: "8px 0 0" }}>{dept.description}</p>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px", marginTop: "20px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#0F1A15", borderRadius: "10px", padding: "18px 24px" }}>
          {socials.map((s) => (
            <Link key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", padding: "8px 16px", color: "rgba(245,243,237,0.8)", textDecoration: "none", fontSize: "13.5px", fontWeight: 600 }}>
              {s.name}
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "clamp(48px, 8vw, 80px)" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(24px, 3vw, 32px)", color: "#F5F3ED", margin: "0 0 24px", letterSpacing: "-0.01em" }}>
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <div key={faq.q} style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#0F1A15", borderRadius: "10px", padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px", color: "#F5F3ED", margin: "0 0 8px" }}>{faq.q}</h3>
                <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "rgba(245,243,237,0.6)", margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
