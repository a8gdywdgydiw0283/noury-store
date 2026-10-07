import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";
import { ProductGrid } from "@/components/noury/ProductCard";
import { catalogByCategory, useCatalog, type Product } from "@/lib/catalog";
import hero1 from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Noury" },
      { name: "description", content: "Explore Noury collections: new arrivals, best sellers, the gold edit and more." },
    ],
  }),
  component: Collections,
});

function Collections() {
  const catalog = useCatalog();
  const sections: Array<{ id: string; title: string; subtitle: string; items: Product[] }> = [
    {
      id: "new-arrivals",
      title: "New Arrivals",
      subtitle: "Just landed this week",
      items: catalog.filter((p) => p.badge === "New").concat(catalog.slice(0, 2)),
    },
    {
      id: "best-sellers",
      title: "Best Sellers",
      subtitle: "Loved by our community",
      items: catalog.filter((p) => p.badge === "Best Seller"),
    },
    {
      id: "the-gold-edit",
      title: "The Gold Edit",
      subtitle: "Warm tones, made to layer",
      items: catalogByCategory(catalog, "accessories"),
    },
  ];
  return (
    <>
      <PageHero
        eyebrow="Curated for you"
        title="Collections"
        subtitle="A considered edit of pieces for every moment — from everyday essentials to the ones worth celebrating."
        image={hero1}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Collections" }]}
      />
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8">
            <p className="eyebrow text-muted-foreground">{s.subtitle}</p>
            <h2 className="font-serif text-4xl mt-2">{s.title}</h2>
          </div>
          <ProductGrid items={s.items} />
        </section>
      ))}
    </>
  );
}
