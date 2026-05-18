import { motion } from "framer-motion";

export const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
            About Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gradient-gold mb-8">
            Crafted for the Curious
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
            At Paradox Puzzles, we create unique 3D-printed puzzle boxes designed to turn an ordinary gift into an experience. Each puzzle combines mechanical design, problem solving, and creativity to create a challenge that is fun to solve and satisfying to unlock. Our goal is to make products that feel interactive, memorable, and different from anything you would find in a normal gift store. Every design is carefully tested for durability, difficulty, and overall enjoyment before it reaches customers. Whether you are looking for a creative gift, a desk toy, or a challenge for yourself, Paradox Puzzles is built to bring curiosity and excitement to every box.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
