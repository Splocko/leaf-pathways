import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PAGE_CONTAINER } from "@/components/page-shell";

// Consistent page hero: mono eyebrow, big Hanken title (with optional
// gold/green highlight passed as JSX), muted subtitle, optional back link.
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  back,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  back?: { href: string; label: string };
}) {
  return (
    <section className={`${PAGE_CONTAINER} pt-28 md:pt-36 pb-10 md:pb-14`}>
      {back && (
        <Link
          href={back.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(245,243,237,0.6)",
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={15} /> {back.label}
        </Link>
      )}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "0.1em",
          color: "#2FBF8F",
          marginBottom: "16px",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(38px, 5vw, 64px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          margin: 0,
          color: "#F5F3ED",
          maxWidth: "900px",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            color: "rgba(245,243,237,0.68)",
            margin: "20px 0 0",
            maxWidth: "660px",
          }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}
