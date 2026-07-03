"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Dialog, DialogPortal, DialogOverlay, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

const communities = [
  { label: "General LEAF Community", href: "#" },
  { label: "Law", href: "#" },
  { label: "Engineering & Technology", href: "#" },
  { label: "Finance", href: "#" },
];

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
    <Dialog>
      <DialogPrimitive.Trigger render={<button style={style} className={className} />}>
        {children}
      </DialogPrimitive.Trigger>
      <DialogPortal>
        <DialogOverlay className="z-[200]" />
        <DialogPrimitive.Popup
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 201,
            width: "calc(100% - 32px)",
            maxWidth: "420px",
            backgroundColor: "#0F1A15",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "28px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
          }}
        >
          <DialogClose
            render={
              <button
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  color: "rgba(245,243,237,0.6)",
                  cursor: "pointer",
                  display: "flex",
                  padding: "4px",
                }}
              />
            }
          >
            <X size={18} />
          </DialogClose>

          <h3 style={{ fontFamily: "Hanken Grotesk", fontWeight: "700", fontSize: "20px", color: "#F5F3ED", margin: "0 0 8px" }}>
            Join the LEAF community
          </h3>
          <p style={{ fontSize: "14px", color: "rgba(245,243,237,0.6)", margin: "0 0 24px", lineHeight: "1.5" }}>
            Pick a WhatsApp community and jump straight into the conversation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {communities.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  color: "#F5F3ED",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {c.label}
                <span style={{ color: "#2FBF8F" }}>→</span>
              </a>
            ))}
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
