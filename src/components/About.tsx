import { motion } from "framer-motion";
import { PenTool, Layers, PackageCheck } from "lucide-react";
import workshopDesk from "@/assets/workshop-desk.webp";
import workshopFarm from "@/assets/workshop-farm.webp";

const STEPS = [
  {
    icon: PenTool,
    title: "Designed from scratch",
    text: "Every mechanism starts as an original CAD design — interlocking mazes, hidden latches, and rotating chambers engineered to fit together perfectly.",
  },
  {
    icon: Layers,
    title: "Precision 3D-printed",
    text: "Each box is printed in durable PLA with tight tolerances, so every twist and click feels deliberate and satisfying.",
  },
  {
    icon: PackageCheck,
    title: "Tested before it ships",
    text: "Every design is solved, stress-tested, and refined for durability and difficulty before it ever reaches your door.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="kicker mb-3">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gradient-gold mb-5">
            Crafted for the Curious
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Paradox Puzzles turns an ordinary gift into an experience. Every box is
            designed, printed, and tested in our own workshop — not dropshipped from
            a warehouse.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center max-w-5xl mx-auto">
          {/* Photos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={workshopDesk}
              alt="The Paradox Puzzles workshop: CAD software on screen with 3D-printed puzzle prototypes on the desk"
              loading="lazy"
              className="w-full rounded-2xl border border-border/60 shadow-xl"
            />
            <img
              src={workshopFarm}
              alt="A finished red Pillar puzzle box in front of the 3D print farm"
              loading="lazy"
              className="hidden sm:block absolute -bottom-8 -right-4 lg:-right-8 w-40 lg:w-48 rounded-xl border border-border shadow-2xl"
            />
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-8 pt-8 sm:pt-0"
          >
            {STEPS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1.5">
                    {title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
