import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ShieldCheck, Download, ExternalLink, ShoppingCart, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProduct, getGetProductQueryKey, useCreateCheckoutSession } from "@workspace/api-client-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const [, setLocation] = useLocation();
  const productId = Number(params?.id);
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading, error } = useGetProduct(productId, {
    query: { queryKey: getGetProductQueryKey(productId), enabled: !isNaN(productId) }
  });

  const { mutate: checkout, isPending: isCheckingOut } = useCreateCheckoutSession({
    mutation: {
      onSuccess: (data) => { if (data.url) window.location.href = data.url; }
    }
  });

  const handleBuyNow = () => {
    if (product) checkout({ data: { productId: product.id, quantity: 1 } });
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, category: product.category });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-32 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-foreground/20 border-t-foreground" />
    </div>
  );
  if (error || !product) return (
    <div className="min-h-screen pt-32 text-center text-destructive">Product not found.</div>
  );

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">

        <button
          onClick={() => setLocation("/shop")}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          <div className="rounded-lg overflow-hidden border border-border bg-card aspect-square lg:aspect-[4/5]">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-center space-y-5">
            <div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                {product.category === "physical" ? "Physical Book" : product.category === "curriculum" ? "Full Curriculum" : "Digital Download"}
              </span>
              <h1 className="text-3xl md:text-4xl font-display mb-3">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display text-orange">${Number(product.price).toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>

            <div className="space-y-2.5 pt-2">
              {product.gumroadUrl && product.category !== "physical" && (
                <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full gap-2 text-sm">
                    <ExternalLink className="w-4 h-4" /> Also available on Gumroad
                  </Button>
                </a>
              )}

              <Button
                className="w-full h-12 gap-2 bg-orange hover:bg-amber text-white"
                onClick={handleBuyNow}
                disabled={isCheckingOut || !product.inStock}
              >
                {isCheckingOut ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> Redirecting…</>
                ) : !product.inStock ? "Out of Stock" : (
                  <>{product.category === "digital" && <Download className="w-4 h-4" />} Buy Now · ${Number(product.price).toFixed(2)}</>
                )}
              </Button>

              {product.inStock && (
                <Button variant="outline" className="w-full h-10 gap-2" onClick={handleAddToCart}>
                  {addedToCart
                    ? <><Check className="w-4 h-4 text-emerald-600" /><span className="text-emerald-600">Added to Cart</span></>
                    : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                </Button>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-border text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 shrink-0" /> Secure payment via Stripe</div>
              {product.category === "physical"
                ? <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Ships within 5–7 business days</div>
                : <div className="flex items-center gap-2"><Download className="w-4 h-4 shrink-0" /> Instant digital delivery after payment</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
