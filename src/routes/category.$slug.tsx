import { createFileRoute, notFound } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { PageHero } from "@/components/noury/PageHero";
import { ProductGrid } from "@/components/noury/ProductCard";
import { GiftOrderForm } from "@/components/noury/GiftOrderForm";
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
        <section
          className="mx-auto max-w-3xl px-6 py-16"
          dir="rtl"
          style={{ fontFamily: "'Cairo', var(--font-sans)" }}
        >
          <div className="mb-10 text-center">
            <Gift size={34} strokeWidth={1} className="mx-auto text-gold" />
            <h2 className="mt-6 font-serif text-3xl">الهدية على حسب العميل</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              اكتب بياناتك وتفاصيل الهدية، وقولنا الهدية لمين — وهنحوّلك واتساب برسالة جاهزة فيها كل حاجة.
            </p>
          </div>
          <GiftOrderForm />
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
