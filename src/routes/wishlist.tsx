import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";
import { ProductGrid } from "@/components/noury/ProductCard";
import { useCatalog } from "@/lib/catalog";
import { useStore } from "@/components/noury/store";
import { Heart, ArrowRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Wishlist — Noury" }],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const catalog = useCatalog();
  const items = catalog.filter((p) => wishlist.includes(p.slug));

  return (
    <>
      <PageHero
        eyebrow="Saved for later"
        title="My Wishlist"
        subtitle="The pieces you've saved. Add them to your bag whenever you're ready."
        image={hero1}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {items.length === 0 ? (
          <div className="border border-border bg-card px-6 py-20 text-center">
            <Heart size={28} strokeWidth={1} className="mx-auto text-gold" />
            <h2 className="mt-5 font-serif text-3xl">Your wishlist is empty</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tap the heart on any product to save it here.
            </p>
            <Link
              to="/category/$slug"
              params={{ slug: "accessories" }}
              className="mt-8 inline-flex items-center gap-4 bg-mocha text-cream px-6 py-3 eyebrow"
            >
              Start Shopping <ArrowRight size={14} strokeWidth={1.25} />
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
            <ProductGrid items={items} />
          </>
        )}
      </section>
    </>
  );
}
