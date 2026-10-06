import accessories from "@/assets/cat-accessories.jpg";
import beauty from "@/assets/cat-beauty.jpg";
import gifts from "@/assets/cat-gifts.jpg";
import bridal from "@/assets/cat-bridal.jpg";
import baby from "@/assets/cat-kids.jpg";
import necklace from "@/assets/necklace.jpg";
import rings from "@/assets/rings.jpg";
import bracelets from "@/assets/bracelets.jpg";
import featuredModel from "@/assets/featured-model.jpg";
import story from "@/assets/story.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

export type CategorySlug = "accessories" | "beauty" | "gifts" | "bridal-favors" | "baby-favors";

export type Category = {
  slug: CategorySlug;
  title: string;
  subtitle: string;
  blurb: string;
  image: string;
  custom?: boolean;
};

/** Shipping is arranged with the store owner, not charged automatically. */
export const SHIPPING_NOTE = "Shipping is confirmed with the store";

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  image: string;
  description: string;
  badge?: string;
};

export const categories: Category[] = [
  {
    slug: "accessories",
    title: "Accessories",
    subtitle: "For Him & Her",
    blurb: "Delicate pieces designed to layer, stack and live in.",
    image: accessories,
  },
  {
    slug: "beauty",
    title: "Beauty",
    subtitle: "Makeup & Skincare",
    blurb: "Everyday radiance, from skin prep to the final glow.",
    image: beauty,
  },
  {
    slug: "gifts",
    title: "Gifts",
    subtitle: "For Every Occasion",
    blurb: "Every gift is tailored to the customer — tell us what you have in mind.",
    image: gifts,
    custom: true,
  },
  {
    slug: "bridal-favors",
    title: "Bridal Favors",
    subtitle: "Weddings & Henna",
    blurb: "Elegant favors for bridal showers, weddings and henna nights.",
    image: bridal,
  },
  {
    slug: "baby-favors",
    title: "Baby Favors",
    subtitle: "Newborn Distributions",
    blurb: "Personalised newborn favors — tell us the baby name, count and birth date.",
    image: baby,
    custom: true,
  },
];

export const products: Product[] = [
  {
    slug: "delicate-gold-necklace",
    name: "Delicate Gold Necklace",
    category: "accessories",
    price: 749,
    image: necklace,
    description:
      "A fine 18k-plated chain with a single polished pendant — light enough to wear every day.",
    badge: "Best Seller",
  },
  {
    slug: "layering-gold-necklace",
    name: "Layering Gold Necklace",
    category: "accessories",
    price: 829,
    image: necklace,
    description: "Two chains, one clasp. Built for effortless layering and mixing.",
  },
  {
    slug: "stacked-rings-set",
    name: "Stacked Rings Set",
    category: "accessories",
    price: 599,
    image: rings,
    description: "A trio of textured bands that stack beautifully or stand alone.",
  },
  {
    slug: "pearl-drop-earrings",
    name: "Pearl Drop Earrings",
    category: "accessories",
    price: 559,
    image: rings,
    description: "Freshwater pearls suspended from a slim gold hoop.",
  },
  {
    slug: "chain-bracelet",
    name: "Chain Bracelet",
    category: "accessories",
    price: 649,
    image: bracelets,
    description: "A classic flat-link bracelet finished with a secure clasp.",
  },
  {
    slug: "bridal-favor-set",
    name: "Bridal Favor Set",
    category: "bridal-favors",
    price: 599,
    image: story,
    description: "Elegant keepsakes for your bridal party and wedding guests.",
    badge: "Best Seller",
  },
  {
    slug: "henna-night-favors",
    name: "Henna Night Favors",
    category: "bridal-favors",
    price: 399,
    image: featuredModel,
    description: "Delicate favors for henna nights and engagement celebrations.",
  },
  {
    slug: "rose-glow-lip-set",
    name: "Rose Glow Lip Set",
    category: "beauty",
    price: 429,
    image: beauty,
    description: "Three buildable satin shades that flatter every skin tone.",
  },
  {
    slug: "radiance-skincare-duo",
    name: "Radiance Skincare Duo",
    category: "beauty",
    price: 899,
    image: beauty,
    description: "A brightening serum and moisturiser, paired for a natural glow.",
    badge: "Best Seller",
  },
  {
    slug: "glow-beauty-essentials",
    name: "Glow Beauty Essentials",
    category: "beauty",
    price: 699,
    image: beauty,
    description: "A curated edit of the pieces we reach for every single day.",
  },
];

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
};

export const collections: Collection[] = [
  { slug: "new-arrivals", title: "New Arrivals", subtitle: "Just landed this week", image: hero1 },
  { slug: "best-sellers", title: "Best Sellers", subtitle: "Loved by our community", image: featuredModel },
  { slug: "the-gold-edit", title: "The Gold Edit", subtitle: "Warm tones, layered", image: necklace },
  { slug: "gift-ready", title: "Gift Ready", subtitle: "Wrapped and ready", image: gifts },
  { slug: "bridal-favors", title: "Bridal Favors", subtitle: "Weddings & henna", image: bridal },
  { slug: "evening", title: "Evening", subtitle: "For after dark", image: hero2 },
];

export type NavItem =
  | { label: string; to: "/" | "/collections" | "/about" }
  | { label: string; to: "/category/$slug"; slug: CategorySlug };

export const nav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Accessories", to: "/category/$slug", slug: "accessories" },
  { label: "Beauty", to: "/category/$slug", slug: "beauty" },
  { label: "Gifts", to: "/category/$slug", slug: "gifts" },
  { label: "Bridal Favors", to: "/category/$slug", slug: "bridal-favors" },
  { label: "Baby Favors", to: "/category/$slug", slug: "baby-favors" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
];

export const footerLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Shipping", to: "/shipping" },
  { label: "FAQ", to: "/faq" },
  { label: "Terms & Conditions", to: "/terms" },
] as const;

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function formatEGP(value: number): string {
  return `${value.toLocaleString("en-EG")} EGP`;
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}
