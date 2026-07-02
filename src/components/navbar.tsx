"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    href: "/about",
    submenu: [
      { name: "Our Mission", href: "/about/mission" },
      { name: "Meet the Team", href: "/about/team" },
      { name: "Our Impact", href: "/about/impact" },
    ],
  },
  {
    name: "Partners",
    href: "/partners",
  },
  {
    name: "Events",
    href: "/events",
    submenu: [
      { name: "Overview", href: "/events" },
      { name: "Commercial Awareness Competition", href: "/events/commercial-awareness" },
      { name: "Engineering Innovation Competition", href: "/events/engineering-innovation" },
      { name: "LEAF Hacks", href: "/events/leaf-hacks" },
      { name: "Finance Bootcamp", href: "/events/finance-bootcamp" },
      { name: "Apprenticeship Bootcamp", href: "/events/apprenticeship-bootcamp" },
      { name: "Host an Event with Us", href: "/events/host-event" },
    ],
  },
  {
    name: "Media",
    href: "/media",
    submenu: [
      { name: "Blog", href: "/media/blog" },
      { name: "Pathways Webinar Series", href: "/media/webinars" },
      { name: "Branching Out Podcast", href: "/media/podcast" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-300",
        scrolled ? "pt-2" : "pt-6"
      )}
    >
      <nav
        className={cn(
          "flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-full border transition-all duration-300",
          scrolled 
            ? "glass-emerald shadow-2xl shadow-emerald-900/20 py-2 backdrop-blur-md bg-emerald-950/40 border-emerald-900/30" 
            : "bg-transparent border-transparent"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-3">
            <img 
              src="https://leafpathways.com/images/leaflogo-96.webp" 
              alt="LEAF Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-black tracking-tight hidden sm:inline">
              <span className="text-amber-500">LEAF</span>
              <span className="text-white">Pathways</span>
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1",
                  "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.name}
                {item.submenu && (
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {/* Dropdown Menu */}
              {item.submenu && (
                <div className="absolute left-0 mt-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-emerald-950/95 backdrop-blur-md border border-emerald-900/50 rounded-lg shadow-lg overflow-hidden">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors border-b border-emerald-900/30 last:border-b-0"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:flex text-sm">
            Login
          </Button>
          <Button className="rounded-full glow-gold text-sm px-6 hidden sm:flex">
            Join Network
          </Button>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-4 mx-4 bg-emerald-950/95 backdrop-blur-md border border-emerald-900/50 rounded-lg shadow-lg lg:hidden"
          >
            <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => !item.submenu && setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-emerald-900/30 flex flex-col gap-2">
                <Button variant="ghost" className="w-full justify-center">
                  Login
                </Button>
                <Button className="w-full rounded-lg glow-gold">
                  Join Network
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
