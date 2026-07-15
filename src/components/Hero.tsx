import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Lock } from "lucide-react";
import openingBox from "@/assets/opening-box.webp";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free US shipping over $35" },
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
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <p className="kicker mb-4">3D-Printed Puzzle Boxes</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              The gift they have to <span className="text-gradient-gold">solve first</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Precision-printed puzzle boxes with hidden chambers. Tuck a gift card,
              cash, or a secret note inside — then watch them earn it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
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
            <ul className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground font-body justify-center lg:justify-start">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="absolute -inset-4 bg-gold/10 blur-3xl rounded-full" aria-hidden="true" />
              <img
                src={openingBox}
                alt="Hands twisting open The Pillar puzzle box to reveal its hidden chamber"
                className="relative w-full aspect-[4/5] object-cover rounded-2xl border border-border/60 shadow-2xl"
                fetchpriority="high"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
