"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Engineering at Oxford",
    content: "LEAF completely changed my career trajectory. The networking opportunities here are unparalleled—I met my co-founder at a LEAF hackathon.",
    image: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Chen",
    role: "Finance at LSE",
    content: "The mentorship I received through LEAF helped me land my dream internship at a top-tier investment bank. The community is incredibly supportive.",
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "James Wilson",
    role: "CS at Imperial",
    content: "Being part of the Founder Circle gave me the confidence to launch my startup. The feedback from peers is honest and invaluable.",
    image: "https://i.pravatar.cc/150?u=james",
  },
  {
    name: "Emily Rodriguez",
    role: "Physics at Cambridge",
    content: "I've attended 5+ LEAF events this year. Each one has been high-energy and packed with brilliant minds. It's the best student network in the UK.",
    image: "https://i.pravatar.cc/150?u=emily",
  },
  {
    name: "Michael Park",
    role: "Economics at Warwick",
    content: "The level of talent in this community is insane. It's inspiring to be surrounded by so many ambitious people pushing each other to grow.",
    image: "https://i.pravatar.cc/150?u=michael",
  },
  {
    name: "Sophie Bennett",
    role: "Maths at Bristol",
    content: "LEAF bridge the gap between university and the real world. The industry speakers are world-class.",
    image: "https://i.pravatar.cc/150?u=sophie",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Voices of the <span className="text-gradient-gold">Next Gen</span>.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Don&apos;t just take our word for it. Here&apos;s what our members have to say about their LEAF experience.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid relative p-8 rounded-3xl border border-white/5 glass-emerald hover:border-emerald-500/20 transition-all duration-300 group"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors" />
              
              <p className="text-lg leading-relaxed mb-8 relative z-10">&quot;{t.content}&quot;</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
