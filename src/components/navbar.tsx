"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { JoinCommunityDialog } from "@/components/join-community-dialog";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    handleScroll(); // sync immediately — covers reloading while already scrolled down
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the full-screen mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Simple top-level links (no dropdown)
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" },
  ];

  // Media is the only dropdown
  const mediaItems = [
    { title: "Blog", href: "/media/blog", desc: "Newsletters & community spotlights." },
    { title: "Pathways Webinar Series", href: "/media/webinars", desc: "Upcoming & past webinars." },
    { title: "Branching Out Podcast", href: "/media/podcast", desc: "YouTube · Spotify · Apple Podcasts." },
  ];

  // Flat mobile nav — mirrors the desktop IA
  const mobileNav = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/media/blog" },
    { label: "Webinars", href: "/media/webinars" },
    { label: "Podcast", href: "/media/podcast" },
    { label: "Contact", href: "/contact" },
  ];

  const linkStyle: React.CSSProperties = {
    color: "#F5F3ED",
    textDecoration: "none",
    fontSize: "19px",
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    padding: "10px 14px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
  };

  // Mobile, scrolled, menu closed → the bar dissolves and only the hamburger floats
  const mobileFloating = scrolled && !mobileOpen;

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-[100] w-full border-b transition-[background-color,height,border-color] duration-300",
        scrolled
          ? "h-16 bg-[rgba(11,20,16,0.7)] border-white/5 backdrop-blur-[10px]"
          : "h-20 bg-transparent border-transparent",
        mobileFloating && "max-lg:bg-transparent max-lg:border-transparent max-lg:backdrop-blur-none max-lg:pointer-events-none"
      )}
    >
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        {/* Logo — fades out on mobile once the bar dissolves */}
        <Link
          href="/"
          className={cn("transition-opacity duration-300", mobileFloating && "max-lg:opacity-0 max-lg:pointer-events-none")}
          style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", flexShrink: 0 }}
        >
          <img src="/leaf-icon.png" alt="" style={{ height: "44px", width: "auto" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em" }}>
            <span style={{ color: "#E8B923", fontWeight: "800" }}>LEAF</span>
            <span style={{ color: "#F5F3ED" }}> Pathways</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ flex: 1, alignItems: "center", gap: "4px", justifyContent: "center" }} className="hidden lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}

          {/* Media dropdown */}
          <div style={{ position: "relative" }} onMouseEnter={() => setMediaOpen(true)} onMouseLeave={() => setMediaOpen(false)}>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#F5F3ED",
              fontSize: "19px",
              fontWeight: 500,
              fontFamily: "var(--font-sans)",
              padding: "10px 14px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}>
              Media
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>

            {mediaOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: "10px", width: "300px", zIndex: 50 }}>
                <div style={{ backgroundColor: "#0F1A15", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px", boxShadow: "0 12px 24px rgba(0,0,0,0.35)" }}>
                  {mediaItems.map((item) => (
                    <Link key={item.href} href={item.href} style={{
                      display: "block",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      textDecoration: "none",
                    }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#F5F3ED" }}>{item.title}</div>
                      <div style={{ fontSize: "12.5px", color: "rgba(245,243,237,0.5)", marginTop: "2px" }}>{item.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/contact" style={linkStyle}>Contact</Link>
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <JoinCommunityDialog style={{
            background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)",
            color: "#0B1410",
            border: "none",
            fontSize: "16px",
            fontWeight: "700",
            padding: "10px 22px",
            borderRadius: "999px",
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(232,185,35,0.35)",
          }} className="hidden lg:inline-block">
            Join the community
          </JoinCommunityDialog>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              width: "40px",
              height: "40px",
              alignItems: "center",
              justifyContent: "center",
              color: "#F5F3ED",
              cursor: "pointer",
              flexShrink: 0,
            }}
            className={cn(
              "flex lg:hidden pointer-events-auto border transition-all duration-300",
              mobileFloating
                ? "rounded-full border-white/15 bg-[rgba(11,20,16,0.8)] backdrop-blur-[10px] shadow-lg shadow-black/30"
                : "rounded border-white/15 bg-transparent"
            )}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile menu — full-screen overlay, portaled to <body> so the header's
          backdrop-filter can't trap the fixed positioning */}
      {mobileOpen && createPortal(
        <div
          className="lg:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "linear-gradient(160deg, #0C1913 0%, #071611 55%, #030B08 100%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Faint plus texture */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='42'%3E%3Cpath d='M21 15v12M15 21h12' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.05'/%3E%3C/svg%3E\")",
              backgroundSize: "42px 42px",
              pointerEvents: "none",
            }}
          />

          {/* Top bar */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <img src="/leaf-icon.png" alt="" style={{ height: "40px", width: "auto" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "22px", letterSpacing: "-0.01em" }}>
                <span style={{ color: "#E8B923", fontWeight: "800" }}>LEAF</span>
                <span style={{ color: "#F5F3ED" }}> Pathways</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ background: "none", border: "none", color: "#E8B923", cursor: "pointer", display: "flex", padding: "6px" }}
            >
              <X size={28} />
            </button>
          </div>

          {/* Nav items */}
          <nav style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px", padding: "0 28px" }}>
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(30px, 8vw, 42px)",
                  fontWeight: 800,
                  color: "#F5F3ED",
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                  padding: "7px 0",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div style={{ position: "relative", padding: "0 28px calc(40px + env(safe-area-inset-bottom))" }}>
            <JoinCommunityDialog
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)",
                color: "#0B1410",
                border: "none",
                padding: "18px",
                borderRadius: "999px",
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 8px 26px rgba(232,185,35,0.4)",
              }}
            >
              Join the community
            </JoinCommunityDialog>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
