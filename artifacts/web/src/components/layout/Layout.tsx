import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DevotionalBanner from "../DevotionalBanner";
import GlobalMessageBanner from "../GlobalMessageBanner";
import BackToTop from "../BackToTop";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Skip to main content link for keyboard and screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm font-medium"
      >
        Skip to main content
      </a>
      <DevotionalBanner />
      <GlobalMessageBanner />
      <Navbar />
      <main 
        id="main-content" 
        tabIndex={-1} 
        className="flex-1 w-full outline-none focus:outline-none"
        role="main"
      >
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
