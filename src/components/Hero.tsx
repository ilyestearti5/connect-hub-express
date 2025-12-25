import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Wifi } from "lucide-react";
import wirelessAdapter from "@/assets/wireless-adapter.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              <Zap className="w-4 h-4" />
              New Arrivals Just Landed
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Seamless Connectivity.{" "}
              <span className="text-primary">Zero Limits.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Premium USB hubs, wireless adapters, and connectivity solutions engineered for the modern workspace and beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline">
                View Collection
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wifi className="w-5 h-5 text-primary" />
                <span>Fast Connectivity</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-5 h-5 text-primary" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl scale-90" />
              
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-secondary to-background rounded-3xl p-8 shadow-product border border-border">
                <img
                  src={wirelessAdapter}
                  alt="Universal Wireless Display & Car Adapter Kit"
                  className="w-full h-auto object-contain animate-float"
                />
                
                {/* Floating Badge */}
                <div className="absolute -right-4 -top-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg font-semibold text-sm">
                  NEW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
