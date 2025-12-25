import wirelessAdapter from "@/assets/wireless-adapter.png";
import usbHub from "@/assets/usb-hub.png";
import carAdapter from "@/assets/car-adapter.png";
import hdmiAdapter from "@/assets/hdmi-adapter.png";
import travelDock from "@/assets/travel-dock.png";

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    slug: "universal-wireless-display-adapter",
    name: "Universal Wireless Display & Car Adapter Kit",
    price: 49.99,
    originalPrice: 69.99,
    image: wirelessAdapter,
    rating: 4.8,
    reviews: 234,
    badge: "Best Seller",
    category: "Wireless Adapters",
    description: "Stream content wirelessly from any device to your TV, monitor, or car display. This versatile adapter supports screen mirroring, extended display mode, and works seamlessly with iOS, Android, Windows, and macOS devices.",
    features: [
      "Universal compatibility with all major operating systems",
      "4K resolution support at 30Hz",
      "Dual-band WiFi for stable streaming",
      "Plug-and-play setup, no app required",
      "Compact design perfect for travel",
      "Built-in cooling system for extended use"
    ],
    specs: [
      { label: "Resolution", value: "Up to 4K@30Hz" },
      { label: "Connectivity", value: "WiFi 5 (802.11ac)" },
      { label: "Input", value: "USB-A" },
      { label: "Weight", value: "28g" },
      { label: "Dimensions", value: "65 x 35 x 12mm" },
    ],
  },
  {
    id: 2,
    slug: "7-in-1-usb-c-hub-pro",
    name: "7-in-1 USB-C Hub Pro",
    price: 59.99,
    image: usbHub,
    rating: 4.9,
    reviews: 512,
    badge: "Popular",
    category: "USB Hubs & Docks",
    description: "Expand your laptop's connectivity with this premium aluminum hub. Features 7 essential ports including 4K HDMI, USB 3.0, SD card reader, and 100W power delivery pass-through for seamless productivity.",
    features: [
      "4K HDMI output for external displays",
      "3x USB 3.0 ports for high-speed data transfer",
      "SD and microSD card slots",
      "100W USB-C Power Delivery pass-through",
      "Premium aluminum construction with heat dissipation"
    ],
    specs: [
      { label: "Ports", value: "7 total" },
      { label: "HDMI Output", value: "4K@60Hz" },
      { label: "USB Speed", value: "USB 3.0 (5Gbps)" },
      { label: "PD Power", value: "Up to 100W" },
      { label: "Material", value: "Aluminum alloy" },
    ],
  },
  {
    id: 3,
    slug: "bluetooth-car-receiver",
    name: "Bluetooth 5.0 Car Receiver",
    price: 29.99,
    originalPrice: 39.99,
    image: carAdapter,
    rating: 4.7,
    reviews: 189,
    category: "CarTech",
    description: "Upgrade any car stereo with wireless Bluetooth connectivity. This compact receiver plugs into your AUX port and delivers crystal-clear audio for music, calls, and navigation with hands-free convenience.",
    features: [
      "Bluetooth 5.0 for stable connection",
      "Hands-free calling with built-in microphone",
      "Dual device pairing",
      "10-hour battery life",
      "3.5mm AUX output",
      "One-button controls for easy operation"
    ],
    specs: [
      { label: "Bluetooth", value: "5.0" },
      { label: "Range", value: "10m (33ft)" },
      { label: "Battery", value: "10 hours" },
      { label: "Charging", value: "USB-C" },
      { label: "Audio Codec", value: "AAC, SBC" },
    ],
  },
  {
    id: 4,
    slug: "usb-c-hdmi-adapter",
    name: "USB-C to HDMI 4K Adapter",
    price: 24.99,
    image: hdmiAdapter,
    rating: 4.6,
    reviews: 342,
    category: "USB Hubs & Docks",
    description: "Connect your USB-C laptop or tablet to any HDMI display with this braided cable adapter. Supports 4K resolution with HDR for stunning visuals in presentations, movies, and gaming.",
    features: [
      "4K@60Hz HDR support",
      "Braided nylon cable for durability",
      "Gold-plated connectors",
      "Plug-and-play, no drivers needed",
      "Compatible with Thunderbolt 3/4"
    ],
    specs: [
      { label: "Resolution", value: "4K@60Hz HDR" },
      { label: "Cable Length", value: "1.8m (6ft)" },
      { label: "Input", value: "USB-C / Thunderbolt" },
      { label: "Output", value: "HDMI 2.0" },
      { label: "Material", value: "Braided nylon" },
    ],
  },
  {
    id: 5,
    slug: "compact-travel-dock",
    name: "Compact Travel Dock Station",
    price: 79.99,
    originalPrice: 99.99,
    image: travelDock,
    rating: 4.9,
    reviews: 156,
    badge: "New",
    category: "USB Hubs & Docks",
    description: "The ultimate portable docking station for digital nomads and business travelers. Combines essential ports in a pocket-sized design with built-in cable management and 100W charging support.",
    features: [
      "All-in-one portable dock solution",
      "Dual display support (HDMI + USB-C)",
      "Gigabit Ethernet port",
      "Built-in retractable cable",
      "100W Power Delivery",
      "Compact folding design"
    ],
    specs: [
      { label: "Ports", value: "9 total" },
      { label: "Display Output", value: "Dual 4K@60Hz" },
      { label: "Ethernet", value: "Gigabit (1Gbps)" },
      { label: "PD Power", value: "100W" },
      { label: "Weight", value: "145g" },
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find((p) => p.id === id);
};
