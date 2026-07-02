"use client";

import { motion } from "framer-motion";

export function Experience() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">The <span className="text-gradient-emerald">LEAF Experience</span>.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A glimpse into the energy, ambition, and community that makes LEAF unique.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
          {/* Main Large Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-2 row-span-2 rounded-[3rem] overflow-hidden relative group"
          >
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              alt="Conference" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent flex items-end p-12">
               <div>
                  <h3 className="text-3xl font-bold mb-2">Flagship Conferences</h3>
                  <p className="text-white/60">Annual summits featuring global leaders.</p>
               </div>
            </div>
          </motion.div>

          {/* Staggered Grid Images */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2.5rem] overflow-hidden relative group h-[290px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              alt="Hackathon" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="font-bold uppercase tracking-widest text-sm">Hackathons</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] overflow-hidden relative group h-[290px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              alt="Networking" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="font-bold uppercase tracking-widest text-sm">Founders</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-2 rounded-[2.5rem] overflow-hidden relative group h-[294px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              alt="Workshop" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="font-bold uppercase tracking-widest text-sm">Workshops</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
