import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback(() => {
    // 1. Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 2. Move keyboard/screen-reader focus to the top navigation or main heading
    const target =
      document.querySelector("header a[href='#main-content']") as HTMLElement | null ??
      document.querySelector("header nav") as HTMLElement | null ??
      document.querySelector("h1") as HTMLElement | null ??
      document.getElementById("main-content");
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      // Remove tabindex after focus so it doesn't stay in tab order
      setTimeout(() => target.removeAttribute("tabindex"), 1000);
    }
  }, []);

  if (!visible) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className="fixed bottom-6 right-6 z-40 shadow-lg rounded-full"
      onClick={handleClick}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}
