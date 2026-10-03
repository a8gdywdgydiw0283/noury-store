import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";
import { Truck, Package, RotateCcw, ShieldCheck } from "lucide-react";
import gifts from "@/assets/cat-gifts.jpg";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns — Noury" },
      { name: "description", content: "Delivery times, shipping fees and returns policy at Noury." },
    ],
  }),
  component: Shipping,
});

const perks = [
  { I: Truck, title: "Fast Delivery", text: "Orders are dispatched within 1–2 business days." },
  { I: Package, title: "Free Over 999 EGP", text: "Free shipping across Egypt on orders over 999 EGP." },
  { I: ShieldCheck, title: "Secure Payment", text: "Pay with card, wallet or cash on delivery." },
  { I: RotateCcw, title: "Easy Returns", text: "14-day returns on unused items in original packaging." },
];

function Shipping() {
  return (
    <>
      <PageHero
        eyebrow="Good to know"
        title="Shipping & Returns"
        subtitle="Everything you need to know about getting your Noury order to your door."
        image={gifts}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Shipping" }]}
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="border border-border bg-card p-6">
              <p.I size={26} strokeWidth={1} className="text-gold" />
              <h3 className="mt-4 font-serif text-xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl">Delivery times</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
              <div className="flex justify-between py-4">
                <dt>Cairo & Giza</dt>
                <dd className="text-muted-foreground">1–2 business days</dd>
              </div>
              <div className="flex justify-between py-4">
                <dt>Alexandria & Delta</dt>
                <dd className="text-muted-foreground">2–3 business days</dd>
              </div>
              <div className="flex justify-between py-4">
                <dt>Upper Egypt</dt>
                <dd className="text-muted-foreground">3–5 business days</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="font-serif text-3xl">Returns</h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              If something isn't quite right, you have 14 days to return unused items in their original
              packaging. Beauty products must be unopened for hygiene reasons. To start a return, contact our
              team and we'll arrange the rest.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex bg-mocha text-cream px-6 py-3 eyebrow hover:bg-foreground transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
