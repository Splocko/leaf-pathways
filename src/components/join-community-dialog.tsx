"use client";

import * as React from "react";
import { X } from "lucide-react";

// TEMPORARY FALLBACK: no backend/database right now (see README note on the
// security incident). Joining is a Google Form embedded directly in this
// dialog — no API calls, no keys. Once submitted, Google's own confirmation
// screen (which we've put the WhatsApp invite link in) renders inside the
// same iframe, so completing the form is what unlocks the group link.
//
// TODO: replace with the real published Google Form URL, e.g.
// "https://docs.google.com/forms/d/e/XXXXXXXX/viewform"
const GOOGLE_FORM_URL = "https://forms.gle/REPLACE_WITH_REAL_FORM_ID";

/**
 * Trigger wrapper — preserves the original API (style/className/children
 * render a button) so every existing call site (navbar, hero, event pages)
 * keeps working unchanged.
 */
export function JoinCommunityDialog({
  style,
  className,
  children,
}: {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" style={style} className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(560px, 100%)",
                height: "min(760px, 92dvh)",
                backgroundColor: "#0F1A15",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px", color: "#F5F3ED" }}>
                  Join <span style={{ color: "#E8B923" }}>LEAF</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(245,243,237,0.7)",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <iframe
                src={`${GOOGLE_FORM_URL}?embedded=true`}
                title="Join LEAF — sign-up form"
                style={{ flex: 1, width: "100%", border: "none", backgroundColor: "#0F1A15" }}
                loading="lazy"
              >
                Loading form…
              </iframe>
            </div>
          </div>
        </>
      )}
    </>
  );
}
