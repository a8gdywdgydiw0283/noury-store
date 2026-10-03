import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Noury" },
      { name: "description", content: "The terms and conditions for shopping with Noury." },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "1. General",
    body: "By placing an order with Noury you agree to these terms. We reserve the right to update them at any time; the version in effect at the time of your order applies.",
  },
  {
    title: "2. Products & Pricing",
    body: "All prices are displayed in the currency selected at checkout and may change without notice. We make every effort to describe and photograph products accurately, though slight variations may occur.",
  },
  {
    title: "3. Orders",
    body: "An order is confirmed once you receive a confirmation email. We may cancel an order if an item is unavailable or if we suspect fraudulent activity, and any payment taken will be refunded.",
  },
  {
    title: "4. Shipping & Returns",
    body: "Delivery times are estimates and may vary. Unused items in their original packaging may be returned within 14 days. Beauty products must be unopened for hygiene reasons.",
  },
  {
    title: "5. Privacy",
    body: "We collect only the information needed to fulfil your order and to improve your experience. We never sell your personal data to third parties.",
  },
  {
    title: "6. Contact",
    body: "For any questions about these terms, please reach us at hello@noury.eg.",
  },
];

function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="The fine print, in plain language."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Terms & Conditions" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-serif text-2xl">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
