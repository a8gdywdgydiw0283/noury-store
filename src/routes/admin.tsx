import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHero } from "@/components/noury/PageHero";
import { adminPassword, isSupabaseConfigured } from "@/lib/supabase";
import { refreshCatalog } from "@/lib/catalog";
import {
  deleteProduct,
  fetchOrders,
  fetchProductsAdmin,
  updateOrderStatus,
  uploadProductImage,
  upsertProduct,
  type OrderRow,
  type OrderStatus,
  type ProductRow,
} from "@/lib/orders";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Noury" }] }),
  component: Admin,
});

const ADMIN_KEY = "noury.admin.v1";
const statuses: OrderStatus[] = ["new", "confirmed", "shipped", "cancelled"];
const statusLabel: Record<string, string> = { new: "جديد", confirmed: "تم التأكيد", shipped: "اتشحن", cancelled: "ملغي" };
const sourceLabel: Record<string, string> = { checkout: "سلة", gift: "هدية", baby: "مواليد", bridal: "عرايس" };
const keyLabel: Record<string, string> = {
  name: "الاسم",
  phone: "الموبايل",
  altPhone: "الرقم البديل",
  governorate: "المحافظة",
  address: "العنوان",
  recipient: "الهدية لمين",
  details: "التفاصيل",
  babyName: "اسم البيبي",
  quantity: "العدد",
  birthDate: "تاريخ الولادة",
  addition: "الإضافة",
  groomName: "اسم العريس",
  brideName: "اسم العروسة",
  cardPhrase: "الجملة على الكارت",
  eventDate: "التاريخ",
  photosCount: "عدد الصور",
};
const categories = ["accessories", "beauty", "gifts", "bridal-favors", "baby-favors"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const input =
  "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors";

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"orders" | "favors" | "products">("orders");
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem(ADMIN_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchOrders().then((o) => {
      setOrders(o ?? []);
      if (o === null) setLoadError(true);
    });
    fetchProductsAdmin().then((r) => {
      setRows(r ?? []);
      if (r === null) setLoadError(true);
    });
  }, [authed]);

  function login(e: FormEvent) {
    e.preventDefault();
    if (password === adminPassword()) {
      window.sessionStorage.setItem(ADMIN_KEY, "1");
      setAuthed(true);
    } else {
      toast.error("كلمة السر غلط");
    }
  }

  async function changeStatus(id: string, status: OrderStatus) {
    const ok = await updateOrderStatus(id, status);
    if (ok) {
      setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null);
      toast.success("اتحدثت الحالة");
    } else {
      toast.error("فشل التحديث");
    }
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    if (!editing?.slug?.trim() || !editing?.name?.trim()) {
      toast.error("الاسم والـ slug مطلوبين");
      return;
    }
    const ok = await upsertProduct({
      ...editing,
      slug: editing.slug.trim(),
      price: Number(editing.price ?? 0),
    });
    if (ok) {
      toast.success("اتحفظ المنتج");
      setEditing(null);
      refreshCatalog();
      fetchProductsAdmin().then(setRows);
    } else {
      toast.error("فشل الحفظ");
    }
  }

  async function onImageFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const url = await uploadProductImage(file);
    setUploading(false);
    if (url) {
      setEditing((p) => ({ ...p, image_url: url }));
      toast.success("اترفعت الصورة");
    } else {
      toast.error("فشل رفع الصورة");
    }
  }

  async function removeProduct(id: string, name: string) {
    if (!window.confirm(`تحذف "${name}"؟`)) return;
    const ok = await deleteProduct(id);
    if (ok) {
      toast.success("اتحذف المنتج");
      refreshCatalog();
      fetchProductsAdmin().then(setRows);
    } else {
      toast.error("فشل الحذف");
    }
  }

  if (!authed) {
    return (
      <>
        <PageHero eyebrow="Private" title="Admin" subtitle="لوحة تحكم المتجر." breadcrumb={[{ label: "Home", to: "/" }, { label: "Admin" }]} />
        <section className="mx-auto max-w-md px-6 py-16" dir="rtl">
          <form onSubmit={login} className="space-y-4 border border-border bg-card p-8">
            <Field label="كلمة السر">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="اكتب كلمة السر" />
            </Field>
            <button type="submit" className="w-full bg-mocha text-cream py-3 eyebrow hover:bg-foreground transition-colors cursor-pointer">
              دخول
            </button>
          </form>
        </section>
      </>
    );
  }

  const checkoutOrders = (orders ?? []).filter((o) => o.source === "checkout");
  const favorOrders = (orders ?? []).filter((o) => o.source !== "checkout");
  const shownOrders = (tab === "orders" ? checkoutOrders : favorOrders).filter(
    (o) => statusFilter === "all" || o.status === statusFilter,
  );

  return (
    <>
      <PageHero eyebrow="Private" title="Admin" subtitle="الطلبات والمنتجات." breadcrumb={[{ label: "Home", to: "/" }, { label: "Admin" }]} />
      <section className="mx-auto max-w-6xl px-6 py-12" dir="rtl">
        {!isSupabaseConfigured && (
          <p className="mb-6 border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
            Supabase غير مربوط — ضيف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env (ولو على Vercel ضيفهم في Environment Variables).
          </p>
        )}
        {loadError && (
          <p className="mb-6 border border-destructive/50 bg-card px-4 py-3 text-xs">
            تعذر الاتصال بقاعدة البيانات — اتأكد إن رابط المشروع والمفتاح صح وإن ملف schema.sql اتنفذ في Supabase.
          </p>
        )}
        <div className="mb-8 flex gap-3">
          {([["orders", "الطلبات"], ["favors", "الهدايا والتوزيعات"], ["products", "المنتجات"]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`border px-6 py-2.5 eyebrow cursor-pointer transition-colors ${tab === id ? "bg-mocha text-cream border-mocha" : "border-border hover:border-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab !== "products" && (
          <>
            <div className="mb-6 flex items-center gap-3 text-sm">
              <span className="eyebrow text-muted-foreground">الحالة:</span>
              {["all", ...statuses].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`border px-4 py-1.5 text-xs cursor-pointer transition-colors ${statusFilter === s ? "bg-mocha text-cream border-mocha" : "border-border hover:border-foreground"}`}
                >
                  {s === "all" ? "الكل" : statusLabel[s]}
                </button>
              ))}
            </div>
            {orders === null ? (
              <p className="text-sm text-muted-foreground">بيحمّل...</p>
            ) : shownOrders.length === 0 ? (
              <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">مفيش طلبات هنا لسه.</p>
            ) : (
              <div className="space-y-4">
                {shownOrders.map((o) => (
                  <article key={o.id} className="border border-border bg-card p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="eyebrow text-gold">{sourceLabel[o.source] ?? o.source}</span>
                        <span className="text-muted-foreground">{new Date(o.created_at).toLocaleString("en-EG")}</span>
                      </div>
                      <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)} className="border border-border bg-background px-3 py-1.5 text-xs cursor-pointer" aria-label="حالة الطلب">
                        {statuses.map((s) => (
                          <option key={s} value={s}>{statusLabel[s]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="eyebrow text-muted-foreground mb-2">العميل</p>
                        <dl className="space-y-1 text-sm">
                          {Object.entries(o.customer ?? {}).map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <dt className="text-muted-foreground">{keyLabel[k] ?? k}:</dt>
                              <dd>{String(v)}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div>
                        <p className="eyebrow text-muted-foreground mb-2">التفاصيل</p>
                        {o.items?.length > 0 ? (
                          <ul className="space-y-1 text-sm">
                            {o.items.map((it, k) => (
                              <li key={k}>{it.name} × {it.qty} = {it.price} جنيه</li>
                            ))}
                          </ul>
                        ) : null}
                        {o.details && (
                          <dl className="mt-2 space-y-1 text-sm">
                            {Object.entries(o.details).map(([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <dt className="text-muted-foreground">{keyLabel[k] ?? k}:</dt>
                                <dd>{String(v)}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {o.subtotal > 0 && <p className="mt-2 text-sm">الإجمالي: {o.subtotal} جنيه (بدون الشحن)</p>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "products" && (
          <>
            <button
              type="button"
              onClick={() => setEditing({ slug: "", name: "", category: "accessories", price: 0, description: "", badge: "", image_url: "", visible: true })}
              className="mb-6 bg-mocha text-cream px-6 py-3 eyebrow hover:bg-foreground transition-colors cursor-pointer"
            >
              + منتج جديد
            </button>
            {editing && (
              <form onSubmit={saveProduct} className="mb-8 space-y-4 border border-border bg-card p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="اسم المنتج">
                    <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={input} />
                  </Field>
                  <Field label="slug (بالإنجليزي، بدون مسافات)">
                    <input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={input} dir="ltr" />
                  </Field>
                  <Field label="القسم">
                    <select value={editing.category ?? "accessories"} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={input}>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="السعر (جنيه)">
                    <input type="number" min={0} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={input} dir="ltr" />
                  </Field>
                  <Field label="شارة (اختياري: New / Best Seller)">
                    <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className={input} dir="ltr" />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
                    ظاهر في الموقع
                  </label>
                </div>
                <Field label="الوصف">
                  <textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className={`${input} resize-none`} />
                </Field>
                <Field label="الصورة">
                  <div className="flex flex-wrap items-center gap-3">
                    {editing.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editing.image_url} alt="" width={80} height={80} className="h-20 w-20 object-cover border border-border" />
                    ) : null}
                    <label className="cursor-pointer border border-dashed border-border px-4 py-3 text-xs text-muted-foreground hover:border-foreground transition-colors">
                      {uploading ? "بيرفع..." : "ارفع صورة"}
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => onImageFile(e.target.files?.[0])} />
                    </label>
                    <input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="أو الصق رابط صورة" className={`${input} flex-1 min-w-52`} dir="ltr" />
                  </div>
                </Field>
                <div className="flex gap-3">
                  <button type="submit" className="bg-mocha text-cream px-6 py-3 eyebrow hover:bg-foreground transition-colors cursor-pointer">حفظ</button>
                  <button type="button" onClick={() => setEditing(null)} className="border border-border px-6 py-3 eyebrow hover:border-foreground transition-colors cursor-pointer">إلغاء</button>
                </div>
              </form>
            )}
            {rows === null ? (
              <p className="text-sm text-muted-foreground">بيحمّل...</p>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {rows.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 py-3">
                    {r.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image_url} alt="" width={56} height={56} className="h-14 w-14 object-cover border border-border" />
                    ) : (
                      <span className="grid h-14 w-14 place-items-center border border-border text-xs text-muted-foreground">لا صورة</span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">{r.slug} · {r.category} · {r.price} EGP{r.visible ? "" : " · مخفي"}</p>
                    </div>
                    <button type="button" onClick={() => setEditing(r)} className="border border-border px-4 py-2 text-xs hover:border-foreground transition-colors cursor-pointer">تعديل</button>
                    <button type="button" onClick={() => removeProduct(r.id, r.name)} className="border border-border px-4 py-2 text-xs text-destructive hover:border-destructive transition-colors cursor-pointer">حذف</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
