import { getSupabase } from "./supabase";
import { findProduct } from "./catalog";
import type { CartLine } from "@/components/noury/store";
import type { CustomerInfo } from "@/components/noury/whatsapp";

export type OrderStatus = "new" | "confirmed" | "shipped" | "cancelled";

export type OrderRow = {
  id: string;
  source: string;
  customer: Record<string, unknown>;
  items: Array<{ slug?: string; name?: string; qty?: number; price?: number }>;
  details: Record<string, unknown> | null;
  subtotal: number;
  status: string;
  created_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  description: string;
  badge: string | null;
  visible: boolean;
  created_at: string;
};

/** Save a checkout order. Never throws — the WhatsApp flow must keep working. */
export async function saveCheckoutOrder(
  cart: CartLine[],
  customer: CustomerInfo,
  subtotal: number,
): Promise<void> {
  try {
    const db = getSupabase();
    if (!db) return;
    const items = cart.map((l) => {
      const p = findProduct(l.slug);
      return { slug: l.slug, name: p?.name ?? l.slug, qty: l.qty, price: p?.price ?? 0 };
    });
    await db.from("orders").insert({ source: "checkout", customer, items, subtotal });
  } catch {
    /* dashboard offline — order still goes through WhatsApp */
  }
}

/** Save a gift / baby / bridal favor request. Never throws. */
export async function saveFavorRequest(
  source: "gift" | "baby" | "bridal",
  customer: Record<string, unknown>,
  details: Record<string, unknown>,
): Promise<void> {
  try {
    const db = getSupabase();
    if (!db) return;
    await db.from("orders").insert({ source, customer, items: [], details });
  } catch {
    /* dashboard offline — request still goes through WhatsApp */
  }
}

export async function fetchOrders(): Promise<OrderRow[] | null> {
  try {
    const db = getSupabase();
    if (!db) return null;
    const { data, error } = await db
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return null;
    return (data ?? []) as OrderRow[];
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  try {
    const db = getSupabase();
    if (!db) return false;
    const { error } = await db.from("orders").update({ status }).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchProductsAdmin(): Promise<ProductRow[] | null> {
  try {
    const db = getSupabase();
    if (!db) return null;
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return null;
    return (data ?? []) as ProductRow[];
  } catch {
    return null;
  }
}

export async function upsertProduct(
  row: Partial<ProductRow> & { slug: string },
): Promise<boolean> {
  try {
    const db = getSupabase();
    if (!db) return false;
    const { error } = await db.from("products").upsert(row, { onConflict: "slug" });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const db = getSupabase();
    if (!db) return false;
    const { error } = await db.from("products").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    const db = getSupabase();
    if (!db) return null;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await db.storage.from("product-images").upload(path, file);
    if (error) return null;
    const { data } = db.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl || null;
  } catch {
    return null;
  }
}
