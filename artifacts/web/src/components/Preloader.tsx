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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-none transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <Hexagon
        className="h-12 w-12 text-foreground mb-4"
        strokeWidth={1}
      />
      <div className="h-[1px] w-24 bg-border overflow-hidden">
        <div className="h-full bg-foreground w-1/2 animate-[progress_1s_ease-in-out_infinite]" />
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}