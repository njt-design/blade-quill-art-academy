import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetOrderSuccess, getGetOrderSuccessQueryKey } from "@workspace/api-client-react";

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  const params = sessionId ? { session_id: sessionId } : undefined;

  const { data: order, isLoading, error } = useGetOrderSuccess(
    params!,
    {
      query: {
        queryKey: getGetOrderSuccessQueryKey(params),
        enabled: !!sessionId,
      },
    }
  );

  if (!sessionId) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display text-primary mb-4">No Session Found</h1>
        <Button onClick={() => setLocation("/shop")}>Return to Shop</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display text-destructive mb-4">Order Verification Failed</h1>
        <p className="text-muted-foreground mb-8">We couldn't verify your order session. Please contact support if you were charged.</p>
        <Button onClick={() => setLocation("/contact")}>Contact Support</Button>
      </div>
    );
  }

  const isDigital = order.productCategory !== "physical";

  return (
    <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-background">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="border-primary/20 shadow-2xl shadow-primary/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
          <CardContent className="p-10 pt-16 flex flex-col items-center">
            
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="text-4xl font-display mb-4">Thank You!</h1>
            <p className="text-xl text-foreground/80 mb-2">Your order for <strong className="text-primary">{order.productName}</strong> was successful.</p>
            {order.email && <p className="text-muted-foreground mb-8">A receipt has been sent to {order.email}</p>}

            {isDigital && (
              <div className="w-full bg-secondary/50 rounded-xl p-6 mb-8 border border-white/5">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Access Your Purchase</h3>
                
                {order.downloadUrl ? (
                  <Button className="w-full mb-3 gap-2" onClick={() => window.open(order.downloadUrl as string, "_blank")}>
                    <Download className="w-5 h-5" /> Download Files Now
                  </Button>
                ) : order.gumroadUrl ? (
                  <Button className="w-full mb-3 gap-2 bg-[#FF90E8]/10 text-[#FF90E8] hover:bg-[#FF90E8]/20 border border-[#FF90E8]/30" onClick={() => window.open(order.gumroadUrl as string, "_blank")}>
                    <ExternalLink className="w-5 h-5" /> Access on Gumroad
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">You will receive an email shortly with your access link.</p>
                )}
              </div>
            )}

            {!isDigital && (
              <div className="w-full bg-secondary/50 rounded-xl p-6 mb-8 border border-white/5">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Shipping Information</h3>
                <p className="text-muted-foreground">Your physical item is being prepared for shipment. You will receive an email notification when it ships.</p>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={() => setLocation("/")}>
              Return Home <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
