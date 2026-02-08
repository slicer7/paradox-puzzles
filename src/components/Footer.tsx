import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-xl font-semibold text-gradient-gold">
              Paradox Puzzles
            </Link>
            <p className="font-body text-muted-foreground">
              Handcrafted puzzle boxes that challenge the mind and captivate the soul.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/#collection" className="font-body text-muted-foreground hover:text-primary transition-colors">
                Collection
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Contact</h4>
            <p className="font-body text-muted-foreground">
              Have questions? Reach out to us at<br />
              <a href="mailto:paradoxpuzzlebox@gmail.com" className="text-primary hover:text-gold-light transition-colors">
                paradoxpuzzlebox@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paradox Puzzles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
