import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

export const metadata = {
  title: "Blog | LEAF Pathways",
  description: "Read our latest articles, newsletters, and community spotlights.",
};

const articles = [
  {
    id: 1,
    title: "How to Land Your First Tech Internship",
    excerpt: "A comprehensive guide with tips from recruiters and students who've been there.",
    author: "Sarah Chen",
    date: "July 2, 2024",
    readTime: "5 min",
    category: "Career",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "LEAF Community Spotlight: Meet Our Growth This Year",
    excerpt: "Celebrating 5,000 members, 150+ partners, and the incredible students making LEAF happen.",
    author: "LEAF Team",
    date: "June 28, 2024",
    readTime: "7 min",
    category: "Community",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "LEAF Hacks 2024: Case Study & Lessons Learned",
    excerpt: "Inside look at how 500+ students collaborated to build innovative solutions.",
    author: "Marcus Rodriguez",
    date: "June 20, 2024",
    readTime: "10 min",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Finance Bootcamp Grad Stories: From Learning to Landing Roles",
    excerpt: "Three students share how the bootcamp transformed their finance careers.",
    author: "Lisa Park",
    date: "June 15, 2024",
    readTime: "8 min",
    category: "Success Story",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
];

export default function Blog() {
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
              LEAF Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Stories, insights, and lessons from our community.
            </p>
          </div>

          {/* Featured Article */}
          <Card className="mb-16 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-2 h-full">
              <div className="relative aspect-video md:aspect-auto">
                <img
                  src={articles[0].image}
                  alt={articles[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 flex flex-col justify-center">
                <span className="text-emerald-400 text-sm font-semibold mb-2">Featured</span>
                <h2 className="text-3xl font-bold mb-4 hover:text-emerald-400 transition-colors">
                  {articles[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{articles[0].author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {articles[0].date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {articles[0].readTime} read
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {articles.slice(1).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video overflow-hidden bg-white/5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.readTime} read
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
