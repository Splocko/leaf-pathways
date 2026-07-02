"use client";

import { motion } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    title: "AI & LLM Hackathon",
    date: "July 12-14, 2026",
    location: "London, UK",
    attendees: "120+",
    tags: ["AI", "Tech", "Building"],
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070&auto=format&fit=crop",
    color: "from-emerald-500/20",
  },
  {
    title: "Venture Capital Summit",
    date: "August 5, 2026",
    location: "Oxford University",
    attendees: "300+",
    tags: ["Finance", "Startup", "Networking"],
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop",
    color: "from-amber-500/20",
  },
  {
    title: "Future of Fintech",
    date: "August 20, 2026",
    location: "Canary Wharf, London",
    attendees: "200+",
    tags: ["Fintech", "Finance", "Career"],
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
    color: "from-blue-500/20",
  },
  {
    title: "Founder Meetup",
    date: "Sept 2, 2026",
    location: "Cambridge, UK",
    attendees: "80+",
    tags: ["Startup", "Founders", "Social"],
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
    color: "from-rose-500/20",
  },
];

export function Events() {
  return (
    <section id="events" className="py-24 relative overflow-hidden bg-emerald-950/5">
      <div className="container px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Upcoming <span className="text-gradient-emerald">Experiences</span>.</h2>
            <p className="text-muted-foreground max-w-xl text-lg">
              Beyond just networking. We host high-impact events designed to challenge, inspire, and connect you with the right people.
            </p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-full border-white/10 glass">View All Events</Button>
          </div>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {events.map((event, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-emerald-900/10"
                >
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10", event.color)} />
                  
                  <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/10 text-white/80 border-none backdrop-blur-md px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors duration-300">{event.title}</h3>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.attendees} Attending</span>
                      </div>
                    </div>
                    
                    <Button className="w-full rounded-2xl h-12 font-bold glass-emerald border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all duration-300 group/btn">
                      Get Your Ticket
                      <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                  
                  {/* Decorative glow on hover */}
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-4 mt-12 px-12">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 border-white/10 glass hover:bg-white/5" />
            <CarouselNext className="static translate-y-0 h-12 w-12 border-white/10 glass hover:bg-white/5" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
