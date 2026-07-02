"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, Globe, Sparkles, BookOpen } from "lucide-react";

const benefits = [
  {
    title: "Exclusive Networking",
    description: "Direct access to the most ambitious students across the country.",
    icon: <Globe className="w-6 h-6 text-emerald-500" />,
  },
  {
    title: "Founder Circles",
    description: "Join peer groups of builders and creators actually shipping products.",
    icon: <Zap className="w-6 h-6 text-amber-500" />,
  },
  {
    title: "Industry Fast-Track",
    description: "Specialized application channels for our partner organisations.",
    icon: <Shield className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Expert Workshops",
    description: "Learn practical skills from leaders in tech and finance.",
    icon: <BookOpen className="w-6 h-6 text-rose-500" />,
  },
  {
    title: "Early Access",
    description: "Be the first to know about high-profile conferences and meetups.",
    icon: <Sparkles className="w-6 h-6 text-cyan-500" />,
  },
];

export function Benefits() {
  return (
    <section className="py-24 relative overflow-hidden bg-emerald-950/5">
      <div className="container px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Visual Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/5 flex items-center justify-center p-12 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700" />
               <div className="relative z-10 glass p-12 rounded-[2rem] border-white/10 shadow-2xl backdrop-blur-2xl">
                  <div className="text-4xl font-black mb-6">Experience <br /> <span className="text-primary">Difference.</span></div>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                           <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                           <div className="h-2 w-32 bg-white/10 rounded-full" />
                        </div>
                     ))}
                  </div>
               </div>
               
               {/* Decorative floating elements */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-10 right-10 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl" 
               />
               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-10 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" 
               />
            </div>
          </motion.div>

          {/* Right: Benefits List */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Unlock the <span className="text-gradient-gold">Full Potential</span> of your Network.
            </h2>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              We&apos;ve built the ultimate ecosystem for students who want more than just a degree. Get the tools, connections, and knowledge to lead.
            </p>
            
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
