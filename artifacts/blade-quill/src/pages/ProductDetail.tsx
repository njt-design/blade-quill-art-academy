import { useRoute, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProduct, useCreateCheckoutSession } from "@workspace/api-client-react";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const [, setLocation] = useLocation();
  const productId = Number(params?.id);

  const { data: product, isLoading, error } = useGetProduct(productId, {
    query: { enabled: !isNaN(productId) }
  });

  const { mutate: checkout, isPending: isCheckingOut } = useCreateCheckoutSession({
    mutation: {
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url;
      }
    }
  });

  const handleBuy = () => {
    if (product) {
      checkout({ data: { productId: product.id, quantity: 1 } });
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

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-primary font-bold tracking-wider uppercase text-sm">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display mb-6">{product.name}</h1>
            
            <div className="text-3xl font-bold text-foreground mb-8">
              ${product.price.toFixed(2)}
            </div>

            <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-10">
              <p>{product.description}</p>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <Button 
                size="lg" 
                className="w-full text-lg h-14" 
                onClick={handleBuy}
                disabled={!product.inStock || isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : product.inStock ? "Buy Now via Stripe" : "Out of Stock"}
              </Button>
              
              {product.gumroadUrl && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full h-14 bg-[#FF90E8]/10 border-[#FF90E8]/30 text-[#FF90E8] hover:bg-[#FF90E8]/20"
                  onClick={() => window.open(product.gumroadUrl as string, "_blank")}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Buy on Gumroad
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-8 mt-auto">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Secure Payment</h4>
                  <p className="text-sm text-muted-foreground">Powered by Stripe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Instant Access</h4>
                  <p className="text-sm text-muted-foreground">For digital products</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
