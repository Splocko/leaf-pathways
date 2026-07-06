import { Database } from "lucide-react";

// On-brand placeholder shown wherever content will later load from the backend
// database (blog posts, the live events schedule, …). Swap the copy per-use via
// props. When the data layer returns real rows this simply stops rendering.
export function ContentUnavailable({
  eyebrow = "Database not connected",
  title = "Content coming soon",
  message = "This section loads from our content system, which isn't linked yet. It'll populate automatically once connected.",
}: {
  eyebrow?: string;
  title?: string;
  message?: string;
}) {
  return (
    <div
      style={{
        border: "1px dashed rgba(255,255,255,0.16)",
        backgroundColor: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
        padding: "clamp(40px, 7vw, 72px) 28px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          backgroundColor: "rgba(232,185,35,0.1)",
          border: "1px solid rgba(232,185,35,0.3)",
          color: "#E8B923",
        }}
      >
        <Database size={22} />
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
          fontSize: "clamp(20px, 2.4vw, 26px)",
          color: "#F5F3ED",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.6,
          color: "rgba(245,243,237,0.6)",
          margin: 0,
          maxWidth: "440px",
        }}
      >
        {message}
      </p>
    </div>
  );
}
