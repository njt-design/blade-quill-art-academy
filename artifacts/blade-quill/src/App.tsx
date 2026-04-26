import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/useCart";

// Layout
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import OrderSuccess from "@/pages/OrderSuccess";
import Gallery from "@/pages/Gallery";
import Tutorials from "@/pages/Tutorials";
import Downloads from "@/pages/Downloads";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import LandingPage from "@/pages/LandingPage";
import MockupHomePreview from "@/pages/MockupHomePreview";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/shop/success" component={OrderSuccess} />
          <Route path="/shop/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/tutorials" component={Tutorials} />
          <Route path="/downloads" component={Downloads} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/p/:slug" component={LandingPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/preview/:slug" component={MockupHomePreview} />
      <Route component={MainLayout} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
