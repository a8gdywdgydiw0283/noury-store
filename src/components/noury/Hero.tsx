import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroBride from "@/assets/hero-bride.jpg";

export function Hero() {
  return (
    <section className="relative h-[560px] md:h-[620px] overflow-hidden bg-mocha text-cream">
      <img src={heroBride} alt="Noury bridal collection" width={1920} height={1024}
        className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-mocha/85 via-mocha/45 to-transparent" />
      <div className="relative mx-auto max-w-7xl h-full px-6 flex flex-col justify-center animate-rise">
        <p className="eyebrow">Welcome to Noury</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-[1.02] font-normal">More Than<br />Just Products...</h1>
        <p className="font-script text-5xl md:text-6xl text-gold mt-2">It's a Feeling</p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-90">
          From elegant accessories to beauty essentials, gifts and bridal favors — everything you need to express your unique style.
        </p>
        <Link to="/category/$slug" params={{ slug: "accessories" }} className="mt-8 inline-flex w-fit items-center gap-6 bg-cream text-mocha px-7 py-3.5 eyebrow hover:bg-background transition-colors">
          Shop Now <ArrowRight size={16} strokeWidth={1.25} />
        </Link>
      </div>
    </section>
  );
}
