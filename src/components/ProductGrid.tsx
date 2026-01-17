import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2, Package } from "lucide-react";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(12),
  });

  return (
    <section id="collection" className="py-24 bg-background geometric-pattern">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-lg tracking-[0.3em] uppercase mb-4">
            The Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-6">
            Puzzle Boxes
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Each box is a unique journey of discovery, crafted with precision and designed to perplex.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            Failed to load products. Please try again.
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) => product.node.productType !== 'Subscription')
              .map((product, index) => (
                <ProductCard key={product.node.id} product={product} index={index} />
              ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Package className="w-16 h-16 text-muted-foreground mb-6" />
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              No puzzles yet
            </h3>
            <p className="font-body text-muted-foreground max-w-md">
              Our collection is being prepared. Tell us in the chat what puzzle boxes you'd like to add!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
