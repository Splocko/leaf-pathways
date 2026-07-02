import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Play, Lock } from "lucide-react";

export const metadata = {
  title: "Pathways Webinar Series | LEAF Pathways",
  description: "Watch upcoming and past webinars with industry experts and mentors.",
};

const webinars = [
  {
    id: 1,
    title: "Breaking into Consulting: Strategies & Insights",
    speaker: "Sarah Mitchell, Senior Consultant at McKinsey",
    date: "June 28, 2024",
    time: "6:00 PM GMT",
    duration: "45 min",
    status: "Recorded",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "The Art of Pitching: From Idea to Investment",
    speaker: "James Cooper, Founder of TechStart Ventures",
    date: "July 5, 2024",
    time: "5:30 PM GMT",
    duration: "60 min",
    status: "Coming Soon",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Career Transitions: Making Your Next Move",
    speaker: "Emma Rodriguez, Head of Talent at Google UK",
    date: "July 12, 2024",
    time: "6:00 PM GMT",
    duration: "50 min",
    status: "Coming Soon",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
];

export default function Webinars() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <Link href="/media" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to Media
          </Link>

          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Pathways Webinar Series
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Learn from industry experts, founders, and leaders. All webinars are free for LEAF Network members.
            </p>
          </div>

          {/* Webinar Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {webinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-gradient-to-br from-emerald-500/20 to-teal-500/20 overflow-hidden">
                  <img
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {webinar.status === "Recorded" ? (
                      <Play className="w-12 h-12 text-white" />
                    ) : (
                      <Lock className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      webinar.status === "Recorded"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {webinar.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                    {webinar.title}
                  </h3>
                  <p className="text-emerald-400 text-sm font-semibold mb-4">
                    {webinar.speaker}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {webinar.date} at {webinar.time}
                    </div>
                    <div>Duration: {webinar.duration}</div>
                  </div>
                  <Button className={`w-full rounded-lg ${
                    webinar.status === "Recorded"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-white/10 hover:bg-white/20"
                  }`}>
                    {webinar.status === "Recorded" ? "Watch Now" : "Register Interest"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">About the Webinar Series</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Pathways Webinar Series brings together industry professionals, experienced founders, and thought leaders to share their insights with the LEAF community.
              </p>
              <p>
                Whether you're exploring a career, launching a business, or developing new skills, our webinars provide valuable knowledge and networking opportunities—all free for LEAF Network members.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
