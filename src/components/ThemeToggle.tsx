import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-9 w-9 rounded-xl border border-border/40 bg-background/50 backdrop-blur-md overflow-hidden group hover:scale-110 transition-all duration-300"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === "dark" ? 0 : 90,
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-primary"
      >
        <Moon className="h-4.5 w-4.5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === "light" ? 0 : -90,
          scale: theme === "light" ? 1 : 0,
          opacity: theme === "light" ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-amber-500"
      >
        <Sun className="h-4.5 w-4.5" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
