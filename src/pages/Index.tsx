import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CategoryShowcase from "@/components/CategoryShowcase";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <CategoryShowcase />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
