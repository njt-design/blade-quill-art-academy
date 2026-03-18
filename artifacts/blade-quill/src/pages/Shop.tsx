import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, BookOpen, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListProducts } from "@workspace/api-client-react";
import type { ListProductsCategory } from "@workspace/api-client-react";

export default function Shop() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<ListProductsCategory | "all">("all");
  
  const { data: products, isLoading } = useListProducts(
    activeCategory === "all" ? {} : { category: activeCategory }
  );

  const categories = [
    { id: "all", label: "All Products", icon: ShoppingBag },
    { id: "physical", label: "Books & Prints", icon: BookOpen },
    { id: "digital", label: "Digital Guides", icon: MonitorPlay },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
          <h1 className="text-5xl font-display mb-6">The Academy Shop</h1>
          <p className="text-lg text-muted-foreground">
            Get your hands on the Lheeloo & Luna book, level up with Krita guides, and access exclusive premium curriculums.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id as ListProductsCategory | "all")}
                className="gap-2 rounded-full"
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-secondary/50 border-none h-[400px]" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <Card 
                  className="group cursor-pointer h-full flex flex-col border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                  onClick={() => setLocation(`/shop/${product.id}`)}
                >
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-background/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 text-foreground">
                        {product.category}
                      </span>
                    </div>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-display text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <Button variant="secondary" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-2xl">
            <h3 className="text-2xl font-display text-muted-foreground mb-4">No products found</h3>
            <p className="text-muted-foreground/70">Check back later for new releases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
