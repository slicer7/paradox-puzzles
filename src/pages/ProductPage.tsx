import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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
              {images[selectedImageIndex] && (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-card border border-border group">
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {/* Thumbnail gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-md overflow-hidden bg-card border-2 transition-all ${
                        selectedImageIndex === idx 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
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

              {/* Color Variants */}
              {variants.length > 1 && (
                <div className="space-y-3">
                  <label className="font-display text-sm font-semibold text-foreground">
                    Select Color
                  </label>
                  <div className="flex gap-3">
                    {variants.map((v, idx) => {
                      const colorName = v.node.title.toLowerCase();
                      const colorClass = colorName === 'red' 
                        ? 'bg-red-600' 
                        : colorName === 'grey' || colorName === 'gray'
                          ? 'bg-gray-500'
                          : 'bg-muted';
                      
                      return (
                        <button
                          key={v.node.id}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`w-10 h-10 rounded-md transition-all ${colorClass} ${
                            selectedVariantIndex === idx 
                              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' 
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={v.node.title}
                          aria-label={`Select ${v.node.title} color`}
                        />
                      );
                    })}
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

              <div className="flex items-center gap-2 text-muted-foreground font-body text-sm justify-center">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free shipping on orders over $35</span>
              </div>

              {selectedVariant && !selectedVariant.availableForSale && (
                <p className="text-destructive font-body text-center">
                  This variant is currently out of stock
                </p>
              )}
            </motion.div>
          </div>

          {/* Tutorial Video */}
          {handle === 'the-pillar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">
                How to Solve The Pillar
              </h2>
              <div className="max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.youtube.com/embed/NWX3C8KuoJ4"
                  title="How to Solve The Pillar"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
