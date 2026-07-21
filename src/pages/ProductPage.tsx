import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewsSection } from "@/components/ReviewsSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { trackAddToCart, trackViewContent } from "@/lib/fbq";

const TRUST_POINTS = [
  { icon: Truck, label: "Ships in 3–5 business days · Free US shipping on every order" },
  { icon: ShieldCheck, label: "30-day money-back guarantee" },
  { icon: Lock, label: "Secure checkout powered by Shopify" },
];

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  useEffect(() => {
    const variant = product?.variants.edges[selectedVariantIndex]?.node;
    if (!product || !variant) return;
    trackViewContent({
      id: variant.id,
      name: product.title,
      price: variant.price.amount,
      currency: variant.price.currencyCode,
    });
  }, [product, selectedVariantIndex]);

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
          <Link to="/" className="text-primary hover:text-gold-light transition-colors font-body">
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images.map((img) => img.node.url),
    offers: {
      "@type": "Offer",
      priceCurrency: price.currencyCode,
      price: parseFloat(price.amount).toFixed(2),
      availability: selectedVariant?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };




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

    trackAddToCart({
      id: selectedVariant.id,
      name: product.title,
      price: selectedVariant.price.amount,
      currency: selectedVariant.price.currencyCode,
      quantity,
    });

    toast.success("Added to cart", {
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Header />

      <main className="pt-24 pb-24 lg:pb-16">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to collection
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {images[selectedImageIndex] && (
                <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border group">
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden bg-card border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || product.title}
                        loading="lazy"
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
                <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-3">
                  {product.title}
                </h1>
                <p className="font-display text-3xl font-bold text-primary">
                  {formatPrice(price.amount, price.currencyCode)}
                </p>
              </div>

              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {product.description || "A mysterious puzzle awaits discovery. Each box is crafted with precision and designed to challenge even the most seasoned puzzle enthusiasts."}
              </p>

              {/* Color Variants */}
              {variants.length > 1 && (
                <div className="space-y-3">
                  <label className="font-body text-sm font-semibold text-foreground">
                    Color: <span className="text-muted-foreground font-normal">{selectedVariant?.title}</span>
                  </label>
                  <div className="flex gap-3">
                    {variants.map((v, idx) => {
                      const colorName = v.node.title.toLowerCase();
                      const colorClass = colorName === 'red'
                        ? 'bg-red-600'
                        : colorName === 'grey' || colorName === 'gray'
                          ? 'bg-gray-400'
                          : 'bg-muted';

                      return (
                        <button
                          key={v.node.id}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`w-11 h-11 rounded-lg transition-all ${colorClass} ${
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
                <label className="font-body text-sm font-semibold text-foreground">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-border h-11 w-11"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-body text-lg font-semibold w-10 text-center text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-border h-11 w-11"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart (desktop / inline) */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isLoading || !selectedVariant?.availableForSale}
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold text-lg py-6 glow-gold"
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
                <p className="text-destructive font-body text-center text-sm">
                  This variant is currently out of stock
                </p>
              )}

              {/* Trust points */}
              <ul className="space-y-2.5 rounded-xl border border-border/60 bg-card p-4">
                {TRUST_POINTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground font-body">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              {/* Details accordions */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping">
                  <AccordionTrigger className="font-body text-base font-medium hover:text-primary hover:no-underline">
                    Shipping & returns
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                    Each box is printed and inspected to order, then ships within 3–5
                    business days. US delivery takes another 3–5 days. Unopened boxes
                    can be returned within 30 days, and anything that arrives damaged
                    is replaced or refunded — see our{" "}
                    <Link to="/policies/shipping-returns" className="text-primary hover:text-gold-light">
                      full policy
                    </Link>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="materials">
                  <AccordionTrigger className="font-body text-base font-medium hover:text-primary hover:no-underline">
                    Materials & care
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                    Printed in durable PLA plastic with precise tolerances, so every
                    mechanism moves smoothly. Keep away from prolonged direct sunlight
                    and heat (like a hot car) to preserve the finish. Contains small
                    parts — not for children under 3.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="maker">
                  <AccordionTrigger className="font-body text-base font-medium hover:text-primary hover:no-underline">
                    Who makes these?
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                    Every Paradox puzzle is an original design — modeled, printed, and
                    solve-tested in our own workshop, not resold from a catalog.{" "}
                    <a href="/#about" className="text-primary hover:text-gold-light">
                      Read our story
                    </a>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                Stuck? Watch the Solution
              </h2>
              <div className="max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://www.youtube.com/embed/NWX3C8KuoJ4"
                  title="How to Solve The Pillar"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          )}

          {/* Reviews */}
          <ReviewsSection productHandle={handle!} productTitle={product.title} />
        </div>
      </main>

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <span className="font-display text-xl font-bold text-primary whitespace-nowrap">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className="flex-1 bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold h-12"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
