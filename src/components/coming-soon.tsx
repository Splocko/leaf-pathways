import { Clock } from "lucide-react";
import type { ReactNode } from "react";

// A finished-looking "coming soon" card for pages/sections that are real but
// not yet populated (webinars, podcast, event detail bodies). Distinct from
// <ContentUnavailable /> which specifically signals a pending DB connection.
export function ComingSoon({
  eyebrow = "Coming soon",
  title = "We're putting the finishing touches on this",
  message,
  children,
}: {
  eyebrow?: string;
  title?: string;
  message?: string;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "#0F1A15",
        borderRadius: "12px",
        padding: "clamp(36px, 6vw, 56px) clamp(24px, 5vw, 44px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          backgroundColor: "rgba(232,185,35,0.1)",
          border: "1px solid rgba(232,185,35,0.3)",
          color: "#E8B923",
        }}
      >
        <Clock size={22} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#2FBF8F",
        }}
      >
        {eyebrow}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(22px, 2.6vw, 30px)",
          color: "#F5F3ED",
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      {message && (
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.65,
            color: "rgba(245,243,237,0.68)",
            margin: 0,
            maxWidth: "560px",
          }}
        >
          {message}
        </p>
      )}
      {children}
    </div>
  );
}
