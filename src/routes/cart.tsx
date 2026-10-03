import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";
import { getProduct } from "@/components/noury/data";
import { useStore } from "@/components/noury/store";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Shopping Bag — Noury" }],
  }),
  component: Cart,
});

const FREE_SHIPPING = 999;

function Cart() {
  const { cart, cartTotal, setQty, removeFromCart, formatPrice } = useStore();
  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.slug) }))
    .filter((x): x is { line: typeof x.line; product: NonNullable<typeof x.product> } => Boolean(x.product));

  const shipping = cartTotal >= FREE_SHIPPING || cartTotal === 0 ? 0 : 60;
  const remaining = Math.max(0, FREE_SHIPPING - cartTotal);

  return (
    <>
      <PageHero
        eyebrow="Almost yours"
        title="Shopping Bag"
        subtitle={lines.length > 0 ? "Review your pieces and check out when you're ready." : undefined}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Shopping Bag" }]}
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        {lines.length === 0 ? (
          <div className="border border-border bg-card px-6 py-20 text-center">
            <ShoppingBag size={28} strokeWidth={1} className="mx-auto text-gold" />
            <h2 className="mt-5 font-serif text-3xl">Your bag is empty</h2>
            <p className="mt-3 text-sm text-muted-foreground">Discover something you'll love.</p>
            <Link
              to="/collections"
              className="mt-8 inline-flex items-center gap-4 bg-mocha text-cream px-6 py-3 eyebrow"
            >
              Browse Collections <ArrowRight size={14} strokeWidth={1.25} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              {remaining > 0 && (
                <p className="mb-6 border border-border bg-secondary px-4 py-3 text-xs text-muted-foreground">
                  Add {formatPrice(remaining)} more to unlock free shipping.
                </p>
              )}
              <div className="divide-y divide-border border-y border-border">
                {lines.map(({ line, product }) => (
                  <div key={line.slug} className="flex gap-5 py-5">
                    <Link to="/product/$slug" params={{ slug: product.slug }} className="shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        width={160}
                        height={200}
                        className="h-28 w-24 object-cover border border-border"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link to="/product/$slug" params={{ slug: product.slug }} className="text-sm hover:text-gold transition-colors">
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>
                          <p className="text-sm mt-1">{formatPrice(product.price)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.slug)}
                          aria-label={`Remove ${product.name}`}
                          className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} strokeWidth={1.25} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(product.slug, line.qty - 1)}
                            className="grid h-9 w-9 place-items-center cursor-pointer hover:bg-secondary"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-9 text-center text-sm">{line.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(product.slug, line.qty + 1)}
                            className="grid h-9 w-9 place-items-center cursor-pointer hover:bg-secondary"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="h-fit border border-border bg-card p-8">
              <h2 className="font-serif text-2xl">Order Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(cartTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt>Total</dt>
                  <dd>{formatPrice(cartTotal + shipping)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 w-full bg-mocha text-cream py-3.5 eyebrow hover:bg-foreground transition-colors cursor-pointer flex items-center justify-center"
              >
                Checkout
              </Link>
              <Link to="/collections" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
