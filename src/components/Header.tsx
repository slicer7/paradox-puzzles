import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-gradient-gold">Paradox Puzzles</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <a href="#collection" className="font-body text-muted-foreground hover:text-primary transition-colors">
            Collection
          </a>
          <a href="#subscription" className="font-body text-muted-foreground hover:text-primary transition-colors">
            Subscribe
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
