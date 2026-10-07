import { Link } from "@tanstack/react-router";
import { Instagram, Music2, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { currencies, useStore, type Currency } from "./store";

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: <Instagram size={16} strokeWidth={1.25} /> },
  { label: "TikTok", href: "https://tiktok.com", icon: <Music2 size={16} strokeWidth={1.25} /> },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M11 8c3-1 6 1 5 4s-4 3-5 1l-2 8" />
      </svg>
    ),
  },
];

export function Footer() {
  const { currency, setCurrency } = useStore();

  return (
    <footer className="bg-mocha text-cream mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" aria-label="Noury home">
          <Logo size="sm" tone="light" />
        </Link>
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
              className="hover:text-gold transition-colors"
            >
              {s.icon}
            </a>
          ))}
          <label className="relative ml-4 flex items-center gap-1 text-xs">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Currency"
              className="appearance-none bg-transparent text-cream pr-5 cursor-pointer focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="text-foreground">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-0" />
          </label>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <p className="mx-auto max-w-7xl px-6 py-4 text-center text-[0.65rem] tracking-[0.2em] uppercase opacity-60">
          © {new Date().getFullYear()} Noury — Details That Define You
        </p>
      </div>
    </footer>
  );
}
