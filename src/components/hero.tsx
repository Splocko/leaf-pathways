"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        
        <div className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, #059669 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="container relative z-10 max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Column - Minimalist Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1] mb-6">
              The Future of <br />
              <span className="text-emerald-500">Student Innovation</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Connecting the next generation of founders and creators. <br className="hidden md:block" />
              Efficiency and speed, built for the ambitious.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Join Community
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Pathera AI
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Morphing Video Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="flex-1 relative w-full flex justify-center items-center"
          >
            {/* The Morphing Orb Container */}
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center">
              {/* Animated Morphing Border (SVG Mask approach or border-radius animation) */}
              <motion.div 
                animate={{
                  borderRadius: [
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                    "30% 60% 70% 40% / 50% 60% 30% 60%",
                    "60% 40% 30% 70% / 60% 30% 70% 40%"
                  ],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-blue-500 to-amber-500 opacity-30 blur-2xl transform-gpu"
              />

              {/* The Video Shell (Orbed) */}
              <motion.div 
                animate={{
                  borderRadius: [
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                    "30% 60% 70% 40% / 50% 60% 30% 60%",
                    "60% 40% 30% 70% / 60% 30% 70% 40%"
                  ]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full h-full overflow-hidden border border-white/20 shadow-2xl transform-gpu z-10"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover scale-110"
                >
                  <source src="https://leafpathways.com/videos/vid1.webm" type="video/webm" />
                  <source src="https://leafpathways.com/videos/vid1.mp4" type="video/mp4" />
                </video>
                
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating Decorative Elements around the orb */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-10 left-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl animate-pulse delay-700" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
