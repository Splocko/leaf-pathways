"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Vestorgrow", logo: "https://leafpathways.com/images/partners/vestorgrow.webp" },
  { name: "Plug Summit", logo: "https://leafpathways.com/images/partners/plugsummit-sm.webp" },
  { name: "Atkins", logo: "https://leafpathways.com/images/partners/atkins.webp" },
  { name: "Oasis", logo: "https://leafpathways.com/images/partners/oasis-sm.webp" },
  { name: "Pathera", logo: "https://leafpathways.com/images/partners/pathera.webp" },
  { name: "SKL", logo: "https://leafpathways.com/images/partners/skl-sm.webp" },
  { name: "Taplab", logo: "https://leafpathways.com/images/partners/taplab.webp" },
  { name: "Unistrive", logo: "https://leafpathways.com/images/partners/unistrive.webp" },
];

export function Partners() {
  return (
    <section className="py-16 border-y border-white/5 bg-black/40">
      <div className="container px-6">
        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-10 opacity-60">
          POWERING THE ECOSYSTEM WITH
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              whileHover={{ scale: 1.05 }}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-6 md:h-8 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
