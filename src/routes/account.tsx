import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHero } from "@/components/noury/PageHero";
import { useStore } from "@/components/noury/store";
import { LogOut, Package, Heart, ShoppingBag } from "lucide-react";
import featured from "@/assets/featured-model.jpg";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Account — Noury" }],
  }),
  component: Account,
});

type Account = { name: string; email: string };

const KEY = "noury.account.v1";

function Account() {
  const { wishlist, cartCount } = useStore();
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setAccount(JSON.parse(raw) as Account);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function signIn(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.password.length < 4) {
      setError("Enter your name, a valid email and a password of at least 4 characters.");
      return;
    }
    const next = { name: form.name.trim(), email: form.email.trim() };
    setAccount(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setError("");
    toast.success(`Welcome, ${next.name}`);
  }

  function signOut() {
    setAccount(null);
    window.localStorage.removeItem(KEY);
    setForm({ name: "", email: "", password: "" });
    toast("You have been signed out");
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <>
      <PageHero
        eyebrow={account ? `Welcome back, ${account.name}` : "Your account"}
        title={account ? "My Account" : "Sign In"}
        subtitle={account ? "Track your orders and manage your wishlist." : "Sign in to check out faster and save your favorites."}
        image={featured}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Account" }]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        {!ready ? null : account ? (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <Link to="/wishlist" className="group border border-border bg-card p-6 hover:border-foreground transition-colors">
                <Heart size={22} strokeWidth={1.25} className="text-gold" />
                <p className="mt-3 font-serif text-2xl">{wishlist.length}</p>
                <p className="text-xs text-muted-foreground">Wishlist items</p>
              </Link>
              <Link to="/cart" className="group border border-border bg-card p-6 hover:border-foreground transition-colors">
                <ShoppingBag size={22} strokeWidth={1.25} className="text-gold" />
                <p className="mt-3 font-serif text-2xl">{cartCount}</p>
                <p className="text-xs text-muted-foreground">Items in bag</p>
              </Link>
              <div className="border border-border bg-card p-6">
                <Package size={22} strokeWidth={1.25} className="text-gold" />
                <p className="mt-3 font-serif text-2xl">0</p>
                <p className="text-xs text-muted-foreground">Orders placed</p>
              </div>
            </div>

            <div className="border border-border bg-card p-8">
              <h2 className="font-serif text-2xl">Account details</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>{account.name}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{account.email}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={signOut}
                className="mt-6 inline-flex items-center gap-2 border border-border px-6 py-3 eyebrow hover:border-foreground transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={signIn} className="mx-auto max-w-md space-y-5">
            <div>
              <label htmlFor="acc-name" className="eyebrow text-muted-foreground">Name</label>
              <input
                id="acc-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`${field} mt-2`}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="acc-email" className="eyebrow text-muted-foreground">Email</label>
              <input
                id="acc-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`${field} mt-2`}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="acc-pass" className="eyebrow text-muted-foreground">Password</label>
              <input
                id="acc-pass"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${field} mt-2`}
                placeholder="••••••"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full bg-mocha text-cream py-3.5 eyebrow hover:bg-foreground transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Demo sign-in — your details are stored only on this device.
            </p>
          </form>
        )}
      </section>
    </>
  );
}
