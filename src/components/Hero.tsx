import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroPuzzle from "@/assets/hero-puzzle.jpg";
import paradoxLogo from "@/assets/paradox-logo.png";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroPuzzle} alt="Mysterious puzzle box with golden light" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="max-w-4xl mx-auto">
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.3,
          duration: 0.6
        }} className="text-primary font-body text-lg tracking-[0.3em] uppercase mb-6">
            Unlock the Mystery
          </motion.p>
          
          <img 
            src={paradoxLogo} 
            alt="Paradox Puzzles" 
            className="h-48 md:h-64 lg:h-80 w-auto mb-6 mx-auto"
          />
          
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5,
          duration: 0.6
        }} className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">Handcrafted puzzle boxes that challenge the mind and captivate the soul. A new puzzle awaits each month.</motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.7,
          duration: 0.6
        }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-gold-light font-display text-lg px-8 py-6 glow-gold">
              <a href="#collection">Explore Collection</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 font-display text-lg px-8 py-6">
              <a href="#subscription">Monthly Subscription</a>
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>;
};