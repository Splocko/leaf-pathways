"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  { label: "Members", value: "4,629+", detail: "Ambitious Students" },
  { label: "Events", value: "120+", detail: "Hosted Annually" },
  { label: "Partners", value: "25+", detail: "Top Organisations" },
  { label: "Connections", value: "10K+", detail: "Made Monthly" },
];

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-emerald-500/10 blur-[150px] z-0" />
      
      <motion.div 
        style={{ opacity, scale }}
        className="container px-6 max-w-7xl relative z-10"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-sm font-bold tracking-widest uppercase text-primary mb-2 group-hover:scale-110 transition-transform">
                  {stat.label}
                </div>
                <div className="text-6xl md:text-7xl font-black mb-4 tracking-tighter text-white">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.detail}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        
        {/* Animated Light Sweep */}
        <div className="mt-32 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
