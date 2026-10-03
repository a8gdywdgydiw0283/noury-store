import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { PageHero } from "@/components/noury/PageHero";
import { ProductGrid } from "@/components/noury/ProductCard";
import { getCategory, productsByCategory } from "@/components/noury/data";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category, items: productsByCategory(category.slug) };
  },
  head: ({ params }) => {
    const category = getCategory(params.slug);
    const name = category ? category.title : "Shop";
    return {
      meta: [
        { title: `${name} — Noury` },
        { name: "description", content: category ? category.blurb : "Shop Noury." },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, items } = Route.useLoaderData();

  if (category.custom) {
    return (
      <>
        <PageHero
          eyebrow={category.subtitle}
          title={category.title}
          subtitle={category.blurb}
          image={category.image}
          breadcrumb={[{ label: "Home", to: "/" }, { label: category.title }]}
        />
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="border border-border bg-card px-8 py-16 text-center">
            <Gift size={34} strokeWidth={1} className="mx-auto text-gold" />
            <h2 className="mt-6 font-serif text-3xl">Gifts made for you</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Every gift is customised to the customer. Tell us the occasion, your budget and who it's for,
              and we'll put together something special — wrapped and ready.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-4 bg-mocha text-cream px-7 py-3.5 eyebrow hover:bg-foreground transition-colors"
            >
              Tell us what you'd like
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={category.subtitle}
        title={category.title}
        subtitle={category.blurb}
        image={category.image}
        breadcrumb={[{ label: "Home", to: "/" }, { label: category.title }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="mb-6 text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "piece" : "pieces"} in {category.title}
        </p>
        <ProductGrid items={items} />
      </section>
    </>
  );
}
