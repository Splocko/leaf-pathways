import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://leaf-pathways.vercel.app"),
  title: "LEAF Pathways | The UK Student Network for Law, Engineering/Tech and Finance",
  description:
    "One of the UK's fastest-growing student communities. LEAF has supported 10,000+ students nationwide with the careers, experiences and networks that were once out of reach.",
  openGraph: {
    title: "LEAF Pathways | The Home of Opportunity",
    description:
      "Join 4,000+ students and young professionals across Law, Engineering/Tech and Finance. Events, bootcamps, competitions and real connections.",
    url: "https://leaf-pathways.vercel.app",
    siteName: "LEAF Pathways",
    images: [{ url: "https://leafpathways.com/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEAF Pathways | The Home of Opportunity",
    description:
      "Join 4,000+ students and young professionals across Law, Engineering/Tech and Finance.",
    images: ["https://leafpathways.com/og-image.jpg"],
  },
};

export const viewport = {
  themeColor: "#020704",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://leafpathways.com");
  preconnect("https://cueuwyazwjikiogxsbrs.supabase.co");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen font-sans antialiased",
        hanken.variable,
        plexMono.variable
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
