import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { TrendingUp, Users, Building2, Award } from "lucide-react";

export const metadata = {
  title: "Our Impact | LEAF Pathways",
  description: "Discover the impact LEAF has made in our community.",
};

const impactStats = [
  {
    icon: Users,
    number: "5,000+",
    label: "Community Members",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Building2,
    number: "150+",
    label: "Partner Organizations",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Award,
    number: "25+",
    label: "Events & Bootcamps",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: TrendingUp,
    number: "10,000+",
    label: "Opportunities Created",
    color: "from-pink-500/20 to-rose-500/20",
  },
];

const achievements = [
  {
    title: "Community Growth",
    description: "Built a thriving network of 5,000+ students across the UK from diverse backgrounds and universities.",
  },
  {
    title: "Industry Partnerships",
    description: "Established relationships with 150+ leading companies, startups, and institutions.",
  },
  {
    title: "Skill Development",
    description: "Delivered comprehensive bootcamps and training programs with 95% participant satisfaction.",
  },
  {
    title: "Career Acceleration",
    description: "Connected students with internships, graduate roles, and founding opportunities.",
  },
  {
    title: "Diversity & Inclusion",
    description: "Created pathways for underrepresented groups in tech and business.",
  },
  {
    title: "Innovation Pipeline",
    description: "Supported 30+ student-founded startups through mentorship and funding connections.",
  },
];

export default function Impact() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <Link href="/about" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-flex items-center gap-2">
            ← Back to About
          </Link>

          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Our Impact
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-16">
            The numbers that show what we've achieved for our community.
          </p>

          {/* Key Statistics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.color} border border-white/10 p-8 hover:shadow-lg transition-shadow`}
                >
                  <Icon className="w-8 h-8 text-emerald-400 mb-4" />
                  <div className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground">
                    {stat.label}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Achievements Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white">What We've Accomplished</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.title}
                  className="bg-white/5 border-white/10 p-6 hover:border-emerald-900/50 transition-colors"
                >
                  <h3 className="text-lg font-bold mb-2 text-emerald-400">
                    {achievement.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {achievement.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Case Studies Preview */}
          <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Case Studies</h2>
            <p className="text-muted-foreground mb-6">
              Want to see how LEAF has transformed students' lives and helped organizations discover talent? Explore our detailed case studies for real stories and measurable results.
            </p>
            <Link href="/events" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold">
              Read Our Event Case Studies →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
