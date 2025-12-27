import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Plus,
  Minus,
  Check,
  User,
  Phone,
  MapPin,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { CreateOrderOptions, snapBuyAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Biqpod } from "@biqpod/app/ui/types";
import places from "../../public/places.json";
const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    state: { user },
  } = useAuth();
  const [product, setProduct] = useState<Biqpod.Snapbuy.Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState<
    Biqpod.Snapbuy.DeliveryOptions[]
  >([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<string>("");
  const [deliveryPrices, setDeliveryPrices] = useState<
    Biqpod.Snapbuy.DeliveryPrice[]
  >([]);
  const [allDeliveryPrices, setAllDeliveryPrices] = useState<
    Record<string, Biqpod.Snapbuy.DeliveryPrice[]>
  >({});
  const [selectedDeliveryPrice, setSelectedDeliveryPrice] =
    useState<string>("");
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<
    Biqpod.Snapbuy.Product[]
  >([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [address, setSelectedCommune] = useState<string>("");
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const data = await snapBuyAPI.getProduct(slug);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchRelatedProducts = async () => {
      try {
        const products = await snapBuyAPI.getProducts(10);
        // Pick 3 random products
        const shuffled = products.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };
    fetchProduct();
    fetchRelatedProducts();
  }, [slug]);
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const options = await snapBuyAPI.getDeliveryOptions();
        const enabledOptions = options.filter(
          (option) => option.enabled !== false
        );
        setDeliveryOptions(enabledOptions);
        // Fetch all delivery prices upfront
        setDeliveryLoading(true);
        const pricesPromises = enabledOptions.map(async (option) => {
          try {
            const prices = await snapBuyAPI.getDeliveryPrices(option.id!);
            return { optionId: option.id!, prices };
          } catch (error) {
            console.error(
              `Failed to fetch prices for option ${option.id}:`,
              error
            );
            return { optionId: option.id!, prices: [] };
          }
        });
        const results = await Promise.all(pricesPromises);
        const pricesMap: Record<string, Biqpod.Snapbuy.DeliveryPrice[]> = {};
        results.forEach(({ optionId, prices }) => {
          pricesMap[optionId] = prices;
        });
        setAllDeliveryPrices(pricesMap);
        setDeliveryLoading(false);
      } catch (error) {
        console.error("Failed to fetch delivery options:", error);
        setDeliveryLoading(false);
      }
    };
    fetchDeliveryOptions();
  }, []);
  useEffect(() => {
    const option = deliveryOptions.at(0);
    setSelectedDeliveryOption(option?.id! || "");
  }, [deliveryOptions]);
  useEffect(() => {
    if (selectedDeliveryOption) {
      setDeliveryPrices(allDeliveryPrices[selectedDeliveryOption] || []);
      setSelectedDeliveryPrice(""); // Reset selection when options change
    } else {
      setDeliveryPrices([]);
      setSelectedDeliveryPrice("");
    }
  }, [selectedDeliveryOption, allDeliveryPrices]);
  useEffect(() => {
    if (selectedDeliveryPrice) {
      const selectedPrice = deliveryPrices.find(
        (p) => p.id === selectedDeliveryPrice
      );
      if (selectedPrice) {
        const filtered = places.filter(
          (p) =>
            p.wilaya_name_ascii.toLowerCase() ===
            selectedPrice.name.toLowerCase()
        );
        setCommunes(filtered);
        setSelectedCommune("");
      }
    } else {
      setCommunes([]);
      setSelectedCommune("");
    }
  }, [selectedDeliveryPrice, deliveryPrices]);
  const getPrice = (prod: Biqpod.Snapbuy.Product, qty: number) => {
    if (prod.type === "single") {
      return user && user.status === "accepted"
        ? prod.single?.customer
        : prod.single?.client;
    }
    if (!prod.multiple?.prices?.length) return 0;
    const sorted = [...prod.multiple.prices].sort((a, b) => a.price - b.price);
    const applicable = sorted.find((p) => qty >= p.quantity);
    return applicable ? applicable.price : sorted.at(-1)?.price;
  };
  const currentPrice = (product && getPrice(product, quantity)) || 0;
  const savings = product?.multiple
    ? (() => {
        const highestPrice = Math.max(
          ...product.multiple.prices.map((p) => p.price)
        );
        return ((highestPrice - currentPrice) / highestPrice) * 100;
      })()
    : 0;
  const selectedDeliveryPriceObj = deliveryPrices.find(
    (p) => p.id === selectedDeliveryPrice
  );
  const deliveryCost = selectedDeliveryPriceObj
    ? selectedDeliveryPriceObj.price
    : 0;
  const totalPrice = currentPrice * quantity + deliveryCost;
  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="mx-auto px-4 py-20 text-center container">
          <h1 className="mb-4 font-bold text-foreground text-3xl">
            Loading...
          </h1>
        </main>
        <Footer />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="mx-auto px-4 py-20 text-center container">
          <h1 className="mb-4 font-bold text-foreground text-3xl">
            Product Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button variant="default">
              <ChevronLeft className="w-4 h-4" />
              Back to Shop
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  const handleCreateOrder = async () => {
    if (
      !product ||
      !firstname ||
      !lastname ||
      !phone ||
      !selectedDeliveryOption ||
      !selectedDeliveryPrice ||
      !address
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    var place: Biqpod.Snapbuy.Order["place"] | undefined = undefined;
    try {
      if (
        selectedDeliveryOption === "domicile" ||
        selectedDeliveryOption === "office"
      ) {
        place = {
          address,
          wilaya: selectedDeliveryPriceObj?.name.toString() || "",
        };
      }
      const options: CreateOrderOptions = {
        products: {
          [product.id!]: {
            count: quantity,
          },
        },
        client: {
          firstname,
          lastname,
          phone,
        },
        ...(place && { place }),
        metaData: {},
        packs: {},
      };
      if (selectedDeliveryPriceObj?.id) {
        options.deliveryPriceId = selectedDeliveryPriceObj.id;
      }
      const response = await snapBuyAPI.createOrder(options);
      toast.success("Order created successfully!", {
        description: `Order ID: ${response.order.id}`,
      });
      // Optionally reset form or redirect
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  // For related products, fetch a few random products from store
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="mx-auto px-4 py-4 container">
          <nav className="flex items-center gap-2 text-muted-foreground text-sm">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
        {/* Marquee */}
        <section className="bg-black py-2 overflow-hidden text-white">
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee {
                animation: marquee 15s linear infinite;
              }
              @keyframes bounce-every-5s {
                0% { transform: translateY(0); }
                1% { transform: translateY(-10px); }
                2% { transform: translateY(0); }
                100% { transform: translateY(0); }
              }
              .animate-bounce-every-5s {
                animation: bounce-every-5s 5s infinite;
              }
            `}
          </style>
          <div className="font-semibold text-lg whitespace-nowrap animate-marquee">
            📦 Product: {product.name} | 📝 Description:{" "}
            {product.description || "Nothing"} | 💰 Price:{" "}
            {totalPrice.toFixed(2)} DZD | 🔢 Quantity: {quantity} | 💸 Savings:{" "}
            {savings > 0 ? `${savings.toFixed(0)}%` : "None"}
          </div>
        </section>
        {/* Product Section */}
        <section className="mx-auto px-4 py-8 container">
          <div className="gap-12 grid lg:grid-cols-2">
            {/* Product Image */}
            <div className="animate-fade-in">
              <div className="relative bg-gradient-to-br from-secondary to-background shadow-product p-8 border border-border rounded-2xl">
                <img
                  src={product.files?.[0]?.url || ""}
                  alt={product.name}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            </div>
            {/* Product Info */}
            <div className="space-y-6 animate-fade-in-up">
              {/* Title */}
              <h1 className="font-bold text-foreground text-3xl md:text-4xl leading-tight">
                {product.name}
              </h1>
              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="font-bold text-foreground text-4xl">
                  {totalPrice.toFixed(2)} DZD
                </span>
                {product.multiple && savings > 0 && (
                  <span className="font-semibold text-green-600">
                    Save {savings.toFixed(0)}% for one
                  </span>
                )}
              </div>
              {deliveryCost > 0 && (
                <div className="text-muted-foreground text-sm">
                  Product: {currentPrice.toFixed(2)} DZD + Delivery:{" "}
                  {deliveryCost.toFixed(2)} DZD
                </div>
              )}
              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity || ""}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {/* Order Form */}
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="gap-4 grid grid-cols-2 max-md:grid-cols-1">
                    <div>
                      <Label htmlFor="firstname">First Name</Label>
                      <div className="relative">
                        <User className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                        <Input
                          id="firstname"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          placeholder="Enter first name"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastname">Last Name</Label>
                      <div className="relative">
                        <User className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                        <Input
                          id="lastname"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          placeholder="Enter last name"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryOption">Delivery Option</Label>
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-2">
                      {deliveryOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedDeliveryOption(option.id!)}
                          disabled={deliveryLoading}
                          aria-pressed={selectedDeliveryOption === option.id}
                          className={`w-full text-left p-4 border rounded-lg transition-colors flex items-center justify-between ${
                            selectedDeliveryOption === option.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:shadow"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-foreground">
                              {option.name}
                            </div>
                            {option.description && (
                              <div className="text-muted-foreground text-sm">
                                {option.description}
                              </div>
                            )}
                          </div>
                          {selectedDeliveryOption === option.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {deliveryPrices.length > 0 && (
                    <div>
                      <Label htmlFor="deliveryLocation">
                        Delivery Location
                      </Label>
                      <div className="relative">
                        <MapPin className="top-1/2 left-3 z-10 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                        <Select
                          value={selectedDeliveryPrice}
                          onValueChange={setSelectedDeliveryPrice}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select wilaya" />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryPrices.map((price) => {
                              return (
                                <SelectItem
                                  className="flex justify-between"
                                  key={price.id}
                                  value={price.id!}
                                >
                                  <span>{price.name} - </span>
                                  <span className="italic">
                                    {price.price} DZD
                                  </span>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {communes.length > 0 && (
                    <div>
                      <Label htmlFor="commune">Commune</Label>
                      <div className="relative">
                        <Home className="top-1/2 left-3 z-10 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                        <Select
                          value={address}
                          onValueChange={setSelectedCommune}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select commune" />
                          </SelectTrigger>
                          <SelectContent>
                            {communes
                              .sort((a, b) =>
                                a.commune_name_ascii.localeCompare(
                                  b.commune_name_ascii
                                )
                              )
                              .map((commune, index) => (
                                <SelectItem
                                  key={index}
                                  value={commune.commune_name_ascii}
                                >
                                  {commune.commune_name_ascii}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="hero"
                    className="w-full animate-bounce-every-5s"
                    onClick={handleCreateOrder}
                    disabled={submitting}
                  >
                    {submitting ? "Creating Order..." : "Create Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Additional Product Images */}
        {product.files && product.files.length > 1 && (
          <section className="mx-auto px-4 py-16 border-border border-t container">
            <h2 className="mb-8 font-bold text-foreground text-2xl">
              More Images
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {product.files.slice(1).map((file, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-secondary to-background shadow-product p-4 border border-border rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={file.url}
                    alt={`${product.name} - Image ${index + 2}`}
                    className="rounded h-48 object-cover transition-transform"
                  />
                  <div className="top-2 right-2 absolute bg-black/50 px-2 py-1 rounded text-white text-xs">
                    {index + 2}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto px-4 py-16 border-border border-t container">
            <h2 className="mb-8 font-bold text-foreground text-2xl">
              Related Products
            </h2>
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  {...relatedProduct}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};
export default ProductDetail;
