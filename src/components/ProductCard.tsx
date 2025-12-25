import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Biqpod } from "@biqpod/app/ui/types";
interface ProductCardProps extends Biqpod.Snapbuy.Product {
  delay?: number;
}
const ProductCard = ({
  id,
  name,
  files,
  single,
  multiple,
  type,
  delay = 0,
  metaData,
}: ProductCardProps) => {
  const { dispatch } = useCart();
  const {
    state: { user },
  } = useAuth();
  const image = files?.[0]?.url || "";
  const slug = id || "";
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let price = 0;
    if (type === "single") {
      price = Number(
        (user && user.status === "accepted"
          ? single?.customer
          : single?.client) || 0
      );
    } else if (type === "multiple" && multiple?.prices?.length) {
      // Use the lowest price for cart
      const lowest = Math.min(...multiple.prices.map((p) => p.price));
      price = lowest;
    }
    dispatch({
      type: "ADD_ITEM",
      payload: { id: Number(id) || 0, slug, name: name || "", price, image },
    });
    toast.success(`${name} added to cart!`, {
      description: "Continue shopping or proceed to checkout.",
    });
  };
  const badge = !!metaData?.badge;
  return (
    <Link
      to={`/product/${slug}`}
      className="group block animate-fade-in-up product-card"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-secondary/50 to-background p-6 aspect-square overflow-hidden">
        {badge && (
          <span className="top-4 left-4 z-10 absolute bg-primary px-3 py-1.5 rounded-full font-semibold text-primary-foreground text-xs">
            {badge}
          </span>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex justify-center items-end bg-foreground/0 group-hover:bg-foreground/5 opacity-0 group-hover:opacity-100 p-4 transition-colors duration-300">
          <Button
            variant="cart"
            onClick={handleAddToCart}
            className="transition-transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="space-y-3 p-5">
        {/* Title */}
        <h3 className="font-semibold text-foreground group-hover:text-primary line-clamp-2 transition-colors">
          {name}
        </h3>
        {/* Price */}
        <div className="flex items-center gap-3">
          {type === "single" ? (
            <span className="font-bold text-foreground text-xl">
              {Number(
                (user && user.status === "accepted"
                  ? single?.customer
                  : single?.client) || 0
              ).toFixed(2)}
              DZD
            </span>
          ) : type === "multiple" && multiple?.prices ? (
            <ul className="space-y-1 text-muted-foreground text-sm">
              {multiple.prices.map((p, index) => (
                <li key={index}>
                  Buy {p.quantity} by {(p.quantity * p.price).toFixed(2)}DZD
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
