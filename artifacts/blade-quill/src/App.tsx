import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/useCart";

// Layout
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTurnOverlay } from "@/components/site/PageTurnOverlay";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { Analytics } from "@/components/Analytics";

// Pages
import Page from "@/pages/Page";
import ProductDetail from "@/pages/ProductDetail";
import OrderSuccess from "@/pages/OrderSuccess";
import Cart from "@/pages/Cart";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import MockupHomePreview from "@/pages/MockupHomePreview";
import NavDropdownMockups from "@/pages/NavDropdownMockups";
import DesignSystem from "@/pages/DesignSystem";
import Insights from "@/pages/Insights";
import Guide from "@/pages/Guide";
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
    <div className="flex flex-col min-h-screen page">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <Switch>
          <Route path="/">
            <Page slug="home" />
          </Route>
          <Route path="/shop">
            <Page slug="shop" />
          </Route>
          <Route path="/shop/success" component={OrderSuccess} />
          <Route path="/shop/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/gallery">
            <Page slug="gallery" />
          </Route>
          <Route path="/downloads">
            <Page slug="downloads" />
          </Route>
          <Route path="/education">
            <Page slug="education" />
          </Route>
          <Route path="/publishers">
            <Page slug="publishers" />
          </Route>
          <Route path="/about">
            <Page slug="about" />
          </Route>
          <Route path="/contact">
            <Page slug="contact" />
          </Route>
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  // Lock the newrelease subdomain to the Important Links landing page only.
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "newrelease.bladeandquillartacademy.com"
  ) {
    return <Page slug="important-links" chrome="auto" />;
  }

  return (
    <Switch>
      <Route path="/important-links-page">
        <Page slug="important-links" chrome="auto" />
      </Route>
      {/* Client-created pages choose their own layout (standard/standalone). */}
      <Route path="/p/:slug">
        {(params) => <Page slug={params.slug} chrome="auto" />}
      </Route>
      <Route path="/preview/nav-dropdowns" component={NavDropdownMockups} />
      <Route path="/preview/:slug" component={MockupHomePreview} />
      <Route path="/design-system" component={DesignSystem} />
      <Route path="/insights" component={Insights} />
      <Route path="/guide" component={Guide} />
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
            <ScrollToTop />
            <Analytics />
            <Router />
            <PageTurnOverlay />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
