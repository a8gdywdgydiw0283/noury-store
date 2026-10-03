import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Heart, Minus, Plus, ShieldCheck, Truck, Gift } from "lucide-react";
import { ProductGrid } from "@/components/noury/ProductCard";
import { getCategory, getProduct, products } from "@/components/noury/data";
import { useStore } from "@/components/noury/store";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
    return { product, related };
  },
  head: ({ params }) => {
    const product = getProduct(params.slug);
    return {
      meta: [
        { title: product ? `${product.name} — Noury` : "Product — Noury" },
        { name: "description", content: product ? product.description : "Shop Noury." },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useStore();
  const [qty, setQty] = useState(1);
  const category = getCategory(product.category);
  const wishlisted = isWishlisted(product.slug);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-8 flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="text-gold">/</span>
          {category && (
            <>
              <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">
                {category.title}
              </Link>
              <span className="text-gold">/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative overflow-hidden bg-card border border-border">
            <img src={product.image} alt={product.name} width={1024} height={1024} className="w-full object-cover" />
            {product.badge && (
              <span className="absolute left-4 top-4 bg-mocha text-cream px-3 py-1 text-[0.6rem] tracking-[0.2em] uppercase">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow text-muted-foreground">{category ? category.title : "Noury"}</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl">{formatPrice(product.price)}</p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center cursor-pointer hover:bg-secondary"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-11 w-11 place-items-center cursor-pointer hover:bg-secondary"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => addToCart(product.slug, qty)}
                className="flex-1 bg-mocha text-cream py-3.5 eyebrow hover:bg-foreground transition-colors cursor-pointer"
              >
                Add to Bag
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.slug)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                className="grid h-11 w-11 place-items-center border border-border hover:border-foreground transition-colors cursor-pointer"
              >
                <Heart size={18} strokeWidth={1.25} className={wishlisted ? "fill-gold text-gold" : ""} />
              </button>
            </div>

            <div className="mt-8 space-y-3 border-t border-border pt-6 text-xs text-muted-foreground">
              <p className="flex items-center gap-3"><Truck size={16} strokeWidth={1.25} /> Fast & secure delivery across Egypt</p>
              <p className="flex items-center gap-3"><ShieldCheck size={16} strokeWidth={1.25} /> Secure payment — multiple options</p>
              <p className="flex items-center gap-3"><Gift size={16} strokeWidth={1.25} /> Arrives in beautiful Noury packaging</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl">You May Also Like</h2>
            {category && (
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className="group inline-flex items-center gap-2 text-sm"
              >
                More {category.title}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
          <ProductGrid items={related} />
        </section>
      )}
    </>
  );
}
