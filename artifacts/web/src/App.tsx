import { Router as WouterRouter } from "wouter";
import Home from "./pages/Home";

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Home />
    </WouterRouter>
  );
}
