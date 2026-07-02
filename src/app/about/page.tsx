"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function About() {
  const sections = [
    {
      title: "Our Mission",
      description: "Discover what LEAF is, our vision, and the purpose driving everything we do",
      href: "/about/mission",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "Meet the Team",
      description: "Get to know the student-run executive team behind LEAF Pathways",
      href: "/about/team",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      title: "Our Impact",
      description: "See the numbers that show what we've achieved for our community",
      href: "/about/impact",
      color: "from-blue-500/20 to-cyan-500/20",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              About LEAF Pathways
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Run by students for students. Empowering the next generation of founders, engineers, and leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {sections.map((section, idx) => (
              <Link key={section.href} href={section.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className={`h-full p-8 bg-gradient-to-br ${section.color} border border-white/10 hover:border-white/20 hover:shadow-lg transition-all cursor-pointer group`}>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {section.description}
                    </p>
                    <div className="flex items-center text-emerald-400 group-hover:translate-x-2 transition-transform">
                      <span className="text-sm font-semibold">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
