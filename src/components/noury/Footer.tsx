import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { currencies, useStore, type Currency } from "./store";

export function Footer() {
  const { currency, setCurrency } = useStore();

  return (
    <footer className="bg-mocha text-cream mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" aria-label="Noury home">
          <Logo size="sm" tone="light" />
        </Link>
        <div className="flex items-center gap-5">
          <label className="relative flex items-center gap-1 text-xs">
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
