"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet"

const dropdownItems: Record<string, { title: string; desc?: string }[]> = {
  "About us": [
    { title: "Our mission", desc: "What LEAF is, and why it exists." },
    { title: "Meet the team", desc: "Run by students, for students." },
    { title: "Our impact", desc: "The numbers behind the network." },
  ],
  Partners: [
    { title: "Our partners", desc: "Every organisation in the network." },
    { title: "Corporate partners", desc: "Talent sourcing & brand awareness." },
    { title: "University partners", desc: "Careers teams & student societies." },
  ],
  Events: [
    { title: "Overview" },
    { title: "Commercial Awareness Competition" },
    { title: "Engineering Innovation Competition" },
    { title: "LEAF Hacks" },
    { title: "Finance Bootcamp" },
    { title: "Apprenticeship Bootcamp" },
  ],
  Media: [
    { title: "Blog", desc: "Newsletters & community spotlights." },
    { title: "Pathways Webinar Series", desc: "Upcoming & past webinars." },
    { title: "Branching Out Podcast", desc: "YouTube · Spotify · Apple Podcasts." },
  ],
}

export function FloatingHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky z-50 mx-auto w-full transition-all duration-300 ease-out",
        scrolled
          ? "top-4 max-w-[1328px] rounded-xl border border-border bg-background/90 shadow-lg backdrop-blur-lg supports-[backdrop-filter]:bg-background/75"
          : "top-0 max-w-none rounded-none border-transparent bg-transparent shadow-none"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1360px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img
            src="https://leafpathways.com/images/leaflogo.png"
            alt="LEAF Pathways"
            className="h-8 w-auto"
          />
          <span className="text-base font-semibold tracking-tight">
            <span className="text-primary">LEAF</span>
            <span className="text-foreground"> Pathways</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          <Link href="#top" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Home
          </Link>

          {Object.entries(dropdownItems).map(([label, items]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => setOpenMenu(label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1"
                )}
              >
                {label}
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    openMenu === label && "rotate-180"
                  )}
                />
              </button>

              {openMenu === label && (
                <div className="absolute top-full left-0 w-[280px] pt-2">
                  <div className="rounded-lg border border-border bg-popover p-2 shadow-lg">
                    {items.map((item, idx) => (
                      <Link
                        key={idx}
                        href="#"
                        className={cn(
                          "block rounded-md px-3 py-2 hover:bg-muted",
                          (label === "Partners" || label === "Events") &&
                            idx === items.length - 1 &&
                            "border-b border-border mb-1 pb-3"
                        )}
                      >
                        <div className="text-sm font-semibold text-foreground">
                          {item.title}
                        </div>
                        {item.desc && (
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {item.desc}
                          </div>
                        )}
                      </Link>
                    ))}
                    {(label === "Partners" || label === "Events") && (
                      <Link
                        href="#contact"
                        className="block rounded-md px-3 py-2 hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-primary">
                          {label === "Partners"
                            ? "Partner with us →"
                            : "Host an event with us →"}
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="https://pathera.io"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden opacity-70 sm:inline-flex"
            )}
          >
            Pathera
          </Link>

          <Link
            href="#contact"
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            Join Network
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden"
            >
              {mobileOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
            </Button>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="gap-0 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/85"
            >
              <div className="grid gap-y-1 overflow-y-auto px-4 pt-12 pb-5">
                <Link href="#top" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  Home
                </Link>
                <Link href="#events" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  Events
                </Link>
                <Link href="#partners" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  Partners
                </Link>
                <Link href="#about" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  About us
                </Link>
                <Link href="#" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  Media
                </Link>
                <Link href="#" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  LEAF Academy
                </Link>
                <Link
                  href="https://pathera.io"
                  target="_blank"
                  className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                >
                  Pathera
                </Link>
                <Link href="#contact" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                  Contact
                </Link>
              </div>
              <SheetFooter className="flex-row">
                <Link href="#" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                  Login
                </Link>
                <Link href="#contact" className={cn(buttonVariants(), "flex-1")}>
                  Join Network
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
