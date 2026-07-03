"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Dialog, DialogPortal, DialogOverlay, DialogClose } from "@/components/ui/dialog";
import { X, UserPlus, Mail } from "lucide-react";

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

          <h3 style={{ fontFamily: "Hanken Grotesk", fontWeight: "800", fontSize: "26px", color: "#F5F3ED", margin: "0 0 8px" }}>
            Join <span style={{ color: "#E8B923" }}>LEAF</span>
          </h3>
          <p style={{ fontSize: "14px", color: "rgba(245,243,237,0.6)", margin: "0 0 20px", lineHeight: "1.5" }}>
            Supporting young professionals across the UK 🌿
          </p>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "rgba(245,243,237,0.6)", textAlign: "center", margin: 0 }}>
              New here or already part of the network?
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 16px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(90deg, #3ECF8E, #1F6B4A)",
                color: "#0B1410",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              <UserPlus size={18} />
              Join LEAF
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.15)",
                backgroundColor: "rgba(255,255,255,0.03)",
                color: "#F5F3ED",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              <Mail size={18} />
              Registered before? Rejoin
            </a>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
