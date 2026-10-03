import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { type Product } from "./data";
import { useStore } from "./store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useStore();
  const wishlisted = isWishlisted(product.slug);

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden bg-card border border-border">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={816}
            height={816}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 bg-mocha text-cream px-2.5 py-1 text-[0.6rem] tracking-[0.2em] uppercase">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-background/85 backdrop-blur border border-border transition-colors hover:border-foreground cursor-pointer"
        >
          <Heart
            size={16}
            strokeWidth={1.25}
            className={wishlisted ? "fill-gold text-gold" : "text-foreground"}
          />
        </button>
        <button
          type="button"
          onClick={() => addToCart(product.slug)}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-mocha text-cream py-2.5 eyebrow opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer"
        >
          <ShoppingBag size={14} strokeWidth={1.25} /> Add to Bag
        </button>
      </div>
      <div className="flex items-start justify-between gap-3 mt-3">
        <div>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="text-sm hover:text-gold transition-colors"
          >
            {product.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>
        </div>
        <span className="text-sm whitespace-nowrap">{formatPrice(product.price)}</span>
      </div>
    </div>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return (
      <div className="border border-border bg-card px-6 py-16 text-center">
        <p className="font-serif text-2xl">Nothing here yet</p>
        <p className="mt-2 text-sm text-muted-foreground">Try another category or search term.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-3 bg-mocha text-cream px-6 py-3 eyebrow"
        >
          Back to Home <ArrowRight size={14} strokeWidth={1.25} />
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
