import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Our Mission | LEAF Pathways",
  description: "LEAF's mission, vision, and the purpose that drives everything we do.",
};

export default function Mission() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/about" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to About
          </Link>

          <h1 className="text-5xl md:text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Our Mission & Vision
          </h1>

          <div className="prose prose-invert max-w-none space-y-8 text-lg">
            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">What We Do</h2>
              <p className="text-muted-foreground leading-relaxed">
                LEAF Pathways is more than just a student network—we're a movement. Founded by and for students, we create opportunities that bridge the gap between aspiring talent and leading organizations. Through events, bootcamps, competitions, and community initiatives, we empower the next generation of founders, engineers, innovators, and leaders.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a future where every student has the tools, knowledge, and network to succeed. A world where the brightest talent is discovered early, nurtured thoughtfully, and connected with opportunities that align with their ambitions. LEAF is the catalyst that makes this possible—run by students who understand the student experience, for students who are ready to shape the future.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-emerald-400">Our Purpose</h2>
              <p className="text-muted-foreground leading-relaxed">
                We exist to democratize access to opportunities. Whether you're exploring a career path, launching a startup, honing your technical skills, or building your network, LEAF provides the events, mentorship, and community to help you thrive. We're committed to breaking down barriers and ensuring that talent, not privilege, is what gets noticed.
              </p>
            </section>

            <section className="bg-white/5 border border-emerald-900/30 rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Why It Matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                In a fast-changing world, students need more than grades. They need real-world exposure, industry connections, and the confidence to think big. LEAF fills that gap by creating transformative experiences that prepare students not just for jobs, but for impact.
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link href="/events">
              <Button className="rounded-full glow-gold">
                Explore Our Events
              </Button>
            </Link>
            <Link href="/about/team">
              <Button variant="outline" className="rounded-full">
                Meet the Team
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
