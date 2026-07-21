import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartButton } from "./CartButton";
import paradoxLogo from "@/assets/paradox-logo.webp";

const NAV_LINKS = [
  { label: "Collection", anchor: "collection" },
  { label: "Our Story", anchor: "about" },
  { label: "FAQ", anchor: "faq" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (anchor: string) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      // Wait for the menu sheet to close and release its body scroll lock
      // before scrolling, otherwise the scroll is swallowed.
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      navigate(`/#${anchor}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Paradox Puzzles home">
          <img src={paradoxLogo} alt="Paradox Puzzles" className="h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.anchor}
              onClick={() => goToSection(link.anchor)}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <CartButton />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground hover:text-primary"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-border">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <img src={paradoxLogo} alt="Paradox Puzzles" className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.anchor}
                    onClick={() => goToSection(link.anchor)}
                    className="text-left font-body text-lg font-medium text-foreground hover:text-primary py-3 px-2 rounded-md hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <a
                  href="mailto:paradoxpuzzlebox@gmail.com"
                  className="font-body text-lg font-medium text-foreground hover:text-primary py-3 px-2 rounded-md hover:bg-secondary transition-colors"
                >
                  Contact
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
