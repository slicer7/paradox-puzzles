import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Sparkles } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const FeaturedProduct = () => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(12),
  });

  // Get the latest non-subscription product
  const latestProduct = products
    ?.filter((p) => p.node.productType !== 'Subscription')
    ?.[0] as ShopifyProduct | undefined;

  if (isLoadingProducts) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!latestProduct) return null;

  const { node } = latestProduct;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) return;
    
    await addItem({
      product: latestProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });
    
    toast.success("Added to cart", {
      description: `${node.title} has been added to your cart.`,
    });
  };

  return (
    <section className="py-20 bg-secondary/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-primary font-body text-lg tracking-[0.3em] uppercase mb-4">
            <Sparkles className="w-5 h-5" />
            <span>Featured</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
            Latest Addition
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Link to={`/product/${node.handle}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-card border border-border/50 rounded-2xl p-6 md:p-8 transition-all duration-300 group-hover:border-primary/50 group-hover:glow-gold-subtle">
              {/* Image */}
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || node.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-6 text-center md:text-left">
                <div>
                  <p className="text-primary/80 font-body text-sm tracking-wider uppercase mb-2">
                    {node.productType || "Puzzle Box"}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {node.title}
                  </h3>
                </div>
                
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  {node.description || "A mysterious puzzle awaits discovery..."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <span className="font-display text-3xl font-bold text-primary">
                    {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                  </span>
                  
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isLoading || !variant}
                    className="bg-primary text-primary-foreground hover:bg-gold-light font-display px-8"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
