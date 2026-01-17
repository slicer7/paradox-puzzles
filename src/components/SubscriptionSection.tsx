import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Gift, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  "A brand new puzzle box delivered monthly",
  "Exclusive designs not sold separately",
  "Early access to limited editions",
  "Member-only difficulty ratings & hints",
  "Cancel anytime, no commitments"
];

export const SubscriptionSection = () => {
  const navigate = useNavigate();

  return (
    <section id="subscription" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 geometric-pattern opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary font-body text-lg tracking-[0.3em] uppercase mb-4">
              Monthly Mystery
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-6">
              The Paradox Club
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our exclusive subscription and receive a unique, handcrafted puzzle box 
              delivered to your door every month.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 md:p-12 glow-gold"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Benefits */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="font-display text-2xl font-semibold text-foreground">
                    Membership Benefits
                  </span>
                </div>

                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-body text-lg text-foreground">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Right - Pricing */}
              <div className="text-center md:text-left space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="font-body text-sm text-primary">First box ships immediately</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="font-display text-5xl font-bold text-gradient-gold">$19.99</span>
                    <span className="font-body text-muted-foreground">/month</span>
                  </div>
                  <p className="font-body text-muted-foreground">
                    Free shipping worldwide
                  </p>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                  <Calendar className="w-4 h-4" />
                  <span className="font-body text-sm">Next puzzle ships January 2026</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-gold-light font-display text-lg px-10 py-6 glow-gold"
                  onClick={() => navigate('/product/the-paradox-club-monthly-subscription')}
                >
                  Join The Paradox Club
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
