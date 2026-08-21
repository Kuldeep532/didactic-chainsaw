import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import Preloader from "./components/Preloader";
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
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Disclaimer from "./pages/legal/Disclaimer";
import Accessibility from "./pages/legal/Accessibility";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function FocusRouter() {
  const [location] = useLocation();
  const previous = useRef(location);
  useEffect(() => { if (location === previous.current) return; previous.current = location; document.querySelector("h1")?.focus({ preventScroll: false }); }, [location]);
  return <Layout><Switch>
    <Route path="/" component={Home} /><Route path="/about" component={About} /><Route path="/apps" component={Apps} />
    <Route path="/contact" component={Contact} /><Route path="/blog" component={Blog} /><Route path="/blog/:slug" component={BlogPost} />
    <Route path="/resources" component={Resources} /><Route path="/login" component={Login} /><Route path="/admin" component={Admin} />
    <Route path="/legal/privacy" component={PrivacyPolicy} /><Route path="/legal/terms" component={Terms} /><Route path="/legal/refund" component={RefundPolicy} />
    <Route path="/legal/disclaimer" component={Disclaimer} /><Route path="/legal/accessibility" component={Accessibility} /><Route component={NotFound} />
  </Switch></Layout>;
}

export default function App() {
  return <ThemeProvider><AuthProvider><QueryClientProvider client={queryClient}><TooltipProvider><Preloader /><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><FocusRouter /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider></AuthProvider></ThemeProvider>;
}
