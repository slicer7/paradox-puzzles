import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { ProductGrid } from "@/components/ProductGrid";
import { About } from "@/components/About";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  // Support /#section links coming from other pages
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Wait a frame so sections have rendered
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedProduct />
      <ProductGrid />
      <About />
      <GuaranteeBand />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
