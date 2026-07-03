"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PartnerLogos } from "@/components/partner-logos";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useIsMobile } from "@/lib/use-is-mobile";

const events = [
  {
    tag: "COMING SOON",
    tone: "gold",
    date: "1 JUL 2026",
    title: "LEAF Healthcare Bootcamp",
    desc: "UCAS prep, personal statements, work experience and application support.",
    ctaLabel: "Register interest",
    id: "event-healthcare",
  },
  {
    tag: "SOLD OUT",
    tone: "muted",
    date: "4 JUL 2026 · 00:00",
    title: "LEAF Hacks '26",
    desc: "A 24-hour build sprint for students who want to create, iterate, and pitch under pressure.",
    ctaLabel: "Join the waitlist",
    id: "event-hacks",
  },
  {
    tag: "COMING SOON",
    tone: "gold",
    date: "OCT 2026",
    title: "LEAF Apprenticeship Bootcamp 2026",
    desc: "Winning applications, final interview prep, and the insider knowledge that gets you hired.",
    ctaLabel: "Register interest",
    id: "event-apprenticeship",
  },
];

const testimonials = [
  {
    name: "Elliot Shaw",
    title: "Social Value Lead for London and the South East, AtkinsRéalis",
    quote: "The real impact of LEAF is the access it gives young people. It opens the door to engineering in a way that feels real and achievable.",
  },
  {
    name: "Joseph Clarke",
    title: "Competition Judge and STEM Content Creator",
    quote: "The competition had a really positive impact on aspiring engineers, giving them a chance to develop their confidence, creativity, and problem-solving abilities.",
  },
  {
    name: "Temiloluwa 'Temmy' Phillips",
    title: "EIC 2026 Winner",
    quote: "Entering the LEAF Engineering Innovation Competition was one of the most valuable decisions of my gap year.",
  },
  {
    name: "Vincent Egunlae",
    title: "Senior Speaker, Investment Banker & Keynote Speaker",
    quote: "LEAF is a highly professional organisation creating impact for thousands of young people throughout the UK.",
  },
  {
    name: "Placeholder Smith",
    title: "Student, University of London",
    quote: "Being part of LEAF transformed my career prospects and connected me with mentors who genuinely care about my success.",
  },
  {
    name: "Placeholder Jones",
    title: "Graduate, Finance Professional",
    quote: "The networking opportunities at LEAF were invaluable. I met industry professionals who became my colleagues.",
  },
  {
    name: "Placeholder Kumar",
    title: "Student, Imperial College London",
    quote: "LEAF gave me the confidence to pursue opportunities I never thought were possible.",
  },
  {
    name: "Placeholder Williams",
    title: "Career Coach, Corporate Partner",
    quote: "The caliber of students in LEAF is exceptional. It's been a pleasure working with such driven young people.",
  },
  {
    name: "Placeholder Brown",
    title: "Student, LSE",
    quote: "The mentorship program at LEAF helped me land my dream internship in the financial sector.",
  },
  {
    name: "Placeholder Davis",
    title: "Graduate, Law & Finance",
    quote: "LEAF bridges the gap between university and professional life in a way few organizations can.",
  },
];

function TestimonialCarousel({ testimonials }: { testimonials: Array<{ name: string; title: string; quote: string }> }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIdx, testimonials.length]);

  const current = testimonials[currentIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Quote */}
      <blockquote style={{ fontFamily: "IBM Plex Sans", fontSize: "16px", lineHeight: "1.6", color: "#F5F3ED", margin: 0, fontStyle: "italic", borderLeft: "4px solid #E8B923", paddingLeft: "20px" }}>
        "{current.quote}"
      </blockquote>

      {/* Attribution */}
      <div>
        <div style={{ fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "14px", color: "#F5F3ED" }}>
          {current.name}
        </div>
        <div style={{ fontSize: "13px", color: "rgba(245,243,237,0.6)", marginTop: "3px" }}>
          {current.title}
        </div>
      </div>

      {/* Indicators */}
      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: idx === currentIdx ? "#E8B923" : "rgba(255,255,255,0.2)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: (typeof events)[0] }) {
  const isGold = event.tone === "gold";

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", backgroundColor: "#0F1A15", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Image placeholder */}
      <div style={{ position: "relative", height: "170px", backgroundColor: "rgba(245,243,237,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(245,243,237,0.3)", fontSize: "14px", fontWeight: "500" }}>[Event image]</div>
        {/* Status pill */}
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          fontFamily: "IBM Plex Mono",
          fontSize: "11px",
          fontWeight: "500",
          letterSpacing: "0.06em",
          padding: "5px 10px",
          borderRadius: "999px",
          backgroundColor: isGold ? "rgba(232,185,35,0.12)" : "rgba(245,243,237,0.08)",
          color: isGold ? "#E8B923" : "rgba(245,243,237,0.6)",
          border: `1px solid ${isGold ? "rgba(232,185,35,0.4)" : "rgba(255,255,255,0.18)"}`,
        }}>
          {event.tag}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", color: "rgba(245,243,237,0.45)", letterSpacing: "0.04em" }}>
          {event.date}
        </div>
        <h3 style={{ fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "19px", margin: 0, lineHeight: "1.25" }}>
          {event.title}
        </h3>
        <p style={{ fontSize: "14px", lineHeight: "1.55", color: "rgba(245,243,237,0.6)", margin: 0, flex: 1 }}>
          {event.desc}
        </p>
        <Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#E8B923", textDecoration: "none", fontWeight: "600", fontSize: "14px", marginTop: "6px" }}>
          {event.ctaLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0B1410" }}>
      <Navbar />

      {/* HERO SECTION */}
      <section id="top" style={{ position: "relative", overflow: "hidden", maxWidth: "1360px", margin: "0 auto", padding: isMobile ? "48px 20px 28px" : "96px 32px 28px", backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "26px 26px", backgroundPosition: "-8px -8px" }}>
        {/* Ambient background glow */}
        <div style={{ position: "absolute", top: "-120px", left: "-100px", width: "480px", height: "480px", borderRadius: "50%", background: "#E8B923", opacity: 0.07, filter: "blur(110px)", animation: "ambientDrift1 16s ease-in-out infinite", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", bottom: "-140px", right: "-80px", width: "440px", height: "440px", borderRadius: "50%", background: "#2FBF8F", opacity: 0.08, filter: "blur(110px)", animation: "ambientDrift2 20s ease-in-out infinite", pointerEvents: "none" }}></div>

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: isMobile ? "40px" : "64px", alignItems: "center" }}>
          {/* Left column */}
          <div>
            {/* Eyebrow pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(232,185,35,0.4)", backgroundColor: "rgba(232,185,35,0.08)", color: "#E8B923", fontFamily: "IBM Plex Mono", fontSize: "12px", fontWeight: "500", letterSpacing: "0.08em", padding: "7px 14px", borderRadius: "999px", marginBottom: "28px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#E8B923" }}></span>
              NEW EVENTS — REGISTER NOW
            </div>

            {/* H1 */}
            <h1 style={{ fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "clamp(40px, 5.4vw, 72px)", lineHeight: "1.03", letterSpacing: "-0.02em", margin: "0 0 24px", color: "#F5F3ED" }}>
              Where ambition meets <span style={{ color: "#E8B923" }}>real opportunity</span> in LEAF.
            </h1>

            {/* Subhead */}
            <p style={{ fontSize: "18px", lineHeight: "1.6", color: "rgba(245,243,237,0.68)", maxWidth: "520px", margin: "0 0 32px" }}>
              The UK student network for <strong style={{ color: "#F5F3ED", fontWeight: "600" }}>Law, Engineering & Technology</strong>, <strong style={{ color: "#F5F3ED", fontWeight: "600" }}>Finance</strong>, and beyond. Internships, apprenticeships, and placements that matter. Real connections, real opportunities.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <Link href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "9px", backgroundColor: "#E8B923", color: "#0B1410", textDecoration: "none", fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "15px", padding: "15px 26px", borderRadius: "4px", border: "none", cursor: "pointer", transition: "background-color 0.2s" }}>
                Join the community
                <ArrowRight size={16} />
              </Link>
              <Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: "9px", backgroundColor: "transparent", color: "#F5F3ED", textDecoration: "none", fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "15px", padding: "15px 26px", borderRadius: "4px", border: "1.5px solid rgba(47,191,143,0.5)", cursor: "pointer", transition: "all 0.2s" }}>
                Explore Pathera
              </Link>
            </div>
          </div>

          {/* Right column - Hero video */}
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", width: "100%", aspectRatio: "16/9", backgroundColor: "rgba(245,243,237,0.03)" }}>
              <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
                <source src="https://leafpathways.com/videos/vid1.mp4" type="video/mp4" />
              </video>
            </div>
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: "-10px", left: "-10px", width: "34px", height: "34px", borderTop: "3px solid #E8B923", borderLeft: "3px solid #E8B923" }}></div>
            <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "34px", height: "34px", borderBottom: "3px solid #E8B923", borderRight: "3px solid #E8B923" }}></div>
          </div>
        </div>

        {/* Stat strip - spans full hero width */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "14px", marginTop: "56px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.09)" }}>
          <span style={{ fontFamily: "IBM Plex Mono", fontSize: "26px", fontWeight: "500", color: "#E8B923" }}>4,973+</span>
          <span style={{ fontSize: "14px", color: "rgba(245,243,237,0.55)", maxWidth: "320px", lineHeight: "1.4" }}>students and young professionals already building momentum</span>
        </div>
      </section>

      {/* TRUSTED BY SECTION - Two Carousels */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.09)", borderBottom: "1px solid rgba(255,255,255,0.09)", padding: isMobile ? "48px 20px 56px" : "70px 32px 90px", overflow: "visible" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "48px" : "48px", alignItems: "flex-start" }}>
          {/* Left: Partner Logos Carousel */}
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <h3 style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(245,243,237,0.4)", margin: "0 0 32px" }}>
              TRUSTED BY PARTNERS
            </h3>
            <div style={{ overflow: "hidden", position: "relative", height: "140px", width: "100%" }}>
              <div style={{ display: "flex", gap: "40px", animation: "logoCarousel 20s linear infinite", willChange: "transform", width: "max-content" }}>
                {isClient && [...PartnerLogos, ...PartnerLogos].map((partner, idx) => (
                  <div key={idx} style={{ width: "140px", height: "140px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7, transition: "opacity 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}>
                    <img src={partner.logo} alt={partner.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Testimonials Carousel */}
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <h3 style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(245,243,237,0.4)", margin: "0 0 32px" }}>
              STUDENT & PARTNER VOICES
            </h3>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>

        <style>{`
          @keyframes logoCarousel {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-180px * ${PartnerLogos.length})); }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-carousel] { animation: none !important; }
          }
        `}</style>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" style={{ maxWidth: "1360px", margin: "0 auto", padding: isMobile ? "56px 20px 56px" : "110px 32px 100px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
          <div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.1em", color: "#2FBF8F", marginBottom: "14px" }}>(01) UPCOMING EVENTS</div>
            <h2 style={{ fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: "1.1", margin: 0, letterSpacing: "-0.01em", color: "#F5F3ED" }}>
              Connect at our <span style={{ color: "#E8B923" }}>major events</span>.
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(245,243,237,0.6)", margin: "14px 0 0", maxWidth: "440px" }}>A packed calendar this year — book your place before spots fill up.</p>
          </div>
          <Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#F5F3ED", textDecoration: "none", fontWeight: "600", fontSize: "14px", border: "1px solid rgba(255,255,255,0.18)", padding: "12px 20px", borderRadius: "4px", cursor: "pointer", flexShrink: 0 }}>
            View full calendar
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Events grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section id="stats" style={{ borderTop: "1px solid rgba(255,255,255,0.09)", borderBottom: "1px solid rgba(255,255,255,0.09)", backgroundColor: "#0F1A15" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          <div style={{ padding: isMobile ? "40px 0" : "56px 40px 56px 0", borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.09)", borderBottom: isMobile ? "1px solid rgba(255,255,255,0.09)" : "none" }}>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "44px", fontWeight: "500", color: "#E8B923", letterSpacing: "-0.01em" }}>4,973+</div>
            <div style={{ fontSize: "15px", color: "rgba(245,243,237,0.6)", marginTop: "10px" }}>Students & young professionals in the LEAF community — and growing every day.</div>
          </div>
          <div style={{ padding: isMobile ? "40px 0" : "56px 0 56px 40px" }}>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "44px", fontWeight: "500", color: "#2FBF8F", letterSpacing: "-0.01em" }}>3,500+</div>
            <div style={{ fontSize: "15px", color: "rgba(245,243,237,0.6)", marginTop: "10px" }}>Members supported into placements, internships and opportunities.</div>
          </div>
        </div>
      </section>

      {/* PATHERA AI SECTION */}
      <section id="pathera" style={{ maxWidth: "1360px", margin: "0 auto", padding: isMobile ? "56px 20px" : "110px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.1fr", gap: isMobile ? "32px" : "64px", alignItems: "center", border: "1px solid rgba(47,191,143,0.3)", borderRadius: "12px", padding: isMobile ? "32px 24px" : "56px", backgroundColor: "rgba(47,191,143,0.05)" }}>
          {/* Icon */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#2FBF8F" strokeWidth="1.2">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"></path>
            </svg>
          </div>

          {/* Copy */}
          <div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.1em", color: "#2FBF8F", marginBottom: "14px" }}>EXCLUSIVE PARTNER TECHNOLOGY</div>
            <h2 style={{ fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "clamp(28px, 3.2vw, 40px)", margin: "0 0 18px", lineHeight: "1.15", color: "#F5F3ED" }}>
              Your career, <span style={{ color: "#2FBF8F" }}>accelerated.</span>
            </h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "rgba(245,243,237,0.68)", margin: "0 0 20px", maxWidth: "520px" }}>
              Pathera gives LEAF members a genuine edge: instant CV analysis, structured interview preparation, and a career roadmap built around your goals.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(245,243,237,0.6)", marginBottom: "32px" }}>
              <Check size={16} style={{ color: "#2FBF8F", flexShrink: 0 }} />
              AI-powered CV grading & optimisation
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
              <Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: "9px", backgroundColor: "#2FBF8F", color: "#0B1410", textDecoration: "none", fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "15px", padding: "14px 24px", borderRadius: "4px", cursor: "pointer" }}>
                Visit Pathera.io
                <ArrowRight size={14} />
              </Link>
              <Link href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "9px", backgroundColor: "transparent", color: "#F5F3ED", textDecoration: "none", fontFamily: "Space Grotesk", fontWeight: "600", fontSize: "15px", padding: "14px 24px", borderRadius: "4px", border: "1.5px solid rgba(255,255,255,0.18)", cursor: "pointer" }}>
                Join community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{ maxWidth: "1360px", margin: "0 auto", padding: isMobile ? "0 20px 64px" : "0 32px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1.15fr", gap: isMobile ? "24px" : "64px" }}>
          <div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: "12px", letterSpacing: "0.1em", color: "#E8B923", marginBottom: "14px" }}>(02) ABOUT US</div>
            <h2 style={{ fontFamily: "Space Grotesk", fontWeight: "700", fontSize: "clamp(30px, 3.4vw, 44px)", margin: 0, lineHeight: "1.1", letterSpacing: "-0.01em", color: "#F5F3ED" }}>
              More than a network.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: "17px", lineHeight: "1.7", color: "rgba(245,243,237,0.72)", margin: "0 0 20px" }}>
              LEAF Pathways connects driven students with the careers they've been working towards. We're not another networking group — we're the insider knowledge your university never taught, the warm introductions, the curated opportunities, and the connections that actually open doors.
            </p>
            <p style={{ fontSize: "17px", lineHeight: "1.7", color: "rgba(245,243,237,0.72)", margin: "0 0 36px" }}>
              Built by students who've been there, we know how hard it is to break into competitive industries without the right people in your corner. That's precisely why LEAF exists.
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "28px" }}>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: "32px", fontWeight: "500", color: "#E8B923" }}>3,500+</div>
              <div style={{ fontSize: "14px", color: "rgba(245,243,237,0.5)", marginTop: "6px" }}>Members and counting</div>
              <p style={{ fontStyle: "italic", fontSize: "18px", color: "#F5F3ED", margin: "24px 0 0", fontFamily: "Space Grotesk", fontWeight: "500" }}>
                "We turn potential into placement."
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
