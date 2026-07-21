import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Truck, Lock, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { trackInitiateCheckout } from "@/lib/fbq";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CartPage = () => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);

  useEffect(() => {
    syncCart();
    window.scrollTo(0, 0);
  }, [syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      trackInitiateCheckout({
        ids: items.map((i) => i.variantId),
        value: totalPrice,
        numItems: totalItems,
        currency: items[0]?.price.currencyCode || "USD",
      });
      window.open(checkoutUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-body mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-foreground">Your Cart</h1>
            <p className="text-muted-foreground font-body mt-2">
              {totalItems === 0
                ? "Your cart is empty"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} awaiting discovery`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-border/50 rounded-lg bg-card">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body text-lg mb-6">Your cart is empty</p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-gold-light font-body">
                <Link to="/">Browse Puzzles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 p-4 rounded-lg bg-card border border-border/50"
                  >
                    <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-medium text-foreground">{item.product.node.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedOptions.map((option) => option.value).join(" • ")}
                      </p>
                      <p className="font-display font-semibold text-primary mt-1">
                        {formatPrice(item.price.amount, item.price.currencyCode)}
                      </p>
                      <div className="flex items-center gap-1 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-border"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-border"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => removeItem(item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <aside className="md:col-span-1">
                <div className="p-6 rounded-lg bg-card border border-border/50 space-y-4 sticky top-24">
                  <h2 className="font-display text-xl text-foreground">Order Summary</h2>
                  <div className="flex items-center gap-2 text-sm text-primary font-body font-medium">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on every order!</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-lg font-display font-semibold text-foreground">Total</span>
                    <span className="text-xl font-display font-bold text-primary">
                      {formatPrice(totalPrice, items[0]?.price.currencyCode || "USD")}
                    </span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold"
                    size="lg"
                    disabled={items.length === 0 || isLoading || isSyncing}
                  >
                    {isLoading || isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-body">
                    <Lock className="w-3 h-3" />
                    Secure checkout powered by Shopify
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
