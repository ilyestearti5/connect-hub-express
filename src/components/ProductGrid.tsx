import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { snapBuyAPI } from "@/lib/api";
import { Biqpod } from "@biqpod/app/ui/types";

const ProductGrid = () => {
  const [products, setProducts] = useState<Biqpod.Snapbuy.Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await snapBuyAPI.getProducts(10);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-background py-20" id="products">
        <div className="mx-auto px-4 container">
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-20" id="products">
      <div className="mx-auto px-4 container">
        {/* Section Header */}
        <div className="space-y-4 mb-12 text-center">
          <span className="font-semibold text-primary text-sm uppercase tracking-wider">
            Featured Collection
          </span>
          <h2 className="font-bold text-foreground text-3xl md:text-4xl">
            Top-Selling Connectivity Gear
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our most popular USB hubs, wireless adapters, and car tech
            accessories trusted by thousands.
          </p>
        </div>

        {/* Product Grid */}
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard key={product.id} {...product} delay={index * 0.1} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View All Products
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
