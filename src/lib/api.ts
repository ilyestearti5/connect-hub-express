import { Biqpod, SettingValueType } from "@biqpod/app/ui/types";
const BASE_URL = false
  ? "http://localhost:3000/snapbuy"
  : "https://developed-nickie-biqpod-7b27f741.koyeb.app/snapbuy";
const API_KEY = "snapbuy_client_c6330f10-36b3-4217-88c4-f8e05658cd64"; // Replace with actual key
export interface CreateOrderOptions {
  products: Biqpod.Snapbuy.Order["products"];
  packs: Biqpod.Snapbuy.Order["packs"];
  client: Biqpod.Snapbuy.Client;
  metaData?: Record<string, SettingValueType>;
  place?: Biqpod.Snapbuy.Order["place"];
  deliveryPriceId?: string;
  note?: string;
}

class SnapBuyAPI {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private async cachedRequest<T>(
    key: string,
    endpoint: string,
    body?: any,
    token?: string
  ): Promise<T> {
    if (token) {
      return this.request(endpoint, body, token);
    }
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }
    const data: T = await this.request(endpoint, body, token);
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }
  private async request<T>(
    endpoint: string,
    body?: any,
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
  // Store
  async getStore(): Promise<Biqpod.Snapbuy.Store> {
    return this.cachedRequest("store", "/store");
  }
  // Collections
  async getCollections(): Promise<Biqpod.Snapbuy.Collection[]> {
    return this.cachedRequest("collections", "/collections");
  }
  async getCollection(
    collectionId: string
  ): Promise<Biqpod.Snapbuy.Collection> {
    return this.cachedRequest(
      `collection_${collectionId}`,
      `/collections/${collectionId}`,
      { collectionId }
    );
  }
  // Products
  async getProducts(
    limit?: number,
    startAt?: string
  ): Promise<Biqpod.Snapbuy.Product[]> {
    const key = `products_${limit || "all"}_${startAt || "start"}`;
    return this.cachedRequest(key, "/products", { limit, startAt });
  }
  async getProduct(prodId: string): Promise<Biqpod.Snapbuy.Product> {
    return this.cachedRequest(`product_${prodId}`, `/products/${prodId}`, {
      prodId,
    });
  }
  // Brands
  async getBrands(): Promise<Biqpod.Snapbuy.Brand[]> {
    return this.cachedRequest("brands", "/brands");
  }
  async getBrand(brandId: string): Promise<Biqpod.Snapbuy.Brand> {
    return this.cachedRequest(`brand_${brandId}`, `/brands/${brandId}`, {
      brandId,
    });
  }
  // Packs
  async getPacks(): Promise<Biqpod.Snapbuy.Pack[]> {
    return this.cachedRequest("packs", "/packs");
  }
  // Orders
  async getOrders(token?: string): Promise<Biqpod.Snapbuy.Order[]> {
    return this.request("/orders", undefined, token);
  }
  async getOrder(
    orderId: string,
    token?: string
  ): Promise<Biqpod.Snapbuy.Order> {
    return this.request(`/orders/${orderId}`, { orderId }, token);
  }
  async createOrder(
    orderData: CreateOrderOptions,
    token?: string
  ): Promise<{ message: string; order: Biqpod.Snapbuy.Order }> {
    return this.request("/create-order", orderData, token);
  }
  // Account
  async createAccount(data: {
    password: string;
    username: string;
    firstname: string;
    lastname: string;
    phone: string;
    email?: string;
    metaData?: Record<string, any>;
  }): Promise<{ message: string; token: string }> {
    return this.request("/account/create", data);
  }
  async checkAccount(username: string): Promise<{ exists: boolean }> {
    return this.request("/account/check", { username });
  }
  async login(data: {
    password: string;
    username: string;
  }): Promise<{ message: string; token: string }> {
    return this.request("/account/login", data);
  }
  async deleteAccount(
    password: string,
    token: string
  ): Promise<{ message: string }> {
    return this.request("/account/delete", { password }, token);
  }
  async getMe(token: string): Promise<Biqpod.Snapbuy.Customer> {
    return this.request("/account/me", undefined, token);
  }
  async changePassword(
    data: { oldPassword: string; newPassword: string },
    token: string
  ): Promise<{ message: string }> {
    return this.request("/account/change-password", data, token);
  }
  // Reviews
  async getReviews(
    limit?: number,
    startAt?: string
  ): Promise<Biqpod.Snapbuy.Review[]> {
    const key = `reviews_${limit || "all"}_${startAt || "start"}`;
    return this.cachedRequest(key, "/reviews/list", { limit, startAt });
  }
  async createReview(
    data: { rating: number; message: string },
    token?: string
  ): Promise<{ message: string; reviewId: string }> {
    return this.request("/reviews", data, token);
  }
  // Delivery
  async getDeliveryOptions(): Promise<Biqpod.Snapbuy.DeliveryOptions[]> {
    return this.cachedRequest("delivery_options", "/delivery-options");
  }
  async getDeliveryPrices(
    deliveryOptionId: string
  ): Promise<Biqpod.Snapbuy.DeliveryPrice[]> {
    return this.cachedRequest(
      `delivery_prices_${deliveryOptionId}`,
      "/delivery-prices",
      { deliveryOptionId }
    );
  }
  // Vars
  async getVars(): Promise<Record<string, any>> {
    return this.cachedRequest("vars", "/vars");
  }
}
export const snapBuyAPI = new SnapBuyAPI();
