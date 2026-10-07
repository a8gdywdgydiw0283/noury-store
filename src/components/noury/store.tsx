import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { findProduct } from "@/lib/catalog";

export type CartLine = { slug: string; qty: number };

export const currencies = ["EGP", "USD", "AED", "SAR"] as const;
export type Currency = (typeof currencies)[number];

const RATES: Record<Currency, number> = { EGP: 1, USD: 0.02, AED: 0.075, SAR: 0.077 };

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (slug: string, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (valueEGP: number) => string;
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "noury.cart.v1";
const WISH_KEY = "noury.wishlist.v1";
const CURRENCY_KEY = "noury.currency.v1";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>("EGP");

  // Load persisted state after hydration so the server-rendered markup matches.
  useEffect(() => {
    setCart(readJSON<CartLine[]>(CART_KEY, []));
    setWishlist(readJSON<string[]>(WISH_KEY, []));
    const saved = window.localStorage.getItem(CURRENCY_KEY);
    if (saved && (currencies as readonly string[]).includes(saved)) {
      setCurrency(saved as Currency);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  const addToCart = useCallback((slug: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, qty }];
    });
    const product = findProduct(slug);
    toast.success(`${product ? product.name : "Item"} added to your bag`);
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) => {
      const has = prev.includes(slug);
      const product = findProduct(slug);
      toast(has ? "Removed from wishlist" : `${product ? product.name : "Item"} saved to wishlist`);
      return has ? prev.filter((s) => s !== slug) : [...prev, slug];
    });
  }, []);

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const product = findProduct(l.slug);
        return sum + (product ? product.price * l.qty : 0);
      }, 0),
    [cart],
  );

  const formatPrice = useCallback(
    (valueEGP: number) => {
      const converted = valueEGP * RATES[currency];
      const rounded = currency === "EGP" ? Math.round(converted) : Math.round(converted * 100) / 100;
      return `${rounded.toLocaleString("en-EG", {
        minimumFractionDigits: currency === "EGP" ? 0 : 2,
        maximumFractionDigits: currency === "EGP" ? 0 : 2,
      })} ${currency}`;
    },
    [currency],
  );

  const value: StoreValue = {
    cart,
    wishlist,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    currency,
    setCurrency,
    formatPrice,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
