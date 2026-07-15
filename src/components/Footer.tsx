import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import paradoxLogo from "@/assets/paradox-logo.webp";

export const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/">
              <img src={paradoxLogo} alt="Paradox Puzzles" className="h-10 w-auto" />
            </Link>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Precision 3D-printed puzzle boxes, designed and tested in our own
              workshop. Turn any gift into a challenge.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-semibold text-foreground">Shop</h4>
            <nav className="flex flex-col gap-2.5">
              <a href="/#collection" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                The Collection
              </a>
              <a href="/#about" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Our Story
              </a>
              <a href="/#faq" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-semibold text-foreground">Support</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/policies/shipping-returns" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping & Returns
              </Link>
              <Link to="/policies/privacy-policy" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/policies/terms" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-semibold text-foreground">Contact</h4>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Questions? We reply within a day.
              <br />
              <a
                href="mailto:paradoxpuzzlebox@gmail.com"
                className="text-primary hover:text-gold-light transition-colors break-all"
              >
                paradoxpuzzlebox@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Paradox Puzzles. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
            <Lock className="w-3 h-3 text-primary" />
            Secure checkout powered by Shopify
          </p>
        </div>
      </div>
    </footer>
  );
};
