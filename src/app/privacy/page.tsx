import { PageShell, PAGE_CONTAINER } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Privacy Policy | LEAF Pathways",
  description: "How LEAF Pathways collects, uses and protects your information.",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fontSize: "clamp(20px, 2.4vw, 26px)",
  color: "#F5F3ED",
  margin: "0 0 12px",
};

const para: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.7,
  color: "rgba(245,243,237,0.72)",
  margin: "0 0 14px",
};

const list: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.7,
  color: "rgba(245,243,237,0.72)",
  margin: "0 0 14px",
  paddingLeft: "20px",
};

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title={
          <>
            Privacy <span style={{ color: "#E8B923" }}>Policy</span>.
          </>
        }
        subtitle="How LEAF Network collects, uses, discloses and safeguards your information."
      />

      <section className={`${PAGE_CONTAINER} pb-20 md:pb-28`} style={{ maxWidth: "820px" }}>
        <p style={{ ...para, color: "rgba(245,243,237,0.5)", fontSize: "14px" }}>Last updated: 14/10/2025</p>

        <div style={{ marginTop: "24px" }}>
          <h2 style={sectionTitle}>Introduction</h2>
          <p style={para}>
            At LEAF Network, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>Information we collect</h2>
          <p style={para}>We collect information that you provide directly to us, including:</p>
          <ul style={list}>
            <li>Name and contact information</li>
            <li>Educational background</li>
            <li>Professional interests</li>
            <li>Account credentials</li>
            <li>Communication preferences</li>
          </ul>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>How we use your information</h2>
          <ul style={list}>
            <li>Provide and maintain our services</li>
            <li>Match you with relevant mentorship opportunities</li>
            <li>Send you important updates and communications</li>
            <li>Send you our newsletter and promotional emails about events, opportunities, and partner offerings</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>Newsletter &amp; marketing communications</h2>
          <p style={para}>
            When you join the LEAF community or subscribe to our newsletter, you are opted in to receive our
            newsletter and promotional emails. These may include updates on events, career opportunities,
            partner offerings, and other content relevant to your professional development.
          </p>
          <p style={para}>
            You can unsubscribe at any time via the &ldquo;Unsubscribe&rdquo; link in any email, or by contacting{" "}
            <a href="mailto:support@leafpathways.com" style={{ color: "#2FBF8F", textDecoration: "none" }}>support@leafpathways.com</a>.
          </p>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>Data security</h2>
          <p style={para}>
            We implement appropriate technical and organizational security measures to protect your personal
            information. However, no method of transmission over the internet is 100% secure.
          </p>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>Your rights</h2>
          <ul style={list}>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>Contact us</h2>
          <p style={para}>
            If you have any questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:support@leafpathways.com" style={{ color: "#2FBF8F", textDecoration: "none" }}>support@leafpathways.com</a>.
          </p>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2 style={sectionTitle}>Updates to this policy</h2>
          <p style={para}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new version on this page and updating the effective date.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
