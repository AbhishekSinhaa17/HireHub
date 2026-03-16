// src/components/Navbar.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut, Menu, X, Mail, Moon, Sun, ChevronRight, MessageSquare } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setMobileOpen(false);
      const doScroll = () => {
        const el = document.getElementById(sectionId);
        if (!el) {
          setTimeout(() => {
            const elRetry = document.getElementById(sectionId);
            if (elRetry) {
              const top = elRetry.getBoundingClientRect().top + window.scrollY - 64;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }, 200);
          return;
        }
        const top = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: "smooth" });
      };
      if (location.pathname === "/") {
        setTimeout(doScroll, 50);
      } else {
        navigate("/");
        setTimeout(doScroll, 300);
      }
    },
    [location.pathname, navigate]
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath =
    role === "recruiter"
      ? "/recruiter/dashboard"
      : role === "admin"
        ? "/admin/dashboard"
        : "/seeker/dashboard";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-2xl shadow-lg shadow-black/5"
          : "border-b border-transparent bg-background/40 backdrop-blur-xl"
      }`}
    >
      {/* Top shimmer line */}
      {isScrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}

      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* ── Logo ── */}
        <Link
          to="/"
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
            <Briefcase className="h-4.5 w-4.5 text-primary-foreground" />
            {/* Shine overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            HireHub
          </span>
        </Link>

        {/* ── Desktop Menu ── */}
        <div className="hidden items-center gap-1 md:flex">

          {role !== "recruiter" && (
            <Link
              to="/jobs"
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 rounded-lg"
            >
              Browse Jobs
            </Link>
          )}

          <button
            onClick={() => scrollToSection("about")}
            className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 rounded-lg"
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 rounded-lg"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact
          </button>

          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 rounded-lg"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 rounded-lg"
              >
                Profile
              </Link>

              <Link
                to="/chat"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 rounded-lg"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Messages
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button
                  size="sm"
                  className="text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-200 rounded-lg"
                >
                  Get Started
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="ml-1.5 flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* ── Mobile Toggle ── */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-3">

              {role !== "recruiter" && (
                <Link
                  to="/jobs"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60"
                  onClick={() => setMobileOpen(false)}
                >
                  Browse Jobs
                </Link>
              )}

              <button
                onClick={() => scrollToSection("about")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60 text-left"
              >
                About
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60 text-left"
              >
                <Mail className="h-4 w-4" />
                Contact
              </button>

              <div className="border-t border-border/60 my-2 mx-1" />

              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/chat"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60"
                    onClick={() => setMobileOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </Link>

                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/60 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1 px-1">
                  <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/signup" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full rounded-xl shadow-md shadow-primary/20">
                      Get Started <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}