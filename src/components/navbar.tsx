"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdownItems = {
    "About us": [
      { title: "Our mission", desc: "What LEAF is, and why it exists." },
      { title: "Meet the team", desc: "Run by students, for students." },
      { title: "Our impact", desc: "The numbers behind the network." },
    ],
    "Partners": [
      { title: "Our partners", desc: "Every organisation in the network." },
      { title: "Corporate partners", desc: "Talent sourcing & brand awareness." },
      { title: "University partners", desc: "Careers teams & student societies." },
    ],
    "Events": [
      { title: "Overview" },
      { title: "Commercial Awareness Competition" },
      { title: "Engineering Innovation Competition" },
      { title: "LEAF Hacks" },
      { title: "Finance Bootcamp" },
      { title: "Apprenticeship Bootcamp" },
    ],
    "Media": [
      { title: "Blog", desc: "Newsletters & community spotlights." },
      { title: "Pathways Webinar Series", desc: "Upcoming & past webinars." },
      { title: "Branching Out Podcast", desc: "YouTube · Spotify · Apple Podcasts." },
    ],
  };

  return (
    <header style={{
      position: "sticky",
      top: scrolled ? "16px" : "0",
      left: scrolled ? "50%" : "0",
      right: scrolled ? "16px" : "0",
      transform: scrolled ? "translateX(-50%)" : "none",
      zIndex: 100,
      backgroundColor: scrolled ? "rgba(11,20,16,0.8)" : "transparent",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      borderRadius: scrolled ? "8px" : "0",
      border: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
      boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
      transition: "all 0.3s",
      maxWidth: scrolled ? "1360px" : "none",
      width: scrolled ? "calc(100% - 32px)" : "100%",
    }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 32px", height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", flexShrink: 0 }}>
          <img src="https://leafpathways.com/images/leaflogo.png" alt="LEAF Pathways" style={{ height: "32px", width: "auto" }} />
          <span style={{ fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "16px", letterSpacing: "-0.01em" }}>
            <span style={{ color: "#E8B923" }}>LEAF</span>
            <span style={{ color: "#F5F3ED" }}> Pathways</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", flex: 1, alignItems: "center", gap: "4px", justifyContent: "center" }} className="hidden lg:flex">
          <Link href="#top" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "14px", fontWeight: "500", fontFamily: "IBM Plex Sans", padding: "10px 14px", borderRadius: "4px", display: "flex", alignItems: "center" }}>Home</Link>

          {Object.entries(dropdownItems).map(([label, items]) => (
            <div key={label} style={{ position: "relative" }} onMouseEnter={() => setOpenMenu(label)} onMouseLeave={() => setOpenMenu(null)}>
              <button style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "#F5F3ED",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "IBM Plex Sans",
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
                      <Link key={idx} href="#" style={{
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
                      <Link href="#contact" style={{
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
          <Link href="https://pathera.io" target="_blank" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "14px", fontWeight: "500", fontFamily: "IBM Plex Sans", padding: "8px 12px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", opacity: 0.7 }}>
            Pathera
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M9 7h8v8"></path>
            </svg>
          </Link>
          <Link href="#contact" style={{
            backgroundColor: "#E8B923",
            color: "#0B1410",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            borderRadius: "4px",
            fontFamily: "Space Grotesk",
            cursor: "pointer",
          }} className="hidden sm:inline-block">
            Join Network
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F5F3ED",
              cursor: "pointer",
              flexShrink: 0,
            }}
            className="lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: "4px", backgroundColor: "#0B1410" }}>
          <Link href="#top" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Home</Link>
          <Link href="#events" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Events</Link>
          <Link href="#partners" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Partners</Link>
          <Link href="#about" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>About us</Link>
          <Link href="#" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Media</Link>
          <Link href="#" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>LEAF Academy</Link>
          <Link href="https://pathera.io" target="_blank" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Pathera AI</Link>
          <Link href="#contact" style={{ color: "#F5F3ED", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "12px 4px" }}>Contact</Link>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <Link href="#" style={{
              flex: 1,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#F5F3ED",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "4px",
              fontWeight: "600",
              fontSize: "14px",
            }}>
              Login
            </Link>
            <Link href="#contact" style={{
              flex: 1,
              textAlign: "center",
              backgroundColor: "#E8B923",
              color: "#0B1410",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "4px",
              fontWeight: "600",
              fontSize: "14px",
            }}>
              Join Network
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
