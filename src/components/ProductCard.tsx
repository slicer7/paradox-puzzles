import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) return;
    
    await addItem({
      product,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${node.handle}`} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 group-hover:border-primary/50 group-hover:glow-gold-subtle">
          {/* Image */}
          <div className="aspect-square overflow-hidden bg-muted">
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
          <div className="p-4 space-y-3">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {node.title}
            </h3>
            
            <p className="font-body text-sm text-muted-foreground line-clamp-2">
              {node.description || "A mysterious puzzle awaits..."}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="font-display text-xl font-bold text-primary">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </span>
              
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isLoading || !variant}
                className="bg-primary text-primary-foreground hover:bg-gold-light"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
