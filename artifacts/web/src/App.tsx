import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "./pages/Home";

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <main id="main-content">
        <Switch>
          <Route path="/" component={Home} />
          <Route>
            <Home />
          </Route>
        </Switch>
      </main>
    </WouterRouter>
  );
}
