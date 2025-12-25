import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Hash,
  MessageSquare,
  Users,
  Linkedin,
  Pin,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { snapBuyAPI } from "@/lib/api";
import { Biqpod } from "@biqpod/app/ui/types";

const Footer = () => {
  const [store, setStore] = useState<Biqpod.Snapbuy.Store | null>(null);
  const [collections, setCollections] = useState<Biqpod.Snapbuy.Collection[]>(
    []
  );

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeData = await snapBuyAPI.getStore();
        setStore(storeData);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      }
    };
    fetchStore();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await snapBuyAPI.getCollections();
        setCollections(collectionsData);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };
    fetchCollections();
  }, []);

  const platformIcons: Record<string, any> = {
    facebook: Facebook,
    x: X,
    instagram: Instagram,
    youtube: Youtube,
    snapchat: MessageCircle,
    tiktok: Hash,
    telegram: MessageSquare,
    discord: MessageSquare,
    reddit: Users,
    linkedin: Linkedin,
    pinterest: Pin,
  };

  const socialLinks = Object.entries(store?.platforms || {}).map(
    ([platform, url]) => ({
      icon: platformIcons[platform] || MessageCircle,
      href: url,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    })
  );

  return (
    <footer className="bg-secondary border-border border-t">
      <div className="mx-auto px-4 py-16 container">
        <div className="gap-8 grid grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4 col-span-2 md:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary rounded-xl w-10 h-10">
                <span className="font-bold text-primary-foreground text-lg">
                  {store?.name?.charAt(0).toUpperCase() || "C"}
                </span>
              </div>
              <span className="font-bold text-foreground text-xl tracking-tight">
                {store?.name || "CONNECT HUB"}
              </span>
            </a>
            <p className="max-w-xs text-muted-foreground">
              Premium connectivity solutions for home, office, and on-the-go.
              Engineered for the modern lifestyle.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex justify-center items-center bg-background hover:bg-primary/10 rounded-lg w-10 h-10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          {collections.length > 0 && (
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Shop</h4>
              <ul className="space-y-3">
                {collections.map((collection) => (
                  <li key={collection.id}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {collection.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex md:flex-row flex-col justify-between items-center gap-4 mt-12 pt-8 border-border border-t">
          <p className="text-muted-foreground text-sm">
            © 2024 Connect Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-muted-foreground text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
