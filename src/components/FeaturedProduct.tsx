import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
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
    <section className="py-16 md:py-24 bg-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="kicker mb-3">Featured</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
            Latest Addition
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl mx-auto"
        >
          <Link to={`/product/${node.handle}`} className="group block">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center bg-card border border-border/50 rounded-2xl p-5 md:p-8 transition-all duration-300 group-hover:border-primary/50 group-hover:glow-gold-subtle">
              {/* Image */}
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || node.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-5 text-center md:text-left">
                <div>
                  <p className="kicker text-xs mb-2">
                    {node.productType || "Puzzle Box"}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {node.title}
                  </h3>
                </div>

                <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                  {node.description || "A mysterious puzzle awaits discovery..."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <span className="font-display text-3xl font-bold text-primary">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>

                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isLoading || !variant}
                    className="bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold px-8"
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

                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors font-body">
                  View details <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
