import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import story from "@/assets/story.jpg";

const slides = [hero1, hero2, story];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[560px] md:h-[620px] overflow-hidden bg-mocha text-cream">
      {slides.map((s, k) => (
        <img key={k} src={s} alt="" width={1920} height={1024}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${k === i ? "opacity-100" : "opacity-0"}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-mocha/85 via-mocha/45 to-transparent" />
      <div className="relative mx-auto max-w-7xl h-full px-6 flex flex-col justify-center animate-rise">
        <p className="eyebrow">Welcome to Noury</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-[1.02] font-normal">More Than<br />Just Products...</h1>
        <p className="font-script text-5xl md:text-6xl text-gold mt-2">It's a Feeling</p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-90">
          From elegant accessories to beauty essentials, gifts and celebration favors — everything you need to express your unique style.
        </p>
        <Link to="/category/$slug" params={{ slug: "accessories" }} className="mt-8 inline-flex w-fit items-center gap-6 bg-cream text-mocha px-7 py-3.5 eyebrow hover:bg-background transition-colors">
          Shop Now <ArrowRight size={16} strokeWidth={1.25} />
        </Link>
      </div>
      <div className="absolute bottom-8 right-8 flex items-center gap-4 text-xs tracking-widest">
        <span>0{i + 1} / 0{slides.length}</span>
        <button aria-label="Previous" onClick={() => setI((i + slides.length - 1) % slides.length)}><ArrowLeft size={16} strokeWidth={1.25} /></button>
        <button aria-label="Next" onClick={() => setI((i + 1) % slides.length)}><ArrowRight size={16} strokeWidth={1.25} /></button>
      </div>
    </section>
  );
}
