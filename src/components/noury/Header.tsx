import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav, type NavItem } from "./data";
import { useStore } from "./store";

function IconBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-mocha text-cream text-[0.55rem] px-1">
      {count}
    </span>
  );
}

function NavLink({
  item,
  className,
  activeClassName,
  onClick,
}: {
  item: NavItem;
  className: string;
  activeClassName: string;
  onClick?: (() => void) | undefined;
}) {
  if (item.to === "/category/$slug") {
    return (
      <Link
        to="/category/$slug"
        params={{ slug: item.slug }}
        activeOptions={{ exact: true }}
        className={className}
        activeProps={{ className: activeClassName }}
        onClick={onClick}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/" }}
      className={className}
      activeProps={{ className: activeClassName }}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { cartCount, wishlist } = useStore();

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/search", search: { q: query.trim() } });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-card/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-6 pb-2 grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden cursor-pointer"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.25} />
            </button>
            <form onSubmit={onSearch} className="hidden md:flex items-center gap-1">
              <Search size={18} strokeWidth={1.25} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for your favorites..."
                aria-label="Search products"
                className="w-48 bg-transparent border-b border-border py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </form>
          </div>
          <Link to="/" className="justify-self-center" aria-label="Noury home">
            <Logo />
          </Link>
          <div className="flex justify-end items-center gap-5">
            <Link to="/account" aria-label="Account" className="hidden sm:block hover:text-gold transition-colors">
              <User size={20} strokeWidth={1.25} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hover:text-gold transition-colors">
              <Heart size={20} strokeWidth={1.25} />
              <IconBadge count={wishlist.length} />
            </Link>
            <Link to="/cart" aria-label="Shopping bag" className="relative hover:text-gold transition-colors">
              <ShoppingBag size={20} strokeWidth={1.25} />
              <IconBadge count={cartCount} />
            </Link>
          </div>
        </div>
        <nav className="hidden md:flex justify-center gap-12 pb-3 pt-4 text-sm">
          {nav.map((n) => (
            <NavLink
              key={n.label}
              item={n}
              className="pb-1 border-b border-transparent transition-colors hover:border-border"
              activeClassName="border-gold"
            />
          ))}
        </nav>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-background p-8 animate-rise overflow-y-auto">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="mb-10 cursor-pointer"
          >
            <X strokeWidth={1.25} />
          </button>
          <form onSubmit={onSearch} className="mb-8 flex items-center gap-2 border-b border-border pb-2 max-w-sm">
            <Search size={18} strokeWidth={1.25} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search products"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </form>
          <ul className="space-y-6 font-serif text-3xl">
            {nav.map((n) => (
              <li key={n.label}>
                <NavLink item={n} className="" activeClassName="text-gold" onClick={() => setOpen(false)} />
              </li>
            ))}
          </ul>
          <ul className="mt-12 space-y-4 text-sm">
            <li>
              <Link to="/account" onClick={() => setOpen(false)}>Account</Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist ({wishlist.length})</Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setOpen(false)}>Shopping Bag ({cartCount})</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
