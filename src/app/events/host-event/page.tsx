import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Host an Event with LEAF | LEAF Pathways",
  description: "Partner with LEAF to create a transformative event for your organization.",
};

export default function HostEvent() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to Events
          </Link>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Host an Event with LEAF
          </h1>
          <div className="prose prose-invert max-w-none space-y-8 text-lg mb-12">
            <p className="text-muted-foreground leading-relaxed">
              Want to reach thousands of talented students? Partner with LEAF to host an event, workshop, or competition. We'll handle the logistics while you focus on creating impact. Get in touch with our events team to explore opportunities.
            </p>
          </div>
          <Link href="/contact">
            <Button className="rounded-full glow-gold">Get in Touch</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
