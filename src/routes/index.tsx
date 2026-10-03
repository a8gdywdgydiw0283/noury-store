import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/noury/Hero";
import { Categories, Benefits, Featured, StoryRow, InstagramGrid } from "@/components/noury/Sections";
import { ProductGrid } from "@/components/noury/ProductCard";
import { products } from "@/components/noury/data";
import { Link } from "@tanstack/react-router";

const title = "Noury — Details That Define You | Accessories, Beauty, Gifts & Favors";
const description = "Shop Noury for elegant accessories, beauty essentials, gifts and celebration favors for kids and brides.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Categories />
      <Benefits />
      <Featured />
      <StoryRow />
      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-muted-foreground">Loved right now</p>
            <h2 className="font-serif text-4xl mt-2">New & Noteworthy</h2>
          </div>
          <Link to="/collections" className="text-sm underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid items={products.slice(0, 4)} />
      </section>
      <InstagramGrid />
    </>
  );
}
