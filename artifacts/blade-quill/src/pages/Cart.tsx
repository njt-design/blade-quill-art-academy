import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useCreateCheckoutSession } from "@workspace/api-client-react";
import { useState } from "react";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null);

  const { mutate: checkout } = useCreateCheckoutSession({
    mutation: {
      onSuccess: (data) => { if (data.url) window.location.href = data.url; },
      onSettled: () => setCheckingOutId(null),
    },
  });

  const handleCheckoutItem = (
    itemId: number,
    quantity: number,
    productSlug?: string
  ) => {
    setCheckingOutId(itemId);
    checkout({ data: { productId: itemId, quantity, productSlug } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-display mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Discover books, digital guides, and curriculum to start your artistic journey.
        </p>
        <Button onClick={() => setLocation("/shop")} className="bg-maroon hover:bg-maroon-deep text-white">
          Browse the Shop <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h1 className="text-3xl font-display mb-8">Your Cart</h1>

        <div className="space-y-3 mb-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg bg-card">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded shrink-0"
              />
              <div className="flex-grow min-w-0">
                <h3 className="font-normal text-sm line-clamp-1 mb-0.5">{item.name}</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.category === "physical" ? "Physical" : item.category === "curriculum" ? "Curriculum" : "Digital"}
                </span>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-maroon">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="w-10 h-10 grid place-items-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border rounded-lg p-5 bg-card space-y-4">
          <h2 className="text-xl font-heading">Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
              <span className="truncate mr-2">{item.name} × {item.quantity}</span>
              <span className="shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-maroon">${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">Each item checks out separately via Stripe.</p>
          <div className="space-y-2">
            {items.map((item) => (
              <Button
                key={item.id}
                className="w-full bg-maroon hover:bg-maroon-deep text-white text-sm"
                size="sm"
                disabled={checkingOutId !== null}
                onClick={() =>
                  handleCheckoutItem(item.id, item.quantity, item.slug)
                }
              >
                {checkingOutId === item.id
                  ? <><div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white mr-2" />Processing…</>
                  : <>Checkout · ${(item.price * item.quantity).toFixed(2)}</>}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="w-full text-sm" onClick={() => setLocation("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
