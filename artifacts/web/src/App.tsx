import { Switch, Route, Router as WouterRouter } from "wouter";
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

function Router() {
  return (
    <Layout>
      <main id="main-content" tabIndex={-1}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/apps" component={Apps} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path="/legal/privacy" component={PrivacyPolicy} />
          <Route path="/legal/terms" component={Terms} />
          <Route path="/legal/refund" component={RefundPolicy} />
          <Route path="/legal/disclaimer" component={Disclaimer} />
          <Route path="/legal/accessibility" component={Accessibility} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </Layout>
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
              <Router />
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
