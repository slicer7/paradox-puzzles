import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  const { data: product, isLoading: productLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
  });

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="font-display text-3xl text-foreground mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:text-gold-light transition-colors">
            Return to home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const variants = product.variants.edges;
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Added to cart", {
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body">Back to collection</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {images[0] && (
                <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border">
                  <img
                    src={images[0].node.url}
                    alt={images[0].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-md overflow-hidden bg-card border border-border">
                      <img
                        src={img.node.url}
                        alt={img.node.altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
                  {product.title}
                </h1>
                <p className="font-display text-3xl font-bold text-primary">
                  {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </p>
              </div>

              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                {product.description || "A mysterious puzzle awaits discovery. Each box is handcrafted with precision and designed to challenge even the most seasoned puzzle enthusiasts."}
              </p>

              {/* Variants */}
              {variants.length > 1 && (
                <div className="space-y-3">
                  <label className="font-display text-sm font-semibold text-foreground">
                    Select Option
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, idx) => (
                      <Button
                        key={v.node.id}
                        variant={selectedVariantIndex === idx ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={selectedVariantIndex === idx 
                          ? "bg-primary text-primary-foreground" 
                          : "border-border text-foreground hover:border-primary"
                        }
                      >
                        {v.node.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="font-display text-sm font-semibold text-foreground">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-border"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-display text-xl w-12 text-center text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-border"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isLoading || !selectedVariant?.availableForSale}
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-display text-lg py-6 glow-gold"
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

              {selectedVariant && !selectedVariant.availableForSale && (
                <p className="text-destructive font-body text-center">
                  This variant is currently out of stock
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
