"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-emerald-950/20">
      <div className="container px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl">L</div>
              <span>LEAF<span className="text-primary font-medium">Pathways</span></span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              The UK&apos;s premier student network for future founders, engineers, and tech leaders. We&apos;re building the infrastructure for the next generation of innovators.
            </p>
            <div className="flex gap-4">
               {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all">
                     <Icon className="w-5 h-5" />
                  </Link>
               ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white/50">Platform</h4>
            <ul className="space-y-4">
              {["About Us", "Our Events", "Mentorship", "Founder Circles", "Partner Jobs"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white/50">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">Join our newsletter for event drops and community news.</p>
            <div className="flex gap-2">
               <Input placeholder="Email address" className="rounded-xl bg-white/5 border-white/10" />
               <Button className="rounded-xl px-4 font-bold">Join</Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 LEAF Pathways. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
