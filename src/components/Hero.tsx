import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Lock } from "lucide-react";
import paradoxLogo from "@/assets/paradox-logo.webp";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free US shipping on every order" },
  { icon: ShieldCheck, label: "30-day money-back guarantee" },
  { icon: Lock, label: "Secure checkout by Shopify" },
];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background */}
      <div className="absolute inset-0 geometric-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Logo */}
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-8 bg-gold/10 blur-3xl rounded-full" aria-hidden="true" />
            <img
              src={paradoxLogo}
              alt="Paradox Puzzles"
              className="relative h-28 sm:h-36 md:h-44 w-auto mx-auto"
              fetchPriority="high"
            />
          </div>

          <p className="kicker mb-4">3D-Printed Puzzle Boxes</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            The gift they have to <span className="text-gradient-gold">solve first</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Precision-printed puzzle boxes with hidden chambers. Tuck a gift card,
            cash, or a secret note inside — then watch them earn it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold text-base px-8 py-6 glow-gold"
            >
              <a href="#collection">Shop Puzzle Boxes</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border hover:border-primary/60 hover:bg-secondary font-body font-semibold text-base px-8 py-6"
            >
              <a href="#about">How They're Made</a>
            </Button>
          </div>

          {/* Trust strip */}
          <ul className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 justify-center">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground font-body justify-center">
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
