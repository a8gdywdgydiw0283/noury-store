import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Boxes,
  ClipboardList,
  Gift,
  LayoutDashboard,
  Tags,
  Users,
  Wallet,
} from "lucide-react";
import { PageHero } from "@/components/noury/PageHero";
import { adminPassword, isSupabaseConfigured } from "@/lib/supabase";
import { fetchOrders, fetchProductsAdmin, type OrderRow, type ProductRow } from "@/lib/orders";
import { LangProvider, LangToggle, useLang, type TKey } from "@/components/admin/lang";
import { DashboardTab } from "@/components/admin/DashboardTab";
import { FavorsTab, OrdersTab } from "@/components/admin/OrdersTabs";
import { CustomersTab } from "@/components/admin/CustomersTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { FinanceTab } from "@/components/admin/FinanceTab";
import { inputCls } from "@/components/admin/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "الإدارة — Noury" }] }),
  component: Admin,
});

const ADMIN_KEY = "noury.admin.v1";

type Tab = "dashboard" | "orders" | "favors" | "customers" | "products" | "categories" | "finance";

const tabDefs: Array<{ id: Tab; labelKey: TKey; icon: React.ReactNode }> = [
  { id: "dashboard", labelKey: "tab_dashboard", icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
  { id: "orders", labelKey: "tab_orders", icon: <ClipboardList size={16} strokeWidth={1.5} /> },
  { id: "favors", labelKey: "tab_favors", icon: <Gift size={16} strokeWidth={1.5} /> },
  { id: "customers", labelKey: "tab_customers", icon: <Users size={16} strokeWidth={1.5} /> },
  { id: "products", labelKey: "tab_products", icon: <Boxes size={16} strokeWidth={1.5} /> },
  { id: "categories", labelKey: "tab_categories", icon: <Tags size={16} strokeWidth={1.5} /> },
  { id: "finance", labelKey: "tab_finance", icon: <Wallet size={16} strokeWidth={1.5} /> },
];

function Admin() {
  return (
    <LangProvider>
      <AdminInner />
    </LangProvider>
  );
}

function AdminInner() {
  const { t, lang } = useLang();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersFailed, setOrdersFailed] = useState(false);
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem(ADMIN_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchOrders().then((o) => {
      setOrders(o ?? []);
      if (o === null) setOrdersFailed(true);
    });
    fetchProductsAdmin().then(setRows);
  }, [authed]);

  function reloadProducts() {
    fetchProductsAdmin().then(setRows);
  }

  function login(e: FormEvent) {
    e.preventDefault();
    if (password === adminPassword() && adminPassword()) {
      window.sessionStorage.setItem(ADMIN_KEY, "1");
      setAuthed(true);
    } else {
      toast.error(t("wrongPass"));
    }
  }

  function logout() {
    window.sessionStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
    setPassword("");
  }

  const dir = lang === "ar" ? "rtl" : "ltr";

  if (!authed) {
    return (
      <LangProvider>
        <PageHero eyebrow="Private" title={t("loginTitle")} subtitle={t("loginSub")} breadcrumb={[{ label: "Home", to: "/" }, { label: "Admin" }]} />
        <section className="mx-auto max-w-md px-6 py-16" dir={dir}>
          <div className="mb-4 flex justify-end">
            <LangToggle />
          </div>
          <form onSubmit={login} className="space-y-4 border border-border bg-card p-8">
            <label className="block">
              <span className="eyebrow text-muted-foreground">{t("password")}</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-2`} placeholder={t("passwordPh")} />
            </label>
            <button type="submit" className="w-full bg-mocha text-cream py-3 eyebrow hover:bg-foreground transition-colors cursor-pointer">
              {t("loginBtn")}
            </button>
          </form>
        </section>
      </LangProvider>
    );
  }

  return (
    <div dir={dir} style={{ fontFamily: "'Cairo', var(--font-sans)" }}>
      <div className="border-b border-border bg-mocha text-cream">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-gold">Noury ERP</p>
            <h1 className="font-serif text-2xl mt-1">{t("adminTitle")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button type="button" onClick={logout} className="border border-cream/30 px-5 py-2 text-xs hover:border-cream transition-colors cursor-pointer">
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-8 md:flex-row">
        <aside className="md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 md:sticky md:top-6">
            {tabDefs.map((tb) => (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(tb.id)}
                className={`flex shrink-0 items-center gap-3 border px-4 py-3 text-sm cursor-pointer transition-colors ${tab === tb.id ? "bg-mocha text-cream border-mocha" : "border-border bg-card hover:border-foreground"}`}
              >
                {tb.icon}
                {t(tb.labelKey)}
                {tb.id === "orders" && orders.some((o) => o.status === "new") && (
                  <span className="ms-auto bg-gold text-mocha text-[0.65rem] px-2 py-0.5 rounded-full">
                    {orders.filter((o) => o.status === "new").length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          {!isSupabaseConfigured && (
            <p className="mb-6 border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
              {t("envWarn")}
            </p>
          )}
          {ordersFailed && (
            <p className="mb-6 border border-destructive/50 bg-card px-4 py-3 text-xs">
              {t("dbError")}
            </p>
          )}
          {tab === "dashboard" && <DashboardTab orders={orders} />}
          {tab === "orders" && <OrdersTab orders={orders} setOrders={setOrders} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
          {tab === "favors" && <FavorsTab orders={orders} setOrders={setOrders} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
          {tab === "customers" && <CustomersTab orders={orders} />}
          {tab === "products" && <ProductsTab rows={rows} reload={reloadProducts} />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "finance" && <FinanceTab orders={orders} />}
        </main>
      </div>
    </div>
  );
}
