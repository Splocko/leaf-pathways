import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play, Music } from "lucide-react";

export const metadata = {
  title: "Branching Out Podcast | LEAF Pathways",
  description: "Stories from founders, innovators, and LEAF community members.",
};

const episodes = [
  {
    id: 1,
    title: "From Student to Startup Founder",
    guest: "Emma Watson",
    description: "Emma shares her journey of starting a proptech company while still in university and raising her first seed round.",
    date: "June 25, 2024",
    duration: "32 min",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Engineering at Scale: Lessons from Tech Giants",
    guest: "David Chen",
    description: "David discusses what it takes to build and scale engineering teams at companies like Google and Amazon.",
    date: "June 18, 2024",
    duration: "38 min",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "The Consultant's Path: McKinsey to Starting Your Own Firm",
    guest: "Michael Zhang",
    description: "Michael reveals the strategies that helped him transition from consulting to founding a successful advisory business.",
    date: "June 11, 2024",
    duration: "41 min",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Breaking Through Glass Ceilings: Women in Leadership",
    guest: "Sarah Patel",
    description: "Sarah discusses her experience as a woman in finance and how to navigate career growth in male-dominated industries.",
    date: "June 4, 2024",
    duration: "36 min",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
];

export default function Podcast() {
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
              Branching Out Podcast
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              Real stories from entrepreneurs, innovators, and community members who are branching out and making an impact.
            </p>

            {/* Podcast Platforms */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-lg gap-2">
                <Music className="w-4 h-4" />
                Apple Podcasts
              </Button>
              <Button variant="outline" className="rounded-lg gap-2">
                <Music className="w-4 h-4" />
                Spotify
              </Button>
              <Button variant="outline" className="rounded-lg gap-2">
                <Music className="w-4 h-4" />
                YouTube Music
              </Button>
            </div>
          </div>

          {/* Latest Episode Featured */}
          <Card className="mb-16 overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-900/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-square">
                <img
                  src={episodes[0].image}
                  alt={episodes[0].title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors cursor-pointer">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-0">
                <span className="text-emerald-400 text-sm font-semibold">Latest Episode</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 mt-2">
                  {episodes[0].title}
                </h2>
                <p className="text-emerald-400 font-semibold mb-4">
                  Featuring: {episodes[0].guest}
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {episodes[0].description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>{episodes[0].date}</span>
                  <span>•</span>
                  <span>{episodes[0].duration}</span>
                </div>
                <Button className="rounded-lg gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Play className="w-4 h-4" />
                  Listen Now
                </Button>
              </div>
            </div>
          </Card>

          {/* All Episodes */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">All Episodes</h2>
            <div className="space-y-4">
              {episodes.slice(1).map((episode) => (
                <Card key={episode.id} className="bg-white/5 border-white/10 p-6 hover:border-emerald-900/50 transition-colors group">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={episode.image}
                        alt={episode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors">
                          {episode.title}
                        </h3>
                        <p className="text-emerald-400 text-sm font-semibold mb-2">
                          Featuring: {episode.guest}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {episode.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                        <span>{episode.date}</span>
                        <span>•</span>
                        <span>{episode.duration}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Subscribe CTA */}
          <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss an Episode</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe on your favorite podcast platform to get notified when new episodes are available.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="rounded-lg">
                <Music className="w-4 h-4 mr-2" />
                Subscribe on Apple
              </Button>
              <Button variant="outline" className="rounded-lg">
                <Music className="w-4 h-4 mr-2" />
                Subscribe on Spotify
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
