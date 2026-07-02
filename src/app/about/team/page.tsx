import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Linkedin, Globe } from "lucide-react";

export const metadata = {
  title: "Meet the Team | LEAF Pathways",
  description: "Meet the student-run executive team behind LEAF Pathways.",
};

const teamMembers = [
  {
    name: "Team Member Name",
    role: "Co-Founder / President",
    bio: "Leading LEAF with vision and purpose",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    linkedin: "#",
  },
  {
    name: "Team Member Name",
    role: "Co-Founder / Vice President",
    bio: "Driving operations and strategy",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    linkedin: "#",
  },
  {
    name: "Team Member Name",
    role: "Events Director",
    bio: "Creating unforgettable experiences",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    linkedin: "#",
  },
  {
    name: "Team Member Name",
    role: "Partnerships Director",
    bio: "Building transformative partnerships",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    linkedin: "#",
  },
  {
    name: "Team Member Name",
    role: "Community Manager",
    bio: "Nurturing our vibrant community",
    image: "https://images.unsplash.com/photo-1507925921903-05dc0a0ecb1b?w=400&h=400&fit=crop",
    linkedin: "#",
  },
  {
    name: "Team Member Name",
    role: "Tech Lead",
    bio: "Building the digital infrastructure",
    image: "https://images.unsplash.com/photo-1500595046891-c6f5ccb14876?w=400&h=400&fit=crop",
    linkedin: "#",
  },
];

export default function Team() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <Link href="/about" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to About
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Meet the Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              LEAF is run by students, for students. Our executive team is made up of passionate individuals dedicated to creating transformative opportunities for our community.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden hover:shadow-lg transition-shadow group bg-white/5 border-white/10 hover:border-emerald-900/50">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-emerald-400 text-sm font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {member.bio}
                  </p>
                  <a
                    href={member.linkedin}
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-amber-400">Join Our Team</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Passionate about making a difference? We're always looking for driven individuals to join our mission. Whether you want to contribute to events, partnerships, or community, there's a place for you at LEAF.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold">
              Get in Touch →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
