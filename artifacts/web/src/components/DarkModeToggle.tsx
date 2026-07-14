import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon = resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;

  return (
    <button
      onClick={cycle}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 text-muted-foreground"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
    >
      {icon}
      {theme === "system" && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />
      )}
    </button>
  );
}
