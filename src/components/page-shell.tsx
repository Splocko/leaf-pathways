import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OrbBackground } from "@/components/orb-background";

// Every non-landing page renders through this so background, nav and footer
// are identical everywhere. Content goes in <section> blocks that use the
// shared container width (see PAGE_CONTAINER).
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <Navbar />
      <OrbBackground />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      <Footer />
    </main>
  );
}

// Canonical page width + horizontal padding — matches the landing page exactly.
export const PAGE_CONTAINER = "mx-auto max-w-[1360px] px-5 md:px-8";
