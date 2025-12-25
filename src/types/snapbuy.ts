export interface Notification {
  id?: string;
  message?: string;
  type?: "info" | "warning" | "error" | "success";
  createdAt?: number;
  meta?: Record<string, any>;
  readed?: boolean;
}
// ========== Basic Types ==========
export namespace Basic {
  export type OrderStatus = "pending" | "completed" | "cancelled" | "done" | "processing" | "delivery";
  export type PixelId = "facebook" | "instagram" | "tiktok" | "snapchat";
  export type SocielPlatform = "facebook" | "snapchat" | "tiktok" | "instagram" | "youtube" | "telegram" | "discord" | "reddit" | "linkedin" | "pinterest" | "x";
  export type Platform = SocielPlatform | "messenger" | "wechat" | "edge" | "opera" | "chrome" | "safari" | "firefox" | "unknown" | "agent" | "game";
  export type DeliveryCompanyRole = "merchant" | "customer" | "admin" | "support" | "warehouse_operator" | "delivery_agent" | "finance" | "franchise_partner";
  export type SettingValueType = string | number | boolean | string[] | Record<string, any>;
  export type NotifayType =
    | "accountAutoAccept"
    | "clientOrderStatusChange"
    | "clientProductAvailability"
    | "lowStock"
    | "newClient"
    | "newOrder"
    | "newProduct"
    | "orderCancelled"
    | "orderCompleted"
    | "orderDelivery"
    | "orderProcessing"
    | "orderStatusChanged";
  export interface File {
    url: string;
    type: string;
    name?: string;
    size?: number;
  }
  export interface CounterPrice {
    count?: number;
    price?: number;
  }
  export interface DataRelation {
    uid?: string;
    storeId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
  }
}
// ========== Core Entities ==========
export interface Collection extends Basic.DataRelation {
  name: string;
  products?: string[];
  photo?: string;
}
export interface DeliveryOptions extends Basic.DataRelation {
  description: string;
  name: string;
  price?: number;
  type?: "store" | "domicile" | "office";
  enabled?: boolean;
}
export interface DeliveryPrice extends Basic.DataRelation {
  name: string;
  price: number;
  deliveryOptionId: string;
}
export interface Store {
  id: string;
  name: string;
  photo?: string;
  uid?: string;
  phone: string;
  email?: string;
  address?: {
    latitude: number;
    longitude: number;
  };
  createdAt?: number;
  pixels?: Partial<Record<Basic.PixelId, string>>;
  agres?: boolean;
  platforms?: Partial<Record<Basic.SocielPlatform, string>>;
  notify?: Partial<Record<Basic.NotifayType, boolean>>;
}
export interface Order extends Basic.DataRelation {
  status: Basic.OrderStatus;
  platform?: Basic.Platform;
  totalPrice?: number;
  deliveryPriceId?: string;
  deliveryPrice?: number;
  delivery?: {
    uid: string;
    assignedAt: number;
    agentId?: string;
  };
  customer?: string;
  client?: Client;
  products?: Partial<Record<string, Basic.CounterPrice>>;
  packs?: Partial<Record<string, Basic.CounterPrice>>;
  metaData?: Record<string, Basic.SettingValueType>;
  place?: {
    address: string;
    wilaya: string;
    latitude?: number;
    longitude?: number;
  };
  couponId?: string;
  discountAmount?: number;
  note?: string;
  edit?: {
    products?: Partial<Record<string, Basic.CounterPrice>>;
    packs?: Partial<Record<string, Basic.CounterPrice>>;
  };
}
export interface Account {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: {
    city?: string;
  };
  role?: Basic.DeliveryCompanyRole;
  createdAt?: number;
}
export interface Pack extends Basic.DataRelation {
  name?: string;
  price?: number;
  products?: { prodId: string; count: number }[];
}
export interface Customer extends Basic.DataRelation {
  username: string;
  status: "pending" | "rejected" | "accepted";
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password?: string;
  metaData?: Record<string, any>;
}
export interface Client extends Basic.DataRelation {
  firstname?: string;
  lastname?: string;
  phone: string;
}
export interface Template {
  id?: string;
  creatorId?: string;
  name?: string;
  description?: string;
  provider?: string;
  repoId?: string;
  photo?: string;
  singlePrice?: number;
  multiPrice?: number;
  status?: "rejected" | "accepted";
  createdAt?: number;
}
export interface Brand extends Basic.DataRelation {
  name?: string;
  description?: string;
  photo?: string;
}
export interface MetadataField {
  type: FullTypes.Data;
  value: number | string | boolean | string[];
  key: string;
}
export interface Product extends Basic.DataRelation {
  name?: string;
  description?: string;
  files?: Basic.File[];
  quantity?: number;
  available?: boolean;
  type?: "single" | "multiple";
  limited?: boolean;
  single?: {
    client?: number;
    customer?: number;
  };
  metaData?: Partial<Record<string, MetadataField>>;
  multiple?: {
    prices?: {
      quantity: number;
      price: number;
    }[];
  };
  brandId?: string;
}
export interface Coupon extends Basic.DataRelation {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed" | "freeShipping";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  userUsageLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableProducts?: string[] | null;
  applicableCategories?: string[];
  createdBy?: string;
}
export interface Var extends Basic.DataRelation {
  name: string;
  value: string | number | boolean | string[];
  type: FullTypes.Data;
}
export interface Review extends Basic.DataRelation {
  rating: number;
  message: string;
}

// Note: FullTypes.Data is not defined in the provided code. Assuming it's a type for data types.
export namespace FullTypes {
  export type Data = "string" | "number" | "boolean" | "array";
}