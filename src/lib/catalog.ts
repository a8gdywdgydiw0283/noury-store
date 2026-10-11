import { useEffect, useState } from "react";
import {
  categories as localCategories,
  products as localProducts,
  type Category,
  type CategorySlug,
  type Product,
} from "@/components/noury/data";
import { getSupabase } from "./supabase";

export type { CategorySlug, Category, Product };

let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

function fallbackImage(category: string): string {
  return localCategories.find((c) => c.slug === category)?.image ?? "";
}

function rowToProduct(row: Record<string, unknown>): Product | null {
  if (typeof row["slug"] !== "string" || typeof row["name"] !== "string") return null;
  const category = String(row["category"] ?? "accessories");
  const badge = (row["badge"] as string) || undefined;
  const stock = row["stock"];
  return {
    slug: row["slug"] as string,
    name: row["name"] as string,
    category: category as CategorySlug,
    price: Number(row["price"] ?? 0),
    image: (row["image_url"] as string) || fallbackImage(category),
    description: (row["description"] as string) ?? "",
    ...(badge ? { badge } : {}),
    ...(typeof stock === "number" ? { stock } : {}),
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

export type CategoryRow = {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  image_url: string | null;
  custom: boolean;
  visible: boolean;
  sort_order: number;
};

let catCache: Category[] | null = null;
let catInflight: Promise<Category[]> | null = null;

function rowToCategory(row: Record<string, unknown>): Category | null {
  if (typeof row["slug"] !== "string" || typeof row["title"] !== "string") return null;
  const slug = row["slug"] as string;
  const local = localCategories.find((c) => c.slug === slug);
  return {
    slug: slug as CategorySlug,
    title: row["title"] as string,
    subtitle: (row["subtitle"] as string) ?? "",
    blurb: (row["blurb"] as string) ?? "",
    image: (row["image_url"] as string) || local?.image || "",
    custom: Boolean(row["custom"] ?? local?.custom ?? false),
  };
}

/** Remote categories from Supabase, falling back to the built-in list. */
export async function getCategories(): Promise<Category[]> {
  if (catCache) return catCache;
  if (catInflight) return catInflight;
  catInflight = (async () => {
    try {
      const db = getSupabase();
      if (!db) return localCategories;
      const { data, error } = await db
        .from("categories")
        .select("*")
        .eq("visible", true)
        .order("sort_order", { ascending: true });
      if (error || !data || data.length === 0) return localCategories;
      const mapped = data.map(rowToCategory).filter((c): c is Category => Boolean(c));
      return mapped.length > 0 ? mapped : localCategories;
    } catch {
      return localCategories;
    }
  })();
  const result = await catInflight;
  catInflight = null;
  if (result !== localCategories) catCache = result;
  return result;
}

export function refreshCategories(): void {
  catCache = null;
  catInflight = null;
}

/** Sync lookup over the loaded categories (or the built-in list). */
export function findCategory(slug: string): Category | undefined {
  return (catCache ?? localCategories).find((c) => c.slug === slug);
}

export function useCategories(): Category[] {
  const [list, setList] = useState<Category[]>(() => catCache ?? localCategories);
  useEffect(() => {
    let on = true;
    getCategories().then((l) => {
      if (on) setList(l);
    });
    return () => {
      on = false;
    };
  }, []);
  return list;
}
