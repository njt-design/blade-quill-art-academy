import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetOrderSuccess, getGetOrderSuccessQueryKey } from "@workspace/api-client-react";
import { useCart } from "@/hooks/useCart";
import { trackPurchase } from "@/lib/analytics";

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  const params = sessionId ? { session_id: sessionId } : undefined;
  const { data: order, isLoading, error } = useGetOrderSuccess(params!, {
    query: { queryKey: getGetOrderSuccessQueryKey(params), enabled: !!sessionId },
  });

  useEffect(() => {
    if (order) clearCart();
  }, [order, clearCart]);

  useEffect(() => {
    if (!order || !sessionId) return;
    trackPurchase({
      transactionId: sessionId,
      productName: order.productName,
      productCategory: order.productCategory,
    });
  }, [order, sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-display mb-4">No Session Found</h1>
        <Button onClick={() => setLocation("/shop")}>Return to Shop</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-display text-destructive mb-3">Order Verification Failed</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">We couldn't verify your session. Please contact support if you were charged.</p>
        <Button onClick={() => setLocation("/contact")}>Contact Support</Button>
      </div>
    );
  }

  const isDigital = order.productCategory !== "physical";

  return (
    <div className="min-h-screen py-20 flex items-center justify-center">
      <div className="container max-w-lg mx-auto px-4">
        <div className="border border-border rounded-lg bg-card p-8 text-center">

          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-5" />
          <h1 className="text-3xl font-display mb-2">Thank You!</h1>
          <p className="text-foreground/80 mb-1">
            Your order for <strong>{order.productName}</strong> was successful.
          </p>
          {order.email && <p className="text-sm text-muted-foreground mb-8">Receipt sent to {order.email}</p>}

          {isDigital && (
            <div className="bg-secondary/60 rounded-lg p-5 mb-6 border border-border text-left">
              <h3 className="font-normal mb-3">Access Your Purchase</h3>
              {order.downloadUrl ? (
                <Button className="w-full gap-2" onClick={() => window.open(order.downloadUrl as string, "_blank")}>
                  <Download className="w-4 h-4" /> Download Files
                </Button>
              ) : order.gumroadUrl ? (
                <Button className="w-full gap-2" onClick={() => window.open(order.gumroadUrl as string, "_blank")}>
                  <ExternalLink className="w-4 h-4" /> Access on Gumroad
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">You'll receive an email with your access link shortly.</p>
              )}
            </div>
          )}

          {!isDigital && (
            <div className="bg-secondary/60 rounded-lg p-5 mb-6 border border-border text-left">
              <h3 className="font-normal mb-2">Shipping Information</h3>
              <p className="text-sm text-muted-foreground">Your item is being prepared for shipment. You'll receive an email when it ships.</p>
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={() => setLocation("/")}>
            Return Home <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
