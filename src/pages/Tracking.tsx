import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { snapBuyAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Biqpod } from "@biqpod/app/ui/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [products, setProducts] = useState<
    Record<string, Biqpod.Snapbuy.Product>
  >({});
  const [packs, setPacks] = useState<Record<string, Biqpod.Snapbuy.Pack>>({});

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => snapBuyAPI.getOrder(orderId!),
    enabled: !!orderId,
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order) return;

      // Fetch products
      if (order.products) {
        const productPromises = Object.keys(order.products).map(
          async (productId) => {
            try {
              const product = await snapBuyAPI.getProduct(productId);
              return { id: productId, product };
            } catch (error) {
              console.error(`Failed to fetch product ${productId}:`, error);
              return { id: productId, product: null };
            }
          }
        );
        const productResults = await Promise.all(productPromises);
        const productsMap: Record<string, Biqpod.Snapbuy.Product> = {};
        productResults.forEach(({ id, product }) => {
          if (product) productsMap[id] = product;
        });
        setProducts(productsMap);
      }

      // Fetch packs
      if (order.packs) {
        try {
          const allPacks = await snapBuyAPI.getPacks();
          const packsMap: Record<string, Biqpod.Snapbuy.Pack> = {};
          allPacks.forEach((pack) => {
            if (pack.id && order.packs![pack.id]) {
              packsMap[pack.id] = pack;
            }
          });
          setPacks(packsMap);
        } catch (error) {
          console.error("Failed to fetch packs:", error);
        }
      }
    };

    fetchOrderDetails();
  }, [order]);

  if (!orderId) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="mx-auto px-4 py-8 container">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please provide an order ID in the URL query parameter.</p>
              <p>Example: /track?orderId=your-order-id</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="mx-auto px-4 py-8 container">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Loading order details...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="mx-auto px-4 py-8 container">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">
                Error loading order: {error.message}
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="mx-auto px-4 py-8 container">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Order not found.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "delivery":
        return "bg-orange-500";
      case "completed":
        return "bg-green-500";
      case "done":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="mx-auto px-4 py-8 container">
        <Card>
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
            <p className="text-muted-foreground text-sm">Order ID: {orderId}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 font-medium">Ordered Items</h3>
              <div className="space-y-3">
                {order.products &&
                  Object.entries(order.products).map(
                    ([productId, counterPrice]) => {
                      const product = products[productId];
                      return (
                        <div
                          key={productId}
                          className="flex justify-between items-center bg-muted p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {product?.files?.[0] && (
                              <img
                                src={product.files[0].url}
                                alt={product.name}
                                className="rounded w-12 h-12 object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {product?.name || `Product ${productId}`}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Quantity: {counterPrice.count}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {counterPrice.price
                                ? `${counterPrice.price} DZD`
                                : "Price not available"}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                {order.packs &&
                  Object.entries(order.packs).map(([packId, counterPrice]) => {
                    const pack = packs[packId];
                    return (
                      <div
                        key={packId}
                        className="flex justify-between items-center bg-muted p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">
                              {pack?.name || `Pack ${packId}`}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Quantity: {counterPrice.count}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {counterPrice.price
                              ? `${counterPrice.price} DZD`
                              : "Price not available"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {(!order.products ||
                  Object.keys(order.products).length === 0) &&
                  (!order.packs || Object.keys(order.packs).length === 0) && (
                    <p className="text-muted-foreground">
                      No items found in this order.
                    </p>
                  )}
              </div>
            </div>
            {order.delivery && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 font-medium">Delivery Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Assigned At:</strong>{" "}
                      {new Date(order.delivery.assignedAt).toLocaleString()}
                    </p>
                    {order.delivery.agentId && (
                      <p>
                        <strong>Agent ID:</strong> {order.delivery.agentId}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;
