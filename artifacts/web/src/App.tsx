import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "./components/ThemeProvider";
import Preloader from "./components/Preloader";
import ChatbotWidget from "./components/ChatbotWidget";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Apps from "./pages/Apps";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import NexusAIWorkforce from "./pages/NexusAIWorkforce";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Disclaimer from "./pages/legal/Disclaimer";
import Accessibility from "./pages/legal/Accessibility";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function FocusRouter() {
  const [location] = useLocation();
  const previousLocation = useRef(location);

  useEffect(() => {
    if (location === previousLocation.current) return;
    previousLocation.current = location;

    const timer = setTimeout(() => {
      const target =
        (document.querySelector("h1") as HTMLElement | null) ??
        (document.querySelector("h2") as HTMLElement | null) ??
        document.getElementById("main-content");

      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: false });
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => target.removeAttribute("tabindex"), 100);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <Switch>
      <Route path="/nexus" component={NexusAIWorkforce} />
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/about" component={() => <Layout><About /></Layout>} />
      <Route path="/apps" component={() => <Layout><Apps /></Layout>} />
      <Route path="/contact" component={() => <Layout><Contact /></Layout>} />
      <Route path="/blog" component={() => <Layout><Blog /></Layout>} />
      <Route path="/blog/:slug" component={() => <Layout><BlogPost /></Layout>} />
      <Route path="/login" component={() => <Layout><Login /></Layout>} />
      <Route path="/admin" component={() => <Layout><Admin /></Layout>} />
      <Route path="/resources" component={() => <Layout><Resources /></Layout>} />
      <Route path="/legal/privacy" component={() => <Layout><PrivacyPolicy /></Layout>} />
      <Route path="/legal/terms" component={() => <Layout><Terms /></Layout>} />
      <Route path="/legal/refund" component={() => <Layout><RefundPolicy /></Layout>} />
      <Route path="/legal/disclaimer" component={() => <Layout><Disclaimer /></Layout>} />
      <Route path="/legal/accessibility" component={() => <Layout><Accessibility /></Layout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Preloader />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <FocusRouter />
            </WouterRouter>
            <Toaster />
            <ChatbotWidget />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
