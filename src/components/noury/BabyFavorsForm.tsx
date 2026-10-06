import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { buildBabyFavorsMessage, openWhatsApp, WHATSAPP_DISPLAY } from "./whatsapp";

type BabyFormData = {
  name: string;
  governorate: string;
  address: string;
  phone: string;
  altPhone: string;
  babyName: string;
  quantity: string;
  birthDate: string;
  addition: string;
};

type BabyErrors = Partial<Record<"name" | "governorate" | "address" | "phone" | "altPhone" | "babyName" | "quantity" | "birthDate", string>>;

const empty: BabyFormData = {
  name: "",
  governorate: "",
  address: "",
  phone: "",
  altPhone: "",
  babyName: "",
  quantity: "",
  birthDate: "",
  addition: "بدون إضافة",
};

const additions = ["كاندي 🍬", "شوكولاتة 🍫", "بدون إضافة"];

export function BabyFavorsForm() {
  const [form, setForm] = useState<BabyFormData>(empty);
  const [errors, setErrors] = useState<BabyErrors>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof BabyFormData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): BabyErrors {
    const e: BabyErrors = {};
    const clean = (v: string) => v.replace(/[\s-]/g, "");
    const phoneRe = /^01[0125][0-9]{8}$/;
    if (form.name.trim().length < 2) e.name = "من فضلك اكتب الاسم";
    if (!phoneRe.test(clean(form.phone))) e.phone = "من فضلك اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)";
    if (!phoneRe.test(clean(form.altPhone))) e.altPhone = "من فضلك اكتب رقم بديل صحيح (11 رقم يبدأ بـ 01)";
    if (!form.governorate.trim()) e.governorate = "من فضلك اكتب المحافظة";
    if (form.address.trim().length < 10) e.address = "من فضلك اكتب العنوان بالتفصيل بالكامل";
    if (form.babyName.trim().length < 2) e.babyName = "من فضلك اكتب اسم البيبي";
    if (!form.quantity.trim() || Number(form.quantity) < 1) e.quantity = "من فضلك اكتب العدد المطلوب";
    if (!form.birthDate) e.birthDate = "من فضلك اختار تاريخ الولادة";
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
    openWhatsApp(buildBabyFavorsMessage(form));
    toast.success("تم فتح واتساب لإرسال طلب التوزيعات");
    setForm(empty);
    setSent(true);
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors text-right";

  if (sent) {
    return (
      <div className="border border-border bg-card px-8 py-14 text-center">
        <MessageCircle size={30} strokeWidth={1} className="mx-auto text-gold" />
        <h3 className="mt-5 font-serif text-2xl">اضغط إرسال في واتساب</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          فتحنالك واتساب على الرقم {WHATSAPP_DISPLAY} بتفاصيل طلب التوزيعات. اضغط «إرسال» عشان توصلنا، وهنتواصل
          معاك لتأكيد الشحن والسعر.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 border border-border px-6 py-3 eyebrow hover:border-foreground transition-colors cursor-pointer"
        >
          طلب توزيعات تاني
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 text-right">
      <div className="space-y-5">
        <h3 className="eyebrow text-foreground">بيانات الشحن</h3>
        <div>
          <label htmlFor="baby-name" className="eyebrow text-muted-foreground">الاسم الكامل</label>
          <input id="baby-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسمك" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="baby-phone" className="eyebrow text-muted-foreground">رقم الموبايل</label>
            <input id="baby-phone" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="baby-alt" className="eyebrow text-muted-foreground">رقم بديل</label>
            <input id="baby-alt" inputMode="numeric" value={form.altPhone} onChange={(e) => set("altPhone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
            {errors.altPhone && <p className="mt-1 text-xs text-destructive">{errors.altPhone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="baby-gov" className="eyebrow text-muted-foreground">المحافظة</label>
          <input id="baby-gov" value={form.governorate} onChange={(e) => set("governorate", e.target.value)} className={`${field} mt-2`} placeholder="مثال: القاهرة" />
          {errors.governorate && <p className="mt-1 text-xs text-destructive">{errors.governorate}</p>}
        </div>
        <div>
          <label htmlFor="baby-address" className="eyebrow text-muted-foreground">العنوان بالتفصيل</label>
          <textarea
            id="baby-address"
            rows={3}
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className={`${field} mt-2 resize-none`}
            placeholder="المحافظة، المدينة/المنطقة، الشارع، رقم العمارة، الدور، الشقة"
          />
          {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="eyebrow text-foreground">تفاصيل التوزيعات</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="baby-babyname" className="eyebrow text-muted-foreground">اسم البيبي</label>
            <input id="baby-babyname" value={form.babyName} onChange={(e) => set("babyName", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسم البيبي" />
            {errors.babyName && <p className="mt-1 text-xs text-destructive">{errors.babyName}</p>}
          </div>
          <div>
            <label htmlFor="baby-qty" className="eyebrow text-muted-foreground">العدد</label>
            <input id="baby-qty" type="number" min={1} inputMode="numeric" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={`${field} mt-2`} placeholder="مثال: 50" />
            {errors.quantity && <p className="mt-1 text-xs text-destructive">{errors.quantity}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="baby-date" className="eyebrow text-muted-foreground">تاريخ الولادة</label>
          <input id="baby-date" type="date" value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} className={`${field} mt-2`} />
          {errors.birthDate && <p className="mt-1 text-xs text-destructive">{errors.birthDate}</p>}
        </div>
        <div>
          <span className="eyebrow text-muted-foreground">الإضافة</span>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {additions.map((opt) => (
              <label
                key={opt}
                className={`cursor-pointer border px-4 py-3 text-sm text-center transition-colors ${
                  form.addition === opt ? "border-foreground bg-card" : "border-border hover:border-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="baby-addition"
                  value={opt}
                  checked={form.addition === opt}
                  onChange={() => set("addition", opt)}
                  className="sr-only"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-mocha text-cream py-4 eyebrow hover:bg-foreground transition-colors cursor-pointer flex items-center justify-center gap-3"
      >
        <MessageCircle size={16} strokeWidth={1.5} /> إرسال طلب التوزيعات على واتساب
      </button>
      <p className="text-center text-xs text-muted-foreground">
        بالضغط على الزر هيفتح واتساب على الرقم {WHATSAPP_DISPLAY} برسالة جاهزة فيها بياناتك وتفاصيل التوزيعات.
      </p>
    </form>
  );
}
