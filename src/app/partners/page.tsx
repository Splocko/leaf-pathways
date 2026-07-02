import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Award, Target, TrendingUp, Building2, GraduationCap, Lightbulb } from "lucide-react";

export const metadata = {
  title: "Our Partners | LEAF Pathways",
  description: "Meet the organizations, companies, and institutions partnering with LEAF.",
};

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporates & Tech Companies",
    description: "Leading organizations seeking innovative talent and industry partnerships",
    count: "80+",
  },
  {
    icon: GraduationCap,
    title: "Universities & Schools",
    description: "Educational institutions supporting student development and outreach",
    count: "45+",
  },
  {
    icon: Lightbulb,
    title: "Startups & Scaleups",
    description: "Ambitious companies building the future with our community",
    count: "35+",
  },
];

const partners = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Partner Company ${i + 1}`,
  logo: `https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=200&h=200&fit=crop`,
}));

const highlightedPartners = [
  {
    name: "Tech Corp",
    testimonial: "LEAF has been instrumental in connecting us with top-tier talent. The events are well-organized and the community is incredibly engaged.",
    role: "CEO, Tech Solutions",
    offering: ["Brand Awareness", "Talent Sourcing", "Event Sponsorship"],
  },
  {
    name: "Innovation Labs",
    testimonial: "The quality of students and the professional execution of LEAF's bootcamps exceeded our expectations.",
    role: "Head of Recruitment, Innovation Labs",
    offering: ["Internship Opportunities", "Mentorship", "Case Competitions"],
  },
  {
    name: "Global Finance",
    testimonial: "A must-participate platform for companies serious about finding and nurturing future financial leaders.",
    role: "HR Director, Global Finance",
    offering: ["Graduate Programs", "Workshops", "Networking Events"],
  },
];

export default function Partners() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Our Partners
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built relationships with 150+ organizations—from Fortune 500 companies to innovative startups and leading universities.
            </p>
          </div>

          {/* Partner Types Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {partnerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card key={type.title} className="bg-white/5 border-white/10 p-8">
                  <Icon className="w-8 h-8 text-emerald-400 mb-4" />
                  <div className="text-4xl font-black text-emerald-400 mb-2">
                    {type.count}
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Partner Grid/Wall */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Our Partner Community</h2>
            <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="aspect-square bg-white/10 rounded-lg border border-white/20 hover:border-emerald-500/50 transition-colors flex items-center justify-center p-4 hover:shadow-lg cursor-pointer group"
                  >
                    <div className="text-center">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Highlighted Testimonials */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">What Our Partners Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {highlightedPartners.map((partner) => (
                <Card key={partner.name} className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-white/10 p-8">
                  <div className="mb-6">
                    <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 21c3 0 7-1 9-3s7-11 9-13c0-1-9-4-9-4s-7.092-1-9 2c-1.923 3-1.969 9.5 0 12.5C4.031 19.54 2 21 3 21z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "{partner.testimonial}"
                  </p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="font-semibold mb-3">{partner.name}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {partner.role}
                    </p>
                    <div className="space-y-2">
                      {partner.offering.map((item) => (
                        <div key={item} className="text-xs text-emerald-400">
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-white/10 rounded-lg p-12 mb-12">
            <h2 className="text-3xl font-bold mb-6">Partnership Value</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Award className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="font-bold mb-2">Brand Awareness</h3>
                <p className="text-muted-foreground text-sm">
                  Reach thousands of talented students and industry professionals.
                </p>
              </div>
              <div>
                <Target className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="font-bold mb-2">Talent Sourcing</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with pre-vetted candidates from top universities.
                </p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="font-bold mb-2">Event Sponsorship</h3>
                <p className="text-muted-foreground text-sm">
                  Sponsor transformative events that showcase your brand values.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of organizations making a real difference in students' lives and accessing untapped talent.
            </p>
            <Link href="/contact">
              <Button className="rounded-full glow-gold">
                Let's Talk About Partnership
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
