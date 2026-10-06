import { createFileRoute, notFound } from "@tanstack/react-router";
import { Baby, Gift, Heart } from "lucide-react";
import { PageHero } from "@/components/noury/PageHero";
import { ProductGrid } from "@/components/noury/ProductCard";
import { GiftOrderForm } from "@/components/noury/GiftOrderForm";
import { BabyFavorsForm } from "@/components/noury/BabyFavorsForm";
import { BridalFavorsForm } from "@/components/noury/BridalFavorsForm";
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
    const copy =
      category.slug === "baby-favors"
        ? {
            icon: <Baby size={34} strokeWidth={1} className="mx-auto text-gold" />,
            title: "توزيعات المواليد على حسب العميل",
            text: "اكتب بيانات الشحن وتفاصيل التوزيعات — اسم البيبي والعدد وتاريخ الولادة والإضافة — وهنحوّلك واتساب برسالة جاهزة فيها كل حاجة.",
            form: <BabyFavorsForm />,
          }
        : category.slug === "bridal-favors"
          ? {
              icon: <Heart size={34} strokeWidth={1} className="mx-auto text-gold" />,
              title: "توزيعات العرايس على حسب العميل",
              text: "اكتب بيانات الشحن وتفاصيل التوزيعات — اسم العريس واسم العروسة والجملة على الكارت والتاريخ — ولو حابب ارفق صورتكم، وهنحوّلك واتساب برسالة جاهزة فيها كل حاجة.",
              form: <BridalFavorsForm />,
            }
          : {
              icon: <Gift size={34} strokeWidth={1} className="mx-auto text-gold" />,
              title: "الهدية على حسب العميل",
              text: "اكتب بياناتك وتفاصيل الهدية، وقولنا الهدية لمين — وهنحوّلك واتساب برسالة جاهزة فيها كل حاجة.",
              form: <GiftOrderForm />,
            };
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
            {copy.icon}
            <h2 className="mt-6 font-serif text-3xl">{copy.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.text}</p>
          </div>
          {copy.form}
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
