"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const socials = ["IG", "LI", "TT", "YT"];

  return (
    <footer id="contact" style={{ borderTop: "1px solid rgba(255,255,255,0.09)", backgroundColor: "#0B1410" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "80px 32px 0" }}>
        {/* Newsletter Section */}
        <div style={{
          border: "1px solid rgba(232,185,35,0.3)",
          backgroundColor: "rgba(232,185,35,0.06)",
          borderRadius: "12px",
          padding: "48px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
          marginBottom: "80px",
        }}>
          <div style={{ maxWidth: "460px" }}>
            <h3 style={{ fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "24px", margin: "0 0 10px", color: "#F5F3ED" }}>Join the LEAF newsletter</h3>
            <p style={{ fontSize: "15px", color: "rgba(245,243,237,0.62)", margin: 0, lineHeight: "1.6" }}>Be the first to hear about major opportunities, upcoming events, and industry insight — delivered to your inbox.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", flex: 1, minWidth: "280px", maxWidth: "420px" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.ac.uk"
                style={{
                  flex: 1,
                  minWidth: "200px",
                  backgroundColor: "#0F1A15",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  padding: "14px 16px",
                  color: "#F5F3ED",
                  fontSize: "14px",
                  fontFamily: "IBM Plex Sans",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#E8B923",
                  color: "#0B1410",
                  border: "none",
                  fontFamily: "Space Grotesk",
                  fontWeight: "600",
                  fontSize: "14px",
                  padding: "14px 22px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2FBF8F", fontWeight: "600", fontSize: "15px" }}>
              <Check size={20} />
              You're subscribed.
            </div>
          )}
        </div>

        {/* Footer Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "48px", paddingBottom: "56px" }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span style={{ width: "32px", height: "32px", backgroundColor: "#E8B923", color: "#0B1410", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "16px", borderRadius: "4px" }}>L</span>
              <span style={{ fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "17px", color: "#F5F3ED" }}>LEAF Pathways</span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "rgba(245,243,237,0.5)", maxWidth: "280px", margin: "0 0 20px" }}>The student network for Law, Engineering, Accounting and Finance. From potential to placement.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {socials.map((social) => (
                <Link key={social} href="#" style={{
                  width: "36px",
                  height: "36px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "rgba(245,243,237,0.6)",
                  fontFamily: "IBM Plex Mono",
                  fontSize: "11px",
                  fontWeight: "500",
                }}>
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(245,243,237,0.4)", marginBottom: "18px" }}>EXPLORE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <Link href="#events" style={{ color: "rgba(245,243,237,0.72)", textDecoration: "none", fontSize: "14.5px" }}>Events calendar</Link>
              <Link href="#partners" style={{ color: "rgba(245,243,237,0.72)", textDecoration: "none", fontSize: "14.5px" }}>Partner network</Link>
              <Link href="#about" style={{ color: "rgba(245,243,237,0.72)", textDecoration: "none", fontSize: "14.5px" }}>Our mission</Link>
              <Link href="#pathera" style={{ color: "#E8B923", textDecoration: "none", fontSize: "14.5px" }}>Pathera AI tool</Link>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(245,243,237,0.4)", marginBottom: "18px" }}>LEGAL & SUPPORT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <Link href="#" style={{ color: "rgba(245,243,237,0.72)", textDecoration: "none", fontSize: "14.5px" }}>Privacy policy</Link>
              <Link href="#" style={{ color: "rgba(245,243,237,0.72)", textDecoration: "none", fontSize: "14.5px" }}>Terms of service</Link>
              <Link href="#" style={{ color: "rgba(245,243,237,0.72)", textDecoration: "none", fontSize: "14.5px" }}>Contact us</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", padding: "24px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "rgba(245,243,237,0.4)" }}>© 2026 LEAF Pathways. All rights reserved.</span>
          <span style={{ fontSize: "13px", color: "rgba(245,243,237,0.4)", fontFamily: "IBM Plex Mono" }}>Made by students, for students.</span>
        </div>
      </div>
    </footer>
  );
}
