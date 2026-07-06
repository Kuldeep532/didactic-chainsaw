import { useState, useEffect } from "react";
import { Hexagon } from "lucide-react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 300);
    const t2 = setTimeout(() => setVisible(false), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-none ${fadeOut ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
    >
      <div className="relative">
        <Hexagon
          className="h-16 w-16 text-primary animate-pulse"
          strokeWidth={2.5}
        />
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-ping" />
      </div>
      <p className="mt-6 text-sm text-muted-foreground font-medium tracking-wide animate-pulse">
        Nexus Wave Technologies
      </p>
    </div>
  );
}
