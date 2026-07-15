import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How hard are the puzzles to solve?",
    a: "Most people solve their first Paradox box in 10–30 minutes. They're designed to be challenging enough to be satisfying, but never so frustrating that they end up in a drawer. If you get truly stuck, every product page includes a solution video.",
  },
  {
    q: "What are the boxes made of?",
    a: "Each box is 3D-printed in durable PLA plastic with precise tolerances, then hand-checked so every mechanism moves smoothly. They're built to be solved over and over.",
  },
  {
    q: "Can I hide a gift inside?",
    a: "That's the whole idea! The hidden chamber fits gift cards, cash, jewelry, notes, and other small surprises. Load it up, hand it over, and let them earn it.",
  },
  {
    q: "How long does shipping take?",
    a: "Every box is printed and inspected to order, so orders ship within 3–5 business days. US delivery typically takes another 3–5 days. Shipping is free on US orders over $35.",
  },
  {
    q: "What if it arrives damaged or I want to return it?",
    a: "We stand behind every box with a 30-day guarantee. If anything arrives damaged or doesn't work as it should, email us and we'll replace it or refund you. Unopened boxes can be returned within 30 days for a full refund.",
  },
  {
    q: "Is checkout secure?",
    a: "Yes. Checkout is handled entirely by Shopify — the same platform trusted by millions of stores. We never see or store your payment details.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="kicker mb-3">Questions</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gradient-gold">
            Frequently Asked
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="font-body text-left text-base font-medium text-foreground hover:text-primary hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-center font-body text-sm text-muted-foreground mt-8">
            Still have a question?{" "}
            <a
              href="mailto:paradoxpuzzlebox@gmail.com"
              className="text-primary hover:text-gold-light transition-colors font-medium"
            >
              Email us
            </a>{" "}
            — we reply within a day.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
