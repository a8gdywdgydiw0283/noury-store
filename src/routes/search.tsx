import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { ProductGrid } from "@/components/noury/ProductCard";
import { categories } from "@/components/noury/data";
import { searchCatalog, useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [{ title: "Search — Noury" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);
  const catalog = useCatalog();
  const results = searchCatalog(catalog, q);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/search", search: { q: term.trim() } });
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <p className="eyebrow text-muted-foreground">Search</p>
      <h1 className="font-serif text-4xl mt-2">
        {q ? <>Results for “{q}”</> : "What are you looking for?"}
      </h1>

      <form onSubmit={onSubmit} className="mt-8 flex max-w-xl items-center gap-3 border-b border-border pb-2">
        <SearchIcon size={18} strokeWidth={1.25} />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for your favorites..."
          aria-label="Search products"
          className="w-full bg-transparent py-1 text-sm focus:outline-none"
        />
        <button type="submit" className="eyebrow cursor-pointer whitespace-nowrap hover:text-gold transition-colors">
          Search
        </button>
      </form>

      {q ? (
        <div className="mt-12">
          <p className="mb-6 text-xs text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <ProductGrid items={results} />
        </div>
      ) : (
        <div className="mt-12">
          <p className="mb-6 text-sm text-muted-foreground">Browse by category</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="border border-border bg-card px-5 py-2.5 text-sm hover:border-foreground transition-colors"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
