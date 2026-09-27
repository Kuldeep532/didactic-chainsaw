import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Home from "./pages/Home";
import About from "./pages/About";
import Apps from "./pages/Apps";
import Utilities from "./pages/Utilities";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Disclaimer from "./pages/legal/Disclaimer";
import Accessibility from "./pages/legal/Accessibility";
import JoinTeam from "./pages/JoinTeam";

function FocusRouter() {
  return (
    <main id="main-content">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/apps" component={Apps} />
        <Route path="/utilities" component={Utilities} />
        <Route path="/join-team" component={JoinTeam} />
        <Route path="/legal/privacy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={Terms} />
        <Route path="/legal/refund" component={RefundPolicy} />
        <Route path="/legal/disclaimer" component={Disclaimer} />
        <Route path="/legal/accessibility" component={Accessibility} />
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
