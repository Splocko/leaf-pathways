"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container px-6 max-w-7xl relative z-10">
        <div className="glass-emerald rounded-[4rem] p-12 md:p-24 border border-emerald-500/20 text-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent z-0" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-bold mb-8 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Limited Applications for 2026
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
              Join the next generation <br /> 
              of <span className="text-gradient-gold">Innovators</span>.
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Stop waiting for the future. Start building it. Join 4,600+ ambitious students shaping the UK&apos;s technology and finance landscape.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl font-bold glow-gold group">
                Join Community
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-xl font-bold border-white/10 glass hover:bg-white/5 transition-all">
                View Events
              </Button>
            </div>
            
            <p className="mt-12 text-sm text-muted-foreground">
              Applications open for Summer 2026 events. <span className="text-emerald-500 font-bold">9 spots left</span> for Founder Masterclass.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
