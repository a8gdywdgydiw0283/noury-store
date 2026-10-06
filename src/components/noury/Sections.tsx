import { Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Gift, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { categories, productsByCategory } from "./data";
import featured from "@/assets/featured-model.jpg";
import story from "@/assets/story.jpg";
import gifts from "@/assets/cat-gifts.jpg";

const Arrow = () => (
  <ArrowRight size={16} strokeWidth={1.25} className="transition-transform group-hover:translate-x-1" />
);
const zoom = "transition-transform duration-[1200ms] ease-out group-hover:scale-105";

export function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((c) => (
        <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group block bg-card border border-border">
          <div className="aspect-[5/4] overflow-hidden">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              width={816}
              height={816}
              className={`h-full w-full object-cover ${zoom}`}
            />
          </div>
          <div className="flex items-end justify-between px-4 py-4 bg-secondary">
            <div>
              <h3 className="font-serif text-2xl">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{c.subtitle}</p>
            </div>
            <Arrow />
          </div>
        </Link>
      ))}
    </section>
  );
}

const perks = [
  { I: Truck, t: "Fast & Secure Delivery", s: "Across Egypt" },
  { I: ShieldCheck, t: "Secure Payment", s: "Multiple Options" },
  null,
  { I: Gift, t: "Beautiful Packaging", s: "For a Special Touch" },
  { I: Heart, t: "Customer Support", s: "Always Here" },
];

export function Benefits() {
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 divide-x divide-border py-8">
        {perks.map((p, k) =>
          p ? (
            <div key={k} className="flex flex-col items-center text-center gap-2 px-4 py-3">
              <p.I size={26} strokeWidth={1} />
              <p className="text-sm mt-1">{p.t}</p>
              <p className="text-[0.7rem] text-muted-foreground">{p.s}</p>
            </div>
          ) : (
            <div key={k} className="hidden md:flex flex-col items-center justify-center">
              <Logo size="sm" tagline={false} />
              <p className="text-sm mt-2 text-muted-foreground">Details That Define You.</p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export function Featured() {
  const featuredProducts = productsByCategory("accessories").slice(0, 3);
  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="grid md:grid-cols-[1fr_1.6fr] items-stretch">
        <div className="relative min-h-[320px]">
          <img
            src={featured}
            alt="Model wearing Noury gold jewelry"
            loading="lazy"
            width={1024}
            height={768}
            className="absolute inset-0 h-full w-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary hidden md:block" />
        </div>
        <div className="grid md:grid-cols-[0.9fr_1.6fr] gap-8 items-center px-6 md:pr-10 py-12">
          <div>
            <p className="eyebrow text-muted-foreground">Featured Collection</p>
            <h2 className="font-serif text-5xl mt-3">Accessories</h2>
            <p className="mt-3 text-muted-foreground">Small details. Big impact.</p>
            <Link
              to="/category/$slug"
              params={{ slug: "accessories" }}
              className="group mt-7 inline-flex items-center gap-4 whitespace-nowrap bg-background px-6 py-3 eyebrow border border-border hover:border-foreground transition-colors"
            >
              Explore Collection <Arrow />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {featuredProducts.map((p) => (
              <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="group block">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={816}
                    height={816}
                    className={`h-full w-full object-cover ${zoom}`}
                  />
                </div>
                <div className="flex justify-between items-center mt-3 text-sm">
                  {p.name}
                  <Arrow />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoryRow() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-[1fr_1.5fr_1fr] gap-4">
      <div className="bg-card border border-border p-8 flex gap-6">
        <span className="font-serif text-6xl leading-none text-foreground/80">
          N<span className="text-gold text-base align-top">✦</span>
        </span>
        <div>
          <h2 className="font-serif text-3xl">Our Story</h2>
          <p className="text-sm mt-1 text-muted-foreground">More Than a Brand...</p>
          <p className="text-xs leading-relaxed mt-5 text-muted-foreground">
            Noury was born from a simple idea: that style is not just what you wear, but how you feel.
            Every piece is carefully chosen to be a part of your story.
          </p>
          <Link to="/about" className="group mt-6 inline-flex items-center gap-3 text-sm">
            Discover More <Arrow />
          </Link>
        </div>
      </div>
      <Link to="/collections" className="group overflow-hidden min-h-[260px]">
        <img
          src={story}
          alt="Noury gift box with handwritten thank-you card"
          loading="lazy"
          width={1024}
          height={640}
          className={`h-full w-full object-cover ${zoom}`}
        />
      </Link>
      <div className="group relative overflow-hidden min-h-[300px] text-cream">
        <img
          src={gifts}
          alt="Noury favors and giveaways for brides"
          loading="lazy"
          width={816}
          height={816}
          className={`absolute inset-0 h-full w-full object-cover object-right ${zoom}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mocha/75 to-mocha/10" />
        <div className="relative h-full flex flex-col justify-center p-8">
          <h2 className="font-serif text-3xl">Bridal Favors</h2>
          <p className="text-sm mt-1 opacity-90">Favors &amp; giveaways for weddings &amp; henna nights</p>
          <Link
            to="/collections"
            className="mt-6 inline-flex w-fit items-center gap-3 bg-cream text-mocha px-5 py-2.5 eyebrow"
          >
            Shop Now <ArrowRight size={14} strokeWidth={1.25} />
          </Link>
        </div>
      </div>
    </section>
  );
}
