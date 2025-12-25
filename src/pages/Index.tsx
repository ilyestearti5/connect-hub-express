import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductGrid from "@/components/ProductGrid";
import CategoryShowcase from "@/components/CategoryShowcase";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <ProductGrid />
        <CategoryShowcase />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
