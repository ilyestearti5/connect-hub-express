import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import usbHub from "@/assets/usb-hub.png";
import carAdapter from "@/assets/car-adapter.png";

const categories = [
  {
    id: "wireless",
    title: "Wireless Adapters",
    description: "Stream, share, and connect wirelessly with our cutting-edge adapters.",
    image: usbHub,
    link: "#wireless",
  },
  {
    id: "cartech",
    title: "CarTech Solutions",
    description: "Upgrade your drive with smart Bluetooth and wireless car accessories.",
    image: carAdapter,
    link: "#cartech",
  },
];

const CategoryShowcase = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-background border border-border p-8 md:p-12 transition-all duration-500 hover:shadow-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative z-10 max-w-sm">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {category.description}
                </p>
                <Button variant="default" className="group/btn">
                  Explore
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Background Image */}
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-contain object-right-bottom"
                />
              </div>

              {/* Decorative Element */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
