import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import gifts from "@/assets/cat-gifts.jpg";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Noury" },
      { name: "description", content: "Answers to the most common questions about Noury orders, shipping and products." },
    ],
  }),
  component: Faq,
});

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders are dispatched within 1–2 business days. Delivery takes 1–2 days in Cairo & Giza, 2–3 days in Alexandria & the Delta, and 3–5 days in Upper Egypt.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes — shipping is free across Egypt on all orders over 999 EGP.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept credit and debit cards, mobile wallets, and cash on delivery.",
  },
  {
    q: "Can I return an item?",
    a: "Absolutely. You have 14 days to return unused items in their original packaging. Beauty products must be unopened for hygiene reasons.",
  },
  {
    q: "Do you gift wrap?",
    a: "Every Noury order arrives in our signature packaging. Gift sets are hand-wrapped and can include a handwritten card.",
  },
  {
    q: "How do I contact support?",
    a: "Reach us through the Contact page or email hello@noury.eg. Our team is available Sunday to Thursday, 10am – 6pm.",
  },
];

function Faq() {
  return (
    <>
      <PageHero
        eyebrow="Help & Support"
        title="Frequently Asked Questions"
        subtitle="Quick answers to the things our customers ask most. Still stuck? We're one message away."
        image={gifts}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="font-serif text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-12 border border-border bg-card p-8 text-center">
          <h3 className="font-serif text-2xl">Still have a question?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Our team is happy to help.</p>
          <Link to="/contact" className="mt-6 inline-flex bg-mocha text-cream px-6 py-3 eyebrow hover:bg-foreground transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
