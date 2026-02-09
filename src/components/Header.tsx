import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import paradoxLogo from "@/assets/paradox-logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={paradoxLogo} alt="Paradox Puzzles" className="h-10 w-auto" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <a href="#collection" className="font-body text-muted-foreground hover:text-primary transition-colors">
            Collection
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
