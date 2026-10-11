import { getSupabase } from "./supabase";
import type { OrderRow } from "./orders";

/* ---------- Categories ---------- */

export async function fetchCategoriesAdmin() {
  try {
    const db = getSupabase();
    if (!db) return null;
    const { data, error } = await db
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) return null;
    return (data ?? []) as import("./catalog").CategoryRow[];
  } catch {
    return null;
  }
}

export async function upsertCategory(row: {
  slug: string;
  title: string;
  subtitle?: string;
  blurb?: string;
  image_url?: string | null;
  custom?: boolean;
  visible?: boolean;
  sort_order?: number;
}): Promise<boolean> {
  try {
    const db = getSupabase();
    if (!db) return false;
    const { error } = await db.from("categories").upsert(row, { onConflict: "slug" });
    return !error;
  } catch {
    return false;
  }
}

/* ---------- Stock ---------- */

export async function adjustStock(items: Array<{ slug?: string; qty?: number }>, direction: 1 | -1): Promise<void> {
  try {
    const db = getSupabase();
    if (!db || items.length === 0) return;
    const slugs = [...new Set(items.map((i) => i.slug).filter((s): s is string => Boolean(s)))];
    if (slugs.length === 0) return;
    const { data } = await db.from("products").select("slug,stock").in("slug", slugs);
    const rows = (data ?? []) as Array<{ slug: string; stock: number }>;
    await Promise.all(
      rows.map((r) => {
        const qty = items.filter((i) => i.slug === r.slug).reduce((s, i) => s + (i.qty ?? 0), 0);
        const next = Math.max(0, Number(r.stock ?? 0) + direction * qty);
        return db.from("products").update({ stock: next }).eq("slug", r.slug);
      }),
    );
  } catch {
    /* never break the admin flow */
  }
}

export async function fetchStockAlerts(): Promise<Array<{ slug: string; name: string; stock: number; low: number }>> {
  try {
    const db = getSupabase();
    if (!db) return [];
    const { data, error } = await db.from("products").select("slug,name,stock,low_stock_at").eq("visible", true);
    if (error) return [];
    return ((data ?? []) as Array<{ slug: string; name: string; stock: number; low_stock_at: number }>)
      .filter((r) => Number(r.stock ?? 0) <= Number(r.low_stock_at ?? 5))
      .map((r) => ({ slug: r.slug, name: r.name, stock: Number(r.stock ?? 0), low: Number(r.low_stock_at ?? 5) }));
  } catch {
    return [];
  }
}

/* ---------- Customers (aggregated from orders, guest checkout) ---------- */

export type CustomerSummary = {
  phone: string;
  name: string;
  governorate: string;
  address: string;
  orders: number;
  spent: number;
  sources: string[];
  lastOrder: string;
};

export function summarizeCustomers(orders: OrderRow[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();
  for (const o of orders) {
    const c = (o.customer ?? {}) as Record<string, string>;
    const phone = String(c["phone"] ?? "").trim();
    if (!phone) continue;
    const prev = map.get(phone);
    const spent = o.status === "cancelled" ? 0 : Number(o.subtotal ?? 0);
    if (!prev) {
      map.set(phone, {
        phone,
        name: String(c["name"] ?? "—"),
        governorate: String(c["governorate"] ?? "—"),
        address: String(c["address"] ?? "—"),
        orders: 1,
        spent,
        sources: [o.source],
        lastOrder: o.created_at,
      });
    } else {
      prev.orders += 1;
      prev.spent += spent;
      if (!prev.sources.includes(o.source)) prev.sources.push(o.source);
      if (o.created_at > prev.lastOrder) {
        prev.lastOrder = o.created_at;
        if (c["name"]) prev.name = String(c["name"]);
        if (c["governorate"]) prev.governorate = String(c["governorate"]);
        if (c["address"]) prev.address = String(c["address"]);
      }
    }
  }
  return [...map.values()].sort((a, b) => b.spent - a.spent);
}

/* ---------- Finance ---------- */

export type ExpenseRow = {
  id: string;
  title: string;
  amount: number;
  category: string;
  spent_on: string;
  notes: string;
  created_at: string;
};

export async function fetchExpenses(): Promise<ExpenseRow[] | null> {
  try {
    const db = getSupabase();
    if (!db) return null;
    const { data, error } = await db
      .from("expenses")
      .select("*")
      .order("spent_on", { ascending: false })
      .limit(500);
    if (error) return null;
    return (data ?? []) as ExpenseRow[];
  } catch {
    return null;
  }
}

export async function upsertExpense(row: Partial<ExpenseRow> & { title: string }): Promise<boolean> {
  try {
    const db = getSupabase();
    if (!db) return false;
    const payload = { ...row, amount: Number(row.amount ?? 0) };
    const { error } = row.id
      ? await db.from("expenses").update(payload).eq("id", row.id)
      : await db.from("expenses").insert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const db = getSupabase();
    if (!db) return false;
    const { error } = await db.from("expenses").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export function revenueOf(orders: OrderRow[]): number {
  return orders
    .filter((o) => o.status === "confirmed" || o.status === "shipped")
    .reduce((s, o) => s + Number(o.subtotal ?? 0), 0);
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(): string {
  return new Date().toISOString().slice(0, 7);
}
