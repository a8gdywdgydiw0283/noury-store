import { createFileRoute, notFound } from "@tanstack/react-router";
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
