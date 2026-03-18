import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useCreateCheckoutSession } from "@workspace/api-client-react";
import { useState } from "react";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null);

  const { mutate: checkout } = useCreateCheckoutSession({
    mutation: {
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url;
      },
      onSettled: () => setCheckingOutId(null),
    },
  });

  const handleCheckoutItem = (itemId: number, quantity: number) => {
    setCheckingOutId(itemId);
    checkout({ data: { productId: itemId, quantity } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mb-8" />
        <h1 className="text-4xl font-display mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-10 text-lg max-w-md">
          Discover Corinne's books, digital guides, and curriculum to start your artistic journey.
        </p>
        <Button size="lg" onClick={() => setLocation("/shop")}>
          Browse the Shop <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display mb-8 md:mb-12 mt-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border-border/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-display text-base sm:text-lg mb-0.5 line-clamp-2 leading-tight">{item.name}</h3>
                      <span className="text-xs uppercase tracking-widest text-primary/60 font-medium">
                        {item.category === "physical" ? "Physical" : item.category === "curriculum" ? "Curriculum" : "Digital"}
                      </span>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-medium text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price + remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-primary/20 lg:sticky lg:top-28">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <h2 className="text-2xl font-display">Order Summary</h2>

                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t border-border/50 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Each item checks out separately via Stripe.
                </p>

                <div className="space-y-2 pt-2">
                  {items.map((item) => (
                    <Button
                      key={item.id}
                      className="w-full text-sm"
                      size="sm"
                      disabled={checkingOutId !== null}
                      onClick={() => handleCheckoutItem(item.id, item.quantity)}
                    >
                      {checkingOutId === item.id ? (
                        <><div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white mr-2" />Processing…</>
                      ) : (
                        <>Checkout · ${(item.price * item.quantity).toFixed(2)}</>
                      )}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/shop")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
