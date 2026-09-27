import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import About from "./pages/About";
import Apps from "./pages/Apps";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Utilities from "./pages/Utilities";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Disclaimer from "./pages/legal/Disclaimer";
import Accessibility from "./pages/legal/Accessibility";
import JoinTeam from "./pages/JoinTeam";
import TeamAdmin from "./pages/TeamAdmin";

function FocusRouter() {

  return (
    <main id="main-content">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/account" component={Account} />
        <Route path="/about" component={About} />
        <Route path="/apps" component={Apps} />
        <Route path="/utilities" component={Utilities} />
        <Route path="/contact" component={Contact} />
        <Route path="/community" component={Community} />
        <Route path="/join-team" component={JoinTeam} />
        <Route path="/team-admin" component={TeamAdmin} />
        <Route path="/login" component={Login} />
        <Route path="/legal/privacy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={Terms} />
        <Route path="/legal/refund" component={RefundPolicy} />
        <Route path="/legal/disclaimer" component={Disclaimer} />
        <Route path="/legal/accessibility" component={Accessibility} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <FocusRouter />
    </WouterRouter>
  );
}

export default App;
