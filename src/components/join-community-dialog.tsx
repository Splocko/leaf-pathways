"use client";

import * as React from "react";
import CommunityForm from "@/components/CommunityForm";

/**
 * Trigger wrapper that opens the ported CommunityForm (Supabase-backed
 * community_members signup + returning-member sign-in). Preserves the original
 * trigger API (style/className/children render a button) so every existing call
 * site keeps working; the modal's own "choice" screen covers Join and Rejoin.
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

  return (
    <>
      <button type="button" style={style} className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <CommunityForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
