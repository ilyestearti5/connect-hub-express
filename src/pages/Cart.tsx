import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { snapBuyAPI } from "@/lib/api";
import { Biqpod } from "@biqpod/app/ui/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Cart = () => {
  const { state, dispatch } = useCart();
  const [deliveryOptions, setDeliveryOptions] = useState<
    Biqpod.Snapbuy.DeliveryOptions[]
  >([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<string>("");
  const [deliveryPrices, setDeliveryPrices] = useState<
    Biqpod.Snapbuy.DeliveryPrice[]
  >([]);
  const [selectedDeliveryPrice, setSelectedDeliveryPrice] =
    useState<string>("");

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const options = await snapBuyAPI.getDeliveryOptions();
        setDeliveryOptions(
          options.filter((option) => option.enabled !== false)
        );
      } catch (error) {
        console.error("Failed to fetch delivery options:", error);
      }
    };
    fetchDeliveryOptions();
  }, []);

  useEffect(() => {
    if (selectedDeliveryOption) {
      const fetchDeliveryPrices = async () => {
        try {
          const prices = await snapBuyAPI.getDeliveryPrices(
            selectedDeliveryOption
          );
          setDeliveryPrices(prices);
          setSelectedDeliveryPrice(""); // Reset selection when options change
        } catch (error) {
          console.error("Failed to fetch delivery prices:", error);
        }
      };
      fetchDeliveryPrices();
    } else {
      setDeliveryPrices([]);
      setSelectedDeliveryPrice("");
    }
  }, [selectedDeliveryOption]);

  const selectedDeliveryPriceObj = deliveryPrices.find(
    (p) => p.id === selectedDeliveryPrice
  );
  const deliveryCost = selectedDeliveryPriceObj
    ? selectedDeliveryPriceObj.price
    : 0;
  const totalWithDelivery = state.total + deliveryCost;
  const finalTotal = totalWithDelivery * 1.08; // Including tax

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-1 justify-center items-center">
          <div className="space-y-6 text-center">
            <ShoppingBag className="mx-auto w-24 h-24 text-muted-foreground" />
            <div>
              <h1 className="mb-2 font-bold text-foreground text-2xl">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground">
                Add some products to get started!
              </p>
            </div>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto px-4 container">
          <h1 className="mb-8 font-bold text-foreground text-3xl">
            Shopping Cart
          </h1>

          <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="bg-secondary rounded-lg w-20 h-20 object-contain"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="font-bold text-primary text-lg">
                          {item.price.toFixed(2)}DZD
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg">
                          {(item.price * item.quantity).toFixed(2)}DZD
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>{state.total.toFixed(2)}DZD</span>
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium text-sm">
                      Delivery Option
                    </label>
                    <Select
                      value={selectedDeliveryOption}
                      onValueChange={setSelectedDeliveryOption}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery option" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id!}>
                            {option.name} - {option.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {deliveryPrices.length > 0 && (
                    <div className="space-y-2">
                      <label className="font-medium text-sm">
                        Delivery Location
                      </label>
                      <Select
                        value={selectedDeliveryPrice}
                        onValueChange={setSelectedDeliveryPrice}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select wilaya" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryPrices.map((price) => (
                            <SelectItem key={price.id} value={price.id!}>
                              {price.name} - {price.price.toFixed(2)}DZD
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{deliveryCost.toFixed(2)}DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{(totalWithDelivery * 0.08).toFixed(2)}DZD</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)}DZD</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
