"use client";

import * as React from "react";

// TEMPORARY FALLBACK: no backend/database right now (see the security-incident
// note in git history). Joining is just a Google Form — no API calls, no keys.
// Opens in a new tab (not embedded) so the WhatsApp link in the form's own
// confirmation message works: WhatsApp refuses to load inside any iframe
// (X-Frame-Options), so a plain top-level tab is what makes that link usable.
//
// Must be the canonical docs.google.com/forms/d/e/…/viewform URL, not a
// forms.gle short link (that just adds a redirect hop). If the form is ever
// regenerated, resolve the new forms.gle link once (curl -sI, follow the
// Location header) and paste the resulting docs.google.com URL here.
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfWusYkRPEuSEbMevWtKEUEsa-hDFDEnJBquOpBndPc3m24Sw/viewform";

/**
 * Trigger — preserves the original API (style/className/children render a
 * button) so every existing call site (navbar, hero, event pages) keeps
 * working unchanged. Opens the Google Form in a new tab.
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
  return (
    <button
      type="button"
      style={style}
      className={className}
      onClick={() => window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer")}
    >
      {children}
    </button>
  );
}
