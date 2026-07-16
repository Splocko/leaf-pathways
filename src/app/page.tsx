"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PartnerLogos } from "@/components/partner-logos";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { JoinCommunityDialog } from "@/components/join-community-dialog";
import { ComingSoon } from "@/components/coming-soon";

const testimonials = [
  {
    name: "Elliott Shaw",
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
    title: "Keynote Speaker & Award-Winning Investment Banker",
    quote: "LEAF is a highly professional organisation creating impact for thousands of young people throughout the UK.",
  },
  {
    name: "Tray-Sean Ben Salmi",
    title: "Keynote Speaker & Award-Winning Investment Banker",
    quote: "The events provide a perfect chance for participants to connect with professionals who can give valuable information about careers in finance.",
  },
  {
    name: "Adam Mlamali",
    title: "Higher Thought Representative",
    quote: "LEAF is contributing greatly towards solving the problem of access to opportunities through education, industry immersion and networking.",
  },
  {
    name: "Zeynel Tok",
    title: "Former Tech Apprentice turned Manager at Broadridge",
    quote: "These events not only supported students with their post-18 options, but also gave me the opportunity to engage and share my experiences with a large audience.",
  },
];

const communityPhotos = [
  { file: "community-01.jpg", alt: "LEAF students at a corporate insight day" },
  { file: "community-05.jpg", alt: "A packed auditorium at a LEAF event" },
  { file: "community-03.jpg", alt: "LEAF members at a community social" },
  { file: "community-07.jpg", alt: "A speaker taking questions at a LEAF event" },
  { file: "community-09.jpg", alt: "Networking circles at a LEAF bootcamp" },
  { file: "community-12.jpg", alt: "Students on stage at a LEAF competition" },
  { file: "community-02.jpg", alt: "LEAF students visiting a partner office" },
  { file: "community-11.jpg", alt: "Discussion groups at a LEAF event" },
  { file: "community-14.jpg", alt: "Finalists on stage at a LEAF competition" },
  { file: "community-06.jpg", alt: "The audience at a LEAF keynote" },
  { file: "community-13.jpg", alt: "A LEAF workshop session" },
  { file: "community-04.jpg", alt: "LEAF members at an insight day" },
  { file: "community-10.jpg", alt: "Students networking at a LEAF event" },
  { file: "community-08.jpg", alt: "A full house at a LEAF event" },
];

function PhotoMarquee() {
  const rowA = communityPhotos.slice(0, 7);
  const rowB = communityPhotos.slice(7);

  const renderRow = (row: typeof communityPhotos, direction: "left" | "right") => (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div className={direction === "left" ? "marquee-track-left" : "marquee-track-right"} style={{ display: "flex", gap: "16px", width: "max-content", paddingRight: "16px" }}>
        {[...row, ...row].map((photo, idx) => (
          <img
            key={idx}
            src={`/events/thumbs/${photo.file}`}
            alt={idx < row.length ? photo.alt : ""}
            aria-hidden={idx >= row.length}
            width={320}
            height={214}
            loading="lazy"
            style={{ width: "320px", height: "214px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section aria-label="LEAF events in photos" style={{ padding: "0 0 8px", overflow: "hidden" }}>
      <div className="px-5 md:px-8" style={{ maxWidth: "1360px", margin: "0 auto 40px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", color: "#2FBF8F", marginBottom: "14px" }}>(02) THE COMMUNITY</div>
        <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: "1.1", margin: 0, letterSpacing: "-0.01em", color: "#F5F3ED" }}>
          From the group chat to <span style={{ color: "#2FBF8F" }}>real life</span>.
        </h2>
        <p style={{ fontSize: "16px", color: "rgba(245,243,237,0.6)", margin: "14px 0 0", maxWidth: "520px" }}>
          Bootcamps, competitions, insight days and socials: this is what LEAF looks like in person today.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {renderRow(rowA, "left")}
        {renderRow(rowB, "right")}
      </div>
    </section>
  );
}

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
      <blockquote style={{ fontFamily: "var(--font-sans)", fontSize: "16px", lineHeight: "1.6", color: "#F5F3ED", margin: 0, fontStyle: "italic", borderLeft: "4px solid #E8B923", paddingLeft: "20px" }}>
        "{current.quote}"
      </blockquote>

      {/* Attribution */}
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: "600", fontSize: "14px", color: "#F5F3ED" }}>
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

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <Navbar />

      {/* Background orbs — placed at different depths so they scroll naturally */}

      {/* Orb 1: Hero area — no blur filter: softness is baked into the gradient falloff so iOS Safari paints it correctly and cheaply */}
      <div className="animate-orb-drift" style={{
        position: "absolute", top: "30vh", left: "50%",
        width: "min(130vw, 980px)", height: "min(130vw, 980px)",
        background: "radial-gradient(circle, rgba(47, 191, 143, 0.46) 0%, rgba(47, 191, 143, 0.19) 34%, rgba(5, 30, 18, 0.06) 58%, transparent 74%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        transform: "translate(-50%, -50%)",
      }} />

      {/* Orb 2: Mid-page, offset to the right */}
      <div className="animate-orb-drift" style={{
        position: "absolute", top: "130vh", left: "65%",
        width: "min(105vw, 780px)", height: "min(105vw, 780px)",
        background: "radial-gradient(circle, rgba(47, 191, 143, 0.36) 0%, rgba(47, 191, 143, 0.14) 34%, rgba(5, 30, 18, 0.05) 58%, transparent 74%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        transform: "translate(-50%, -50%)",
        animationDelay: "-6s",
      }} />

      {/* Orb 3: Lower section, offset to the left */}
      <div className="animate-orb-drift" style={{
        position: "absolute", top: "250vh", left: "30%",
        width: "min(115vw, 860px)", height: "min(115vw, 860px)",
        background: "radial-gradient(circle, rgba(47, 191, 143, 0.38) 0%, rgba(47, 191, 143, 0.15) 34%, rgba(5, 30, 18, 0.05) 58%, transparent 74%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        transform: "translate(-50%, -50%)",
        animationDelay: "-12s",
      }} />

      {/* HERO SECTION */}
      <section id="top" className="px-5 pt-8 pb-7 md:px-8 md:pt-24" style={{ maxWidth: "1360px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-10 md:gap-16 items-center">
          {/* Left column */}
          <div>
            {/* Eyebrow pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(232,185,35,0.4)", backgroundColor: "rgba(232,185,35,0.08)", color: "#E8B923", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "500", letterSpacing: "0.08em", padding: "7px 14px", borderRadius: "999px", marginBottom: "28px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#E8B923" }}></span>
              NEW EVENTS: REGISTER NOW
            </div>

            {/* H1 */}
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "clamp(46px, 8vw, 72px)", lineHeight: "1.03", letterSpacing: "-0.02em", margin: "0 0 20px", color: "#F5F3ED" }}>
              The Home of<br /><span style={{ color: "#E8B923" }}>Ambition</span>.
            </h1>

            {/* Subhead */}
            <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", lineHeight: "1.55", color: "rgba(245,243,237,0.68)", maxWidth: "520px", margin: "0 0 clamp(20px, 3vw, 32px)" }}>
              The UK student network for <strong style={{ color: "#F5F3ED", fontWeight: "600" }}>Law, Engineering/Tech, and Finance</strong>. Creating opportunities for the next generation of young professionals.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <JoinCommunityDialog style={{ display: "inline-flex", alignItems: "center", gap: "9px", background: "linear-gradient(180deg, #F5CB3D 0%, #E8B923 55%, #D9A70F 100%)", color: "#0B1410", fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "15px", padding: "15px 28px", borderRadius: "999px", border: "none", cursor: "pointer", boxShadow: "0 6px 18px rgba(232,185,35,0.35)" }}>
                Join the community
                <ArrowRight size={16} />
              </JoinCommunityDialog>
            </div>

            {/* Member count */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "22px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(26px, 6vw, 34px)", fontWeight: "500", color: "#E8B923", lineHeight: 1, letterSpacing: "-0.01em", flexShrink: 0 }}>4,300+</span>
              <span style={{ fontSize: "14px", lineHeight: 1.35, color: "rgba(245,243,237,0.6)", maxWidth: "240px" }}>students &amp; young professionals building momentum</span>
            </div>
          </div>

          {/* Right column - Hero video */}
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", width: "100%", aspectRatio: "16/9", backgroundColor: "rgba(245,243,237,0.03)" }}>
              <video autoPlay muted loop playsInline poster="/videos/vid1_poster.webp" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
                <source src="/videos/vid1.mp4" type="video/mp4" />
              </video>
            </div>
            {/* Corner brackets — curved to match the rounder button language */}
            <div style={{ position: "absolute", top: "-10px", left: "-10px", width: "34px", height: "34px", borderTop: "3px solid #E8B923", borderLeft: "3px solid #E8B923", borderTopLeftRadius: "14px" }}></div>
            <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "34px", height: "34px", borderBottom: "3px solid #E8B923", borderRight: "3px solid #E8B923", borderBottomRightRadius: "14px" }}></div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY SECTION - Two Carousels */}
      <section className="pt-12 pb-14 md:pt-[70px] md:pb-[90px]" style={{ borderTop: "1px solid rgba(255,255,255,0.16)", borderBottom: "1px solid rgba(255,255,255,0.16)", overflow: "visible" }}>
        <div className="px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start" style={{ maxWidth: "1360px", margin: "0 auto" }}>
          {/* Left: Partner Logos Carousel */}
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(245,243,237,0.4)", margin: "0 0 32px" }}>
              TRUSTED BY
            </h3>
            <div style={{ overflow: "hidden", position: "relative", height: "116px", width: "100%" }}>
              <div data-carousel style={{ display: "flex", gap: "24px", animation: "logoCarousel 26s linear infinite", willChange: "transform", width: "max-content" }}>
                {[...PartnerLogos, ...PartnerLogos].map((partner, idx) => (
                  <div key={idx} style={{ width: "204px", height: "108px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "22px 28px" }}>
                    <img src={partner.logo} alt={partner.name} style={{ maxWidth: "100%", maxHeight: "36px", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.72 }} onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Testimonials Carousel */}
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(245,243,237,0.4)", margin: "0 0 32px" }}>
              STUDENT & PARTNER VOICES
            </h3>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>

        <style>{`
          @keyframes logoCarousel {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-228px * ${PartnerLogos.length})); }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-carousel] { animation: none !important; }
          }
        `}</style>
      </section>

      {/* EVENTS SECTION — copy left, cards right */}
      <section id="events" className="px-5 py-14 md:px-8 md:pt-[110px] md:pb-[100px]" style={{ maxWidth: "1360px", margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,400px)_1fr] gap-10 md:gap-16 md:items-center">
          {/* Left — copy + CTA */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", color: "#2FBF8F", marginBottom: "14px" }}>(01) UPCOMING EVENTS</div>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: "1.1", margin: 0, letterSpacing: "-0.01em", color: "#F5F3ED" }}>
              Connect at our <span style={{ color: "#E8B923" }}>major events</span>.
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(245,243,237,0.6)", margin: "16px 0 28px" }}>A packed calendar this year. Book your place before spots fill up.</p>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#F5F3ED", textDecoration: "none", fontWeight: "600", fontSize: "14px", border: "1px solid rgba(255,255,255,0.18)", padding: "12px 20px", borderRadius: "4px", cursor: "pointer" }}>
              View full calendar
              <ArrowRight size={14} />
            </Link>
          </div>
          {/* Right — under construction */}
          <div>
            <ComingSoon
              eyebrow="Under construction"
              title="Our events calendar is being rebuilt"
              message="We're doing some work behind the scenes. Join the community below and we'll let you know the moment events go live again."
            />
          </div>
        </div>
      </section>

      {/* COMMUNITY PHOTO MARQUEE */}
      <PhotoMarquee />

      {/* STATS SECTION */}
      <section id="stats" style={{ borderTop: "1px solid rgba(255,255,255,0.16)", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>
        <div className="px-5 md:px-8 grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div className="py-10 md:py-14 md:pr-10 border-b md:border-b-0 md:border-r border-white/[0.16]">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "44px", fontWeight: "500", color: "#E8B923", letterSpacing: "-0.01em" }}>4,300+</div>
            <div style={{ fontSize: "15px", color: "rgba(245,243,237,0.6)", marginTop: "10px" }}>Students & young professionals in the LEAF community, and growing every day.</div>
          </div>
          <div className="py-10 md:py-14 md:pl-10">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "44px", fontWeight: "500", color: "#2FBF8F", letterSpacing: "-0.01em" }}>10,000+</div>
            <div style={{ fontSize: "15px", color: "rgba(245,243,237,0.6)", marginTop: "10px" }}>Students supported nationwide with careers, experiences and networks.</div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="px-5 pt-14 pb-16 md:px-8 md:pt-[110px] md:pb-[120px]" style={{ maxWidth: "1360px", margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-6 md:gap-16">
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", color: "#E8B923", marginBottom: "14px" }}>(03) ABOUT US</div>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "clamp(30px, 3.4vw, 44px)", margin: 0, lineHeight: "1.1", letterSpacing: "-0.01em", color: "#F5F3ED" }}>
              More than a network.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: "17px", lineHeight: "1.7", color: "rgba(245,243,237,0.72)", margin: "0 0 20px" }}>
              LEAF Pathways is one of the UK's fastest-growing student communities: the home of opportunity for the next generation of ambitious young professionals. Our mission is to inspire youth early, so every young person has a competitive shot at success, regardless of their background.
            </p>
            <p style={{ fontSize: "17px", lineHeight: "1.7", color: "rgba(245,243,237,0.72)", margin: "0 0 36px" }}>
              Spanning Law, Engineering, Tech and Finance, LEAF has supported 10,000+ students nationwide with the careers, experiences, and networks that were once out of reach.
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "28px" }}>
              <p style={{ fontStyle: "italic", fontSize: "18px", color: "#F5F3ED", margin: 0, fontFamily: "var(--font-sans)", fontWeight: "500" }}>
                "Success is built together, not alone."
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
