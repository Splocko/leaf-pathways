import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Healthcare Bootcamp | LEAF Pathways",
  description: "UCAS prep, personal statements, work experience and application support.",
};

export default function HealthcareBootcamp() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to Events
          </Link>

          {/* Event image — 16/9, matches the thumbnail on the homepage event card */}
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", backgroundColor: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
            <span style={{ color: "#888", fontSize: "14px", fontWeight: 500 }}>[Event image]</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            LEAF Healthcare Bootcamp
          </h1>
          <div className="prose prose-invert max-w-none space-y-8 text-lg mb-12">
            <p className="text-muted-foreground leading-relaxed">
              UCAS prep, personal statements, work experience and application support for students pursuing a career in healthcare. More details coming soon.
            </p>
          </div>
          <Button className="rounded-full glow-gold">Register Interest</Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
