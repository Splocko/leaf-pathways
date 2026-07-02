import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Partners } from "@/components/partners";
import { Features } from "@/components/features";
import { FinalCTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <Hero />
      <Partners />
      <Features />
      <FinalCTA />
      <Footer />
    </main>
  );
}
