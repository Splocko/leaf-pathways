import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Radio, Video, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Media Hub | LEAF Pathways",
  description: "Explore LEAF's blog, webinars, and podcast content.",
};

const mediaTypes = [
  {
    icon: BookOpen,
    title: "Blog",
    description: "Newsletters, community spotlights, and in-depth case studies",
    href: "/media/blog",
    color: "from-emerald-500/20 to-teal-500/20",
    stats: "50+ Articles",
  },
  {
    icon: Video,
    title: "Pathways Webinar Series",
    description: "Live and recorded webinars featuring industry experts and mentors",
    href: "/media/webinars",
    color: "from-blue-500/20 to-cyan-500/20",
    stats: "20+ Webinars",
  },
  {
    icon: Radio,
    title: "Branching Out Podcast",
    description: "Stories from founders, innovators, and LEAF community members",
    href: "/media/podcast",
    color: "from-amber-500/20 to-orange-500/20",
    stats: "35+ Episodes",
  },
];

const recentContent = [
  {
    type: "Article",
    title: "How to Land Your First Tech Internship",
    excerpt: "A comprehensive guide with tips from recruiters and students who've been there.",
    date: "July 2, 2024",
    readTime: "5 min read",
  },
  {
    type: "Webinar",
    title: "Breaking into Consulting: Strategies & Insights",
    excerpt: "Expert panel discussion with consultants from top firms sharing their experiences.",
    date: "June 28, 2024",
    watchTime: "45 min",
  },
  {
    type: "Podcast",
    title: "From Student to Startup Founder",
    excerpt: "Listen to how Emma started her proptech company while still in university.",
    date: "June 25, 2024",
    watchTime: "32 min",
  },
  {
    type: "Case Study",
    title: "LEAF Hacks 2024: Innovation in Action",
    excerpt: "See how 500+ students built incredible projects in just 24 hours.",
    date: "June 20, 2024",
    readTime: "10 min read",
  },
];

export default function Media() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Media Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stories, insights, and learning from the LEAF community.
            </p>
          </div>

          {/* Media Type Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {mediaTypes.map((media) => {
              const Icon = media.icon;
              return (
                <Link key={media.href} href={media.href}>
                  <Card className={`h-full bg-gradient-to-br ${media.color} border-white/10 p-8 hover:border-emerald-900/50 hover:shadow-lg transition-all cursor-pointer group`}>
                    <Icon className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                      {media.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {media.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-400 font-semibold">
                        {media.stats}
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Recent Content */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Latest Content</h2>
            <div className="space-y-4">
              {recentContent.map((item) => (
                <Card key={item.title} className="bg-white/5 border-white/10 p-6 hover:border-emerald-900/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full">
                          {item.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {'watchTime' in item ? item.watchTime : item.readTime}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-900/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest articles, upcoming webinars, and podcast episodes delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
              />
              <button className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
