import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Commercial Awareness Competition | LEAF Pathways",
  description: "Test your business acumen and compete for recognition and prizes.",
};

export default function CommercialAwareness() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to Events
          </Link>

          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Commercial Awareness Competition
          </h1>

          <div className="prose prose-invert max-w-none space-y-8 text-lg mb-12">
            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">About the Competition</h2>
              <p className="text-muted-foreground leading-relaxed">
                Test your business acumen and strategic thinking against the brightest minds in the UK. The Commercial Awareness Competition brings together ambitious students who want to understand how businesses work, from market dynamics to financial strategy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">What to Expect</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Case study analysis and business problem-solving challenges</li>
                <li>• Networking with industry professionals and mentors</li>
                <li>• Multi-round competition format with increasing difficulty</li>
                <li>• Prizes, recognition, and opportunities with partner companies</li>
                <li>• Certificate of participation for all attendees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">Who Should Apply</h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're interested in consulting, investment banking, corporate strategy, or just want to develop your business thinking, this competition is for you. No prior experience necessary—just bring enthusiasm and a willingness to learn.
              </p>
            </section>

            <section className="bg-white/5 border border-emerald-900/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">2024 Details</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Dates:</strong> September 15 - October 15</p>
                <p><strong>Format:</strong> Online qualifiers + Final round</p>
                <p><strong>Team Size:</strong> 2-3 people per team</p>
                <p><strong>Registration Fee:</strong> Free for LEAF Network members</p>
              </div>
            </section>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">What Participants Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "This competition gave me real insight into how businesses operate. I learned so much from the case studies and the mentors were incredibly helpful."
                </p>
                <p className="font-semibold">Sarah T., University of Manchester</p>
              </Card>
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The competition was well-organized and the caliber of other competitors was outstanding. Great networking opportunity too."
                </p>
                <p className="font-semibold">James P., London School of Economics</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-900/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Registration for the 2024 Commercial Awareness Competition is now open. Spaces are limited, so secure yours today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="rounded-full glow-gold">
                Register Now
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
