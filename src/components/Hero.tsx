import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import wirelessAdapter from "@/assets/wireless-adapter.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="top-20 left-10 absolute bg-primary/10 blur-3xl rounded-full w-72 h-72" />
        <div className="right-10 bottom-20 absolute bg-primary/10 blur-3xl rounded-full w-96 h-96" />
      </div>

      <div className="z-10 relative mx-auto px-4 py-20 md:py-32 container">
        <div className="items-center gap-12 grid lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8 lg:text-left text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-medium text-primary text-sm animate-fade-in">
              <Zap className="w-4 h-4" />
              New Arrivals Just Landed
            </div>

            <h1
              className="font-bold text-foreground text-4xl md:text-5xl lg:text-6xl leading-tight animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Seamless Connectivity.{" "}
              <span className="text-primary">Zero Limits.</span>
            </h1>

            <p
              className="mx-auto lg:mx-0 max-w-xl text-muted-foreground text-lg md:text-xl animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Premium USB hubs, wireless adapters, and connectivity solutions
              engineered for the modern workspace and beyond.
            </p>

            <div
              className="flex sm:flex-row flex-col justify-center lg:justify-start gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button variant="hero">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline">View Collection</Button>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="relative animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl scale-90" />

              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-secondary to-background shadow-product p-8 border border-border rounded-3xl">
                <img
                  src={wirelessAdapter}
                  alt="Universal Wireless Display & Car Adapter Kit"
                  className="w-full h-auto object-contain animate-float"
                />

                {/* Floating Badge */}
                <div className="-top-4 -right-4 absolute bg-primary shadow-lg px-4 py-2 rounded-xl font-semibold text-primary-foreground text-sm">
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
