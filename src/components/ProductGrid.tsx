import ProductCard from "./ProductCard";
import wirelessAdapter from "@/assets/wireless-adapter.png";
import usbHub from "@/assets/usb-hub.png";
import carAdapter from "@/assets/car-adapter.png";
import hdmiAdapter from "@/assets/hdmi-adapter.png";
import travelDock from "@/assets/travel-dock.png";

const products = [
  {
    id: 1,
    name: "Universal Wireless Display & Car Adapter Kit",
    price: 49.99,
    originalPrice: 69.99,
    image: wirelessAdapter,
    rating: 4.8,
    reviews: 234,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "7-in-1 USB-C Hub Pro",
    price: 59.99,
    image: usbHub,
    rating: 4.9,
    reviews: 512,
    badge: "Popular",
  },
  {
    id: 3,
    name: "Bluetooth 5.0 Car Receiver",
    price: 29.99,
    originalPrice: 39.99,
    image: carAdapter,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 4,
    name: "USB-C to HDMI 4K Adapter",
    price: 24.99,
    image: hdmiAdapter,
    rating: 4.6,
    reviews: 342,
  },
  {
    id: 5,
    name: "Compact Travel Dock Station",
    price: 79.99,
    originalPrice: 99.99,
    image: travelDock,
    rating: 4.9,
    reviews: 156,
    badge: "New",
  },
];

const ProductGrid = () => {
  return (
    <section className="py-20 bg-background" id="products">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Featured Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Top-Selling Connectivity Gear
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular USB hubs, wireless adapters, and car tech accessories trusted by thousands.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
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
