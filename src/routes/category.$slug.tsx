import { createFileRoute, notFound } from "@tanstack/react-router";
import { Baby, Gift, Heart } from "lucide-react";
import { PageHero } from "@/components/noury/PageHero";
import { ProductGrid } from "@/components/noury/ProductCard";
import { GiftOrderForm } from "@/components/noury/GiftOrderForm";
import { BabyFavorsForm } from "@/components/noury/BabyFavorsForm";
import { BridalFavorsForm } from "@/components/noury/BridalFavorsForm";
import { catalogByCategory, findCategory, getCatalog, getCategories } from "@/lib/catalog";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const cats = await getCategories();
    const category = cats.find((c) => c.slug === params.slug) ?? findCategory(params.slug);
    if (!category) throw notFound();
    const catalog = await getCatalog();
    return { category, items: catalogByCategory(catalog, category.slug) };
  },
  head: ({ params }) => {
    const category = findCategory(params.slug);
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
              cloud: true,
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
            {"cloud" in copy && copy.cloud && (
              <div className="relative mx-auto mt-8 max-w-xl rounded-[2rem] border border-gold/40 bg-cream px-8 py-7 text-mocha shadow-[0_10px_40px_rgba(120,90,60,0.15)]">
                <span className="absolute -bottom-2.5 right-16 h-5 w-5 rotate-45 border-b border-r border-gold/40 bg-cream" aria-hidden />
                <span className="absolute -bottom-5 right-10 h-2.5 w-2.5 rounded-full bg-cream border border-gold/40" aria-hidden />
                <p className="font-serif text-2xl leading-snug">هدايا لكل حكاية ❤️</p>
                <p className="mt-3 text-sm leading-loose">
                  مهما كان الشخص اللي في بالك، هنساعدك تختار له الهدية اللي تليق بيه. من هدية لحبيبك أو حبيبتك،
                  لصاحبك أو صديقتك، أو لأي شخص غالي عليك … في نُورِي، لكل شخص هدية، ولكل هدية حكاية
                </p>
              </div>
            )}
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
