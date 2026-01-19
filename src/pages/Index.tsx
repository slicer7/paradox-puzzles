import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";

const SectionDivider = () => (
  <div className="flex items-center justify-center py-8">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
    <div className="mx-4 h-2 w-2 rotate-45 border border-gold" />
    <div className="h-px w-32 bg-gold" />
    <div className="mx-4 h-2 w-2 rotate-45 border border-gold" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SectionDivider />
      <ProductGrid />
      <SectionDivider />
      <Footer />
    </div>
  );
};

export default Index;
