import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  delay?: number;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  delay = 0,
}: ProductCardProps) => {
  const handleAddToCart = () => {
    toast.success(`${name} added to cart!`, {
      description: "Continue shopping or proceed to checkout.",
    });
  };

  return (
    <div 
      className="product-card group animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-secondary/50 to-background p-6 overflow-hidden">
        {badge && (
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full z-10">
            {badge}
          </span>
        )}
        
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100">
          <Button variant="cart" onClick={handleAddToCart} className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
