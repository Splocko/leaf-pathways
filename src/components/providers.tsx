"use client";

import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/smooth-scroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScroll />
      {children}
    </ThemeProvider>
  );
}
