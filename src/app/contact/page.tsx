import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Instagram, Twitter } from "lucide-react";

export const metadata = {
  title: "Contact Us | LEAF Pathways",
  description: "Get in touch with the LEAF team. We'd love to hear from you.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@leafpathways.com",
    description: "Reach out with any questions or inquiries",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    value: "@leafpathways",
    description: "Connect with us on LinkedIn for updates",
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: "@leafpathways",
    description: "Follow us for community stories",
  },
  {
    icon: Twitter,
    title: "Twitter/X",
    value: "@leafpathways",
    description: "Latest news and announcements",
  },
];

const departments = [
  {
    name: "General Inquiries",
    email: "hello@leafpathways.com",
    description: "Questions about LEAF, membership, or general information",
  },
  {
    name: "Partnerships",
    email: "partnerships@leafpathways.com",
    description: "For companies and organizations interested in partnering with LEAF",
  },
  {
    name: "Events",
    email: "events@leafpathways.com",
    description: "Questions about our events, bootcamps, or competitions",
  },
  {
    name: "Media & Press",
    email: "media@leafpathways.com",
    description: "Press inquiries and media requests",
  },
];

export default function Contact() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question? Want to partner with us? We'd love to hear from you. Reach out using any of the methods below.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <Card key={info.title} className="bg-white/5 border-white/10 p-6 hover:border-emerald-900/50 transition-colors">
                  <Icon className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-bold mb-1">{info.title}</h3>
                  <p className="text-emerald-400 text-sm font-semibold mb-2">
                    {info.value}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {info.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Contact Form & Departments */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button className="w-full rounded-lg glow-gold">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Department Contacts */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Direct Contacts</h2>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <Card key={dept.name} className="bg-white/5 border-white/10 p-6">
                    <h3 className="font-bold mb-1">{dept.name}</h3>
                    <a href={`mailto:${dept.email}`} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold mb-2 inline-block">
                      {dept.email}
                    </a>
                    <p className="text-muted-foreground text-sm">
                      {dept.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white/5 border border-emerald-900/30 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">How do I join LEAF?</h3>
                <p className="text-muted-foreground text-sm">
                  You can join LEAF by signing up on our website or attending one of our events. Membership is free and open to students from all universities across the UK.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Are the events really free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Most of our events are free for LEAF Network members. Some premium bootcamps may have a small fee, but we always provide scholarships for those who need them.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">How can my organization partner with LEAF?</h3>
                <p className="text-muted-foreground text-sm">
                  We'd love to work with you! Email partnerships@leafpathways.com to discuss sponsorship, recruitment, or event collaboration opportunities.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">What's the best way to reach the LEAF team?</h3>
                <p className="text-muted-foreground text-sm">
                  For most inquiries, email hello@leafpathways.com. For specific departments, use the direct contacts listed above. You can also reach us through LinkedIn or Instagram.
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-900/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest news, event announcements, and opportunities delivered to your inbox.
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
