import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHero } from "@/components/noury/PageHero";
import { getProduct } from "@/components/noury/data";
import { useStore } from "@/components/noury/store";
import { buildOrderMessage, openWhatsApp, WHATSAPP_DISPLAY } from "@/components/noury/whatsapp";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "إتمام الطلب — Noury" }],
  }),
  component: Checkout,
});

const FREE_SHIPPING = 999;

type FieldErrors = {
  name?: string;
  governorate?: string;
  address?: string;
  phone?: string;
  altPhone?: string;
};

function Checkout() {
  const { cart, cartTotal, clearCart, formatPrice } = useStore();
  const [form, setForm] = useState({ name: "", governorate: "", address: "", phone: "", altPhone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  const lines = cart
    .map((l) => ({ line: l, product: getProduct(l.slug) }))
    .filter((x): x is { line: typeof x.line; product: NonNullable<typeof x.product> } => Boolean(x.product));

  const shipping = cartTotal >= FREE_SHIPPING || cartTotal === 0 ? 0 : 60;
  const total = cartTotal + shipping;

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    const phoneRe = /^01[0125][0-9]{8}$/;
    const clean = (v: string) => v.replace(/[\s-]/g, "");
    if (form.name.trim().length < 2) e.name = "من فضلك اكتب الاسم";
    if (!form.governorate.trim()) e.governorate = "من فضلك اكتب المحافظة";
    if (form.address.trim().length < 10) e.address = "من فضلك اكتب العنوان بالتفصيل بالكامل";
    if (!phoneRe.test(clean(form.phone))) e.phone = "من فضلك اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)";
    if (!phoneRe.test(clean(form.altPhone))) e.altPhone = "من فضلك اكتب رقم بديل صحيح (11 رقم يبدأ بـ 01)";
    return e;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("من فضلك اكمل بيانات الطلب");
      return;
    }
    const message = buildOrderMessage(cart, form, { subtotal: cartTotal, shipping, total });
    openWhatsApp(message);
    toast.success("تم فتح واتساب لإرسال الطلب");
    clearCart();
    setSent(true);
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors text-right";

  if (lines.length === 0 && !sent) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="إتمام الطلب" subtitle="خطوة واحدة تفصلك عن إتمام طلبك." breadcrumb={[{ label: "الرئيسية", to: "/" }, { label: "إتمام الطلب" }]} />
        <section className="mx-auto max-w-3xl px-6 py-20 text-center" dir="rtl">
          <ShoppingBag size={30} strokeWidth={1} className="mx-auto text-gold" />
          <h2 className="mt-5 font-serif text-3xl">سلة المشتريات فاضية</h2>
          <p className="mt-3 text-sm text-muted-foreground">اختار المنتجات اللي تحبها الأول وبعدين كمّل الطلب.</p>
          <Link to="/collections" className="mt-8 inline-flex items-center gap-4 bg-mocha text-cream px-6 py-3 eyebrow">
            تسوق الآن <ArrowRight size={14} strokeWidth={1.25} />
          </Link>
        </section>
      </>
    );
  }

  if (sent) {
    return (
      <>
        <PageHero eyebrow="تم" title="تم تجهيز طلبك" breadcrumb={[{ label: "الرئيسية", to: "/" }, { label: "إتمام الطلب" }]} />
        <section className="mx-auto max-w-3xl px-6 py-20 text-center" dir="rtl">
          <MessageCircle size={32} strokeWidth={1} className="mx-auto text-gold" />
          <h2 className="mt-5 font-serif text-3xl">اضغط إرسال في واتساب</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            فتحنالك واتساب على الرقم {WHATSAPP_DISPLAY} وكل تفاصيل طلبك جاهزة. اضغط «إرسال» عشان يوصلنا الطلب.
            لو واتساب ما فتحش، استخدم الزر تحت.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center gap-4 bg-mocha text-cream px-6 py-3 eyebrow">
            العودة للرئيسية <ArrowRight size={14} strokeWidth={1.25} />
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="إتمام الطلب"
        subtitle="اكتب بياناتك، وبعدها هيتحوّلك واتساب برسالة فيها كل تفاصيل طلبك."
        breadcrumb={[{ label: "الرئيسية", to: "/" }, { label: "إتمام الطلب" }]}
      />

      <section
        className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]"
        dir="rtl"
        style={{ fontFamily: "'Cairo', var(--font-sans)" }}
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="font-serif text-2xl">بيانات الشحن</h2>

          <div>
            <label htmlFor="co-name" className="eyebrow text-muted-foreground">الاسم الكامل</label>
            <input id="co-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسمك" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="co-phone" className="eyebrow text-muted-foreground">رقم الموبايل</label>
              <input id="co-phone" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="co-alt" className="eyebrow text-muted-foreground">الرقم البديل</label>
              <input id="co-alt" inputMode="numeric" value={form.altPhone} onChange={(e) => set("altPhone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
              {errors.altPhone && <p className="mt-1 text-xs text-destructive">{errors.altPhone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="co-gov" className="eyebrow text-muted-foreground">المحافظة</label>
            <input id="co-gov" value={form.governorate} onChange={(e) => set("governorate", e.target.value)} className={`${field} mt-2`} placeholder="مثال: القاهرة" />
            {errors.governorate && <p className="mt-1 text-xs text-destructive">{errors.governorate}</p>}
          </div>

          <div>
            <label htmlFor="co-address" className="eyebrow text-muted-foreground">العنوان بالتفصيل</label>
            <textarea
              id="co-address"
              rows={5}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className={`${field} mt-2 resize-none`}
              placeholder="المدينة / المنطقة، الشارع، رقم العمارة، الدور، رقم الشقة، وأي علامة مميزة"
            />
            {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
          </div>

          <button type="submit" className="w-full bg-mocha text-cream py-4 eyebrow hover:bg-foreground transition-colors cursor-pointer flex items-center justify-center gap-3">
            <MessageCircle size={16} strokeWidth={1.5} /> تأكيد الطلب عبر واتساب
          </button>
          <p className="text-center text-xs text-muted-foreground">
            بالضغط على الزر، هيفتح واتساب على الرقم {WHATSAPP_DISPLAY} برسالة جاهزة فيها كل بياناتك — راجعها واضغط إرسال.
          </p>
        </form>

        <aside className="h-fit border border-border bg-card p-8">
          <h2 className="font-serif text-2xl">ملخص الطلب</h2>
          <div className="mt-6 divide-y divide-border">
            {lines.map(({ line, product }) => (
              <div key={line.slug} className="flex items-center gap-4 py-4">
                <img src={product.image} alt={product.name} width={80} height={100} className="h-16 w-14 object-cover border border-border" />
                <div className="flex-1">
                  <p className="text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">الكمية: {line.qty}</p>
                </div>
                <p className="text-sm whitespace-nowrap">{formatPrice(product.price * line.qty)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">الإجمالي الفرعي</dt>
              <dd>{formatPrice(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">الشحن</dt>
              <dd>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt>الإجمالي</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link to="/cart" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
            تعديل السلة
          </Link>
        </aside>
      </section>
    </>
  );
}
