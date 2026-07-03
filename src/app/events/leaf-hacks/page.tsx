import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "LEAF Hacks | LEAF Pathways",
  description: "A 24-hour hackathon bringing together builders, designers, and creators.",
};

export default function LeafHacks() {
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
            LEAF Hacks
          </h1>

          <div className="prose prose-invert max-w-none space-y-8 text-lg mb-12">
            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">24 Hours of Innovation</h2>
              <p className="text-muted-foreground leading-relaxed">
                LEAF Hacks is our flagship 24-hour hackathon where 500+ students come together to build, create, and innovate. Whether you're a seasoned developer, a designer, or someone with a great idea, there's a place for you.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">What Makes LEAF Hacks Special</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Diverse teams bringing together engineers, designers, product managers, and marketers</li>
                <li>• Amazing prizes, sponsor challenges, and post-hackathon opportunities</li>
                <li>• Workshops and mentorship from experienced builders and startup founders</li>
                <li>• Free food, accommodation, and all resources you need</li>
                <li>• Networking with investors, tech leaders, and industry professionals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">Past Impact</h2>
              <p className="text-muted-foreground leading-relaxed">
                LEAF Hacks 2024 brought together 500+ participants from 30+ universities across the UK. Teams built 80+ projects, with 3 selected for follow-up funding conversations and 15+ participants hired by participating companies.
              </p>
            </section>

            <section className="bg-white/5 border border-emerald-900/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">2025 Edition</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Date:</strong> October 5-6, 2025</p>
                <p><strong>Location:</strong> London (UK Wide)</p>
                <p><strong>Registration:</strong> Coming Soon</p>
                <p><strong>Cost:</strong> Free for all participants</p>
              </div>
            </section>
          </div>

          {/* Sponsors */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Sponsors</h2>
            <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white/10 rounded-lg border border-white/20 flex items-center justify-center hover:border-emerald-500/50 transition-colors"
                  >
                    <span className="text-white/50 text-sm">Sponsor Logo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-900/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ students at LEAF Hacks 2025. Whether you're a builder, designer, or dreamer, there's a place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="rounded-full glow-gold">
                Register Interest
              </Button>
              <Button variant="outline" className="rounded-full">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
