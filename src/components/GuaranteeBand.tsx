import { motion } from "framer-motion";
import { ShieldCheck, Truck, Lock, RotateCcw } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Fast, careful shipping",
    text: "Orders ship in 3–5 business days, packed to survive the trip. Free US shipping on every order.",
  },
  {
    icon: ShieldCheck,
    title: "30-day guarantee",
    text: "If a box arrives damaged or ever feels less than solid, we'll replace it or refund you.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    text: "Changed your mind? Return unopened boxes within 30 days for a full refund.",
  },
  {
    icon: Lock,
    title: "Secure checkout",
    text: "Payments are handled end-to-end by Shopify. We never see or store your card details.",
  },
];

export const GuaranteeBand = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/20 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {ITEMS.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center sm:text-left"
            >
              <div className="inline-flex w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
