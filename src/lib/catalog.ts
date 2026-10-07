import { useEffect, useState } from "react";
import {
  categories,
  products as localProducts,
  type CategorySlug,
  type Product,
} from "@/components/noury/data";
import { getSupabase } from "./supabase";

export type { CategorySlug, Product };

let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

function fallbackImage(category: string): string {
  return categories.find((c) => c.slug === category)?.image ?? "";
}

function rowToProduct(row: Record<string, unknown>): Product | null {
  if (typeof row["slug"] !== "string" || typeof row["name"] !== "string") return null;
  const category = String(row["category"] ?? "accessories");
  const badge = (row["badge"] as string) || undefined;
  return {
    slug: row["slug"] as string,
    name: row["name"] as string,
    category: category as CategorySlug,
    price: Number(row["price"] ?? 0),
    image: (row["image_url"] as string) || fallbackImage(category),
    description: (row["description"] as string) ?? "",
    ...(badge ? { badge } : {}),
  };
}

/** Remote products from Supabase, falling back to the built-in list. */
export async function getCatalog(): Promise<Product[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const db = getSupabase();
      if (!db) return localProducts;
      const { data, error } = await db
        .from("products")
        .select("*")
        .eq("visible", true)
        .order("created_at", { ascending: false });
      if (error || !data || data.length === 0) return localProducts;
      const mapped = data.map(rowToProduct).filter((p): p is Product => Boolean(p));
      return mapped.length > 0 ? mapped : localProducts;
    } catch {
      return localProducts;
    }
  })();
  const result = await inflight;
  inflight = null;
  if (result !== localProducts) cache = result;
  return result;
}

/** Clear the cached catalog so the next read fetches fresh data. */
export function refreshCatalog(): void {
  cache = null;
  inflight = null;
}

/** Sync lookup over the loaded catalog (or the built-in list). */
export function findProduct(slug: string): Product | undefined {
  return (cache ?? localProducts).find((p) => p.slug === slug);
}

export function catalogByCategory(list: Product[], slug: CategorySlug): Product[] {
  return list.filter((p) => p.category === slug);
}

export function searchCatalog(list: Product[], q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return list.filter((p) =>
    `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term),
  );
}

export function useCatalog(): Product[] {
  const [list, setList] = useState<Product[]>(() => cache ?? localProducts);
  useEffect(() => {
    let on = true;
    getCatalog().then((l) => {
      if (on) setList(l);
    });
    return () => {
      on = false;
    };
  }, []);
  return list;
}
