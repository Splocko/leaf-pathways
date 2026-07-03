"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { JoinCommunityDialog } from "@/components/join-community-dialog";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdownItems: Record<string, { title: string; href: string; desc?: string }[]> = {
    "About us": [
      { title: "Our mission", href: "/about/mission", desc: "What LEAF is, and why it exists." },
      { title: "Meet the team", href: "/about/team", desc: "Run by students, for students." },
      { title: "Our impact", href: "/about/impact", desc: "The numbers behind the network." },
    ],
    "Partners": [
      { title: "Our partners", href: "/partners", desc: "Every organisation in the network." },
      { title: "Corporate partners", href: "/partners#corporate", desc: "Talent sourcing & brand awareness." },
      { title: "University partners", href: "/partners#university", desc: "Careers teams & student societies." },
    ],
    "Events": [
      { title: "Overview", href: "/events" },
      { title: "Commercial Awareness Competition", href: "/events/commercial-awareness" },
      { title: "Engineering Innovation Competition", href: "/events/engineering-innovation" },
      { title: "LEAF Hacks", href: "/events/leaf-hacks" },
      { title: "Finance Bootcamp", href: "/events/finance-bootcamp" },
      { title: "Apprenticeship Bootcamp", href: "/events/apprenticeship-bootcamp" },
    ],
    "Media": [
      { title: "Blog", href: "/media/blog", desc: "Newsletters & community spotlights." },
      { title: "Pathways Webinar Series", href: "/media/webinars", desc: "Upcoming & past webinars." },
      { title: "Branching Out Podcast", href: "/media/podcast", desc: "YouTube · Spotify · Apple Podcasts." },
    ],
  };

  // Mobile, scrolled, menu closed → the bar dissolves and only the hamburger floats
  const mobileFloating = scrolled && !mobileOpen;

  return (
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
            <span style={{ color: "#E8B923" }}>LEAF</span>
            <span style={{ color: "#F5F3ED" }}> Pathways</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ flex: 1, alignItems: "center", gap: "4px", justifyContent: "center" }} className="hidden lg:flex">
          <Link href="/" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "19px", fontWeight: "500", fontFamily: "var(--font-sans)", padding: "10px 14px", borderRadius: "4px", display: "flex", alignItems: "center" }}>Home</Link>

          {Object.entries(dropdownItems).map(([label, items]) => (
            <div key={label} style={{ position: "relative" }} onMouseEnter={() => setOpenMenu(label)} onMouseLeave={() => setOpenMenu(null)}>
              <button style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "#F5F3ED",
                fontSize: "19px",
                fontWeight: "500",
                fontFamily: "var(--font-sans)",
                padding: "10px 14px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}>
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>

              {openMenu === label && (
                <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: "10px", width: "280px", zIndex: 50 }}>
                  <div style={{ backgroundColor: "#0F1A15", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px", boxShadow: "0 12px 24px rgba(0,0,0,0.35)" }}>
                    {items.map((item, idx) => (
                      <Link key={idx} href={item.href} style={{
                        display: "block",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        borderBottom: (label === "Partners" || label === "Events") && idx === items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#F5F3ED" }}>{item.title}</div>
                        {item.desc && <div style={{ fontSize: "12.5px", color: "rgba(245,243,237,0.5)", marginTop: "2px" }}>{item.desc}</div>}
                      </Link>
                    ))}
                    {(label === "Partners" || label === "Events") && (
                      <Link href={label === "Partners" ? "/contact" : "/events/host-event"} style={{
                        display: "block",
                        marginTop: "4px",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                      }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#E8B923", paddingTop: "6px" }}>
                          {label === "Partners" ? "Partner with us →" : "Host an event with us →"}
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: "4px", backgroundColor: "#0B1410" }}>
          <Link href="/" onClick={() => setMobileOpen(false)} style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Home</Link>
          <Link href="/events" onClick={() => setMobileOpen(false)} style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Events</Link>
          <Link href="/partners" onClick={() => setMobileOpen(false)} style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Partners</Link>
          <Link href="/about/mission" onClick={() => setMobileOpen(false)} style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>About us</Link>
          <Link href="/media" onClick={() => setMobileOpen(false)} style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Media</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Contact</Link>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <JoinCommunityDialog style={{
              flex: 1,
              textAlign: "center",
              background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)",
              color: "#0B1410",
              border: "none",
              padding: "13px",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "14px",
              boxShadow: "0 6px 18px rgba(232,185,35,0.35)",
            }}>
              Join the community
            </JoinCommunityDialog>
          </div>
        </div>
      )}
    </header>
  );
}
