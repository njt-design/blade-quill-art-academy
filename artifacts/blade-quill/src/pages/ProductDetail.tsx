import { useRoute, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, ExternalLink, ShoppingCart, Check } from "lucide-react";
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
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url;
      }
    }
  });

  const handleBuyNow = () => {
    if (product) {
      checkout({ data: { productId: product.id, quantity: 1 } });
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  if (error || !product) return <div className="min-h-screen pt-32 text-center text-red-400">Product not found.</div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        <button 
          onClick={() => setLocation("/shop")}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image */}
          <div className="rounded-2xl overflow-hidden glass-panel border-white/10 aspect-square lg:aspect-[4/5] relative">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            
            <div>
              <span className="text-sm uppercase tracking-widest text-primary/60 font-medium mb-2 block">
                {product.category === "physical" ? "Physical Book" : product.category === "curriculum" ? "Full Curriculum" : "Digital Download"}
              </span>
              <h1 className="text-4xl font-display mb-4">{product.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-display text-primary">${Number(product.price).toFixed(2)}</span>
              <span className="text-muted-foreground text-sm">USD</span>
            </div>

            <div className="space-y-3 pt-2">
              {product.gumroadUrl && product.category !== "physical" && (
                <a href={product.gumroadUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Also available on Gumroad
                  </Button>
                </a>
              )}

              <Button
                className="w-full text-lg h-14 gap-2"
                onClick={handleBuyNow}
                disabled={isCheckingOut || !product.inStock}
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                    Redirecting…
                  </>
                ) : !product.inStock ? (
                  "Out of Stock"
                ) : (
                  <>
                    {product.category === "digital" ? <Download className="w-5 h-5" /> : null}
                    Buy Now · ${Number(product.price).toFixed(2)}
                  </>
                )}
              </Button>

              {product.inStock && (
                <Button
                  variant="outline"
                  className="w-full h-12 gap-2"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary/60 shrink-0" />
                <span>Secure payment via Stripe</span>
              </div>
              {product.category === "physical" && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary/60 shrink-0" />
                  <span>Ships within 5–7 business days</span>
                </div>
              )}
              {product.category !== "physical" && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Download className="w-4 h-4 text-primary/60 shrink-0" />
                  <span>Instant digital delivery after payment</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
