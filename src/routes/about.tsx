import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/noury/PageHero";
import { ArrowRight, Sparkles, Heart, Gem } from "lucide-react";
import story from "@/assets/story.jpg";
import featured from "@/assets/featured-model.jpg";
import hero2 from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Noury" },
      { name: "description", content: "Noury is more than a brand — it's a feeling. Discover our story." },
    ],
  }),
  component: About,
});

const values = [
  {
    I: Sparkles,
    title: "Considered Design",
    text: "Every piece is chosen for how it makes you feel, not just how it looks.",
  },
  {
    I: Heart,
    title: "Made With Care",
    text: "From selection to packaging, we sweat the small details so you don't have to.",
  },
  {
    I: Gem,
    title: "Timeless Quality",
    text: "Pieces designed to be worn now and loved for years to come.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="More Than a Brand"
        subtitle="Noury was born from a simple idea: that style is not just what you wear, but how you feel. Every piece is carefully chosen to be a part of your story."
        image={story}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-2 items-center">
        <div className="group overflow-hidden">
          <img
            src={featured}
            alt="Noury model wearing gold jewelry"
            width={1024}
            height={1024}
            className="w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Details That Define You</p>
          <h2 className="font-serif text-4xl mt-3">Small details, big impact</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            What began as a small edit of accessories has grown into a full world of style — accessories,
            beauty, gifts and celebration favors, all under one roof. We curate pieces that feel personal, pieces
            that become part of your everyday rituals.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Whether you're treating yourself or finding the perfect gift, we're here to make it feel special.
          </p>
          <Link
            to="/collections"
            className="group mt-8 inline-flex items-center gap-4 bg-mocha text-cream px-6 py-3 eyebrow"
          >
            Explore Collections
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="text-center">
              <v.I size={28} strokeWidth={1} className="mx-auto text-gold" />
              <h3 className="mt-4 font-serif text-2xl">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-mocha text-cream">
        <img src={hero2} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-script text-5xl text-gold">Your Style, Your Story</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Ready to find your next favorite?</h2>
          <Link
            to="/category/$slug"
            params={{ slug: "accessories" }}
            className="mt-8 inline-flex items-center gap-4 bg-cream text-mocha px-7 py-3.5 eyebrow hover:bg-background transition-colors"
          >
            Shop Now <ArrowRight size={16} strokeWidth={1.25} />
          </Link>
        </div>
      </section>
    </>
  );
}
