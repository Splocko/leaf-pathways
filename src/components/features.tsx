"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Code2, 
  Briefcase, 
  Rocket, 
  Mic2, 
  Cpu, 
  Compass 
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Elite Networking",
    description: "Connect with the top 1% of students from across the UK.",
    icon: <Users className="w-8 h-8 text-primary" />,
    className: "col-span-1 md:col-span-2 row-span-1",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    title: "1:1 Mentorship",
    description: "Guidance from industry leaders at Google, Goldman Sachs, and top startups.",
    icon: <Target className="w-8 h-8 text-amber-500" />,
    className: "col-span-1 row-span-1",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    title: "AI Hackathons",
    description: "Build the future in our intensive, weekend-long building sprints.",
    icon: <Code2 className="w-8 h-8 text-cyan-500" />,
    className: "col-span-1 row-span-2",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    title: "Founder Circles",
    description: "Exclusive peer groups for student entrepreneurs building real products.",
    icon: <Rocket className="w-8 h-8 text-rose-500" />,
    className: "col-span-1 row-span-1",
    gradient: "from-rose-500/10 to-transparent",
  },
  {
    title: "Industry Speakers",
    description: "Weekly sessions with the people shaping our world.",
    icon: <Mic2 className="w-8 h-8 text-emerald-400" />,
    className: "col-span-1 md:col-span-2 row-span-1",
    gradient: "from-emerald-400/10 to-transparent",
  },
  {
    title: "Career Access",
    description: "Fast-track applications to our 25+ partner organisations.",
    icon: <Briefcase className="w-8 h-8 text-blue-500" />,
    className: "col-span-1 row-span-1",
    gradient: "from-blue-500/10 to-transparent",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Built for <span className="text-gradient-gold">Ambition</span>.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We provide the infrastructure for the next generation of leaders to thrive, connect, and build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-4 h-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative p-8 rounded-[2rem] border border-white/5 glass-emerald overflow-hidden hover:border-emerald-500/30 transition-all duration-500",
                feature.className
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0", feature.gradient)} />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-xs font-bold tracking-widest uppercase text-emerald-500">Learn More</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
