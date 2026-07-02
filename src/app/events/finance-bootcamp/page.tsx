import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Finance Bootcamp | LEAF Pathways",
  description: "Master financial skills and launch your career in finance.",
};

export default function FinanceBootcamp() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to Events
          </Link>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Finance Bootcamp
          </h1>
          <div className="prose prose-invert max-w-none space-y-8 text-lg mb-12">
            <p className="text-muted-foreground leading-relaxed">
              Master the fundamentals of finance with our intensive bootcamp. Learn from industry experts and set yourself up for a successful career in finance. More details coming soon.
            </p>
          </div>
          <Button className="rounded-full glow-gold">Register Interest</Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
