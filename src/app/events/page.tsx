import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Users, Trophy, BookOpen, Briefcase, Hand } from "lucide-react";

export const metadata = {
  title: "Events | LEAF Pathways",
  description: "Explore LEAF's transformative events, bootcamps, and competitions.",
};

const events = [
  {
    id: "commercial-awareness",
    title: "Commercial Awareness Competition",
    icon: Trophy,
    description: "Test your business acumen against the brightest minds in the UK",
    shortDescription: "Competition",
    href: "/events/commercial-awareness",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "engineering-innovation",
    title: "Engineering Innovation Competition",
    icon: Briefcase,
    description: "Showcase your engineering skills and solve real-world problems",
    shortDescription: "Competition",
    href: "/events/engineering-innovation",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "leaf-hacks",
    title: "LEAF Hacks",
    icon: BookOpen,
    description: "24-hour hackathon bringing together builders, designers, and creators",
    shortDescription: "Hackathon",
    href: "/events/leaf-hacks",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "finance-bootcamp",
    title: "Finance Bootcamp",
    icon: Users,
    description: "Master financial skills and launch your career in finance",
    shortDescription: "Bootcamp",
    href: "/events/finance-bootcamp",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "apprenticeship-bootcamp",
    title: "Apprenticeship Bootcamp",
    icon: Calendar,
    description: "Comprehensive training for aspiring apprentices in tech and business",
    shortDescription: "Bootcamp",
    href: "/events/apprenticeship-bootcamp",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: "host-event",
    title: "Host an Event with Us",
    icon: Hand,
    description: "Partner with LEAF to create a transformative event for your organization",
    shortDescription: "Partnership",
    href: "/events/host-event",
    color: "from-green-500/20 to-emerald-500/20",
  },
];

const upcomingEvents = [
  {
    date: "Sep 15, 2024",
    title: "Commercial Awareness Competition Qualifiers",
    status: "Registration Open",
  },
  {
    date: "Oct 5, 2024",
    title: "LEAF Hacks 2024",
    status: "Coming Soon",
  },
  {
    date: "Nov 1, 2024",
    title: "Finance Bootcamp - Cohort 2",
    status: "Coming Soon",
  },
];

export default function Events() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Our Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transformative experiences designed to develop skills, build networks, and unlock opportunities.
            </p>
          </div>

          {/* Upcoming Events */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6">What's Coming</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Card key={event.title} className="bg-white/5 border-white/10 p-6 flex items-center justify-between hover:border-emerald-900/50 transition-colors">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                    <h3 className="font-semibold">{event.title}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    event.status === "Registration Open"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 text-muted-foreground"
                  }`}>
                    {event.status}
                  </span>
                </Card>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8">All Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const Icon = event.icon;
                return (
                  <Link key={event.id} href={event.href}>
                    <Card className={`h-full bg-gradient-to-br ${event.color} border-white/10 p-8 hover:border-emerald-900/50 hover:shadow-lg transition-all cursor-pointer group`}>
                      <Icon className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-emerald-400 font-semibold mb-3">
                        {event.shortDescription}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {event.description}
                      </p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Past Events */}
          <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Past Events & Case Studies</h2>
            <p className="text-muted-foreground mb-6">
              View detailed case studies from our previous events, including participant testimonials, impact metrics, and lessons learned.
            </p>
            <Link href="/events#past-events" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold">
              Explore Past Events →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
