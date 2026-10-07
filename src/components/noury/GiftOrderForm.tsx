import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { buildGiftMessage, openWhatsApp, WHATSAPP_DISPLAY } from "./whatsapp";
import { saveFavorRequest } from "@/lib/orders";
import { ThanksPanel } from "./ThanksPanel";

type GiftFormData = {
  name: string;
  phone: string;
  address: string;
  recipient: string;
  details: string;
};

type GiftErrors = Partial<Record<keyof GiftFormData, string>>;

const empty: GiftFormData = { name: "", phone: "", address: "", recipient: "", details: "" };

export function GiftOrderForm() {
  const [form, setForm] = useState<GiftFormData>(empty);
  const [errors, setErrors] = useState<GiftErrors>({});
  const [stage, setStage] = useState<"form" | "thanks" | "sent">("form");

  function set<K extends keyof GiftFormData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): GiftErrors {
    const e: GiftErrors = {};
    const phoneRe = /^01[0125][0-9]{8}$/;
    if (form.name.trim().length < 2) e.name = "من فضلك اكتب الاسم";
    if (!phoneRe.test(form.phone.replace(/[\s-]/g, ""))) e.phone = "من فضلك اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)";
    if (form.address.trim().length < 10) e.address = "من فضلك اكتب العنوان بالتفصيل بالكامل";
    if (form.recipient.trim().length < 2) e.recipient = "الهدية لمين؟ اكتب اسم أو صلة القرابة";
    if (form.details.trim().length < 5) e.details = "اكتب لنا تفاصيل الهدية (المناسبة والميزانية والذوق)";
    return e;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("من فضلك اكمل بيانات الهدية");
      return;
    }
    setStage("thanks");
  }

  function sendViaWhatsApp() {
    void saveFavorRequest(
      "gift",
      { name: form.name, phone: form.phone, address: form.address },
      { recipient: form.recipient, details: form.details },
    );
    openWhatsApp(buildGiftMessage(form));
    toast.success("تم فتح واتساب لإرسال طلب الهدية");
    setForm(empty);
    setStage("sent");
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors text-right";

  if (stage === "thanks") {
    return <ThanksPanel onContinue={sendViaWhatsApp} />;
  }

  if (stage === "sent") {
    return (
      <div className="border border-border bg-card px-8 py-14 text-center">
        <MessageCircle size={30} strokeWidth={1} className="mx-auto text-gold" />
        <h3 className="mt-5 font-serif text-2xl">اضغط إرسال في واتساب</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          فتحنالك واتساب على الرقم {WHATSAPP_DISPLAY} بتفاصيل الهدية. اضغط «إرسال» عشان توصلنا، وهنتواصل معاك
          لتأكيد الشحن والسعر.
        </p>
        <button
          type="button"
          onClick={() => setStage("form")}
          className="mt-6 border border-border px-6 py-3 eyebrow hover:border-foreground transition-colors cursor-pointer"
        >
          طلب هدية تانية
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 text-right">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="gift-name" className="eyebrow text-muted-foreground">الاسم</label>
          <input id="gift-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسمك" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="gift-phone" className="eyebrow text-muted-foreground">رقم الموبايل</label>
          <input id="gift-phone" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="gift-address" className="eyebrow text-muted-foreground">العنوان بالتفصيل</label>
        <textarea
          id="gift-address"
          rows={3}
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          className={`${field} mt-2 resize-none`}
          placeholder="المحافظة، المدينة/المنطقة، الشارع، رقم العمارة، الدور، الشقة"
        />
        {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="gift-recipient" className="eyebrow text-muted-foreground">الهدية لمين؟</label>
        <input id="gift-recipient" value={form.recipient} onChange={(e) => set("recipient", e.target.value)} className={`${field} mt-2`} placeholder="مثال: هدية لعروسة / بيبي شاور / عيد ميلاد طفل" />
        {errors.recipient && <p className="mt-1 text-xs text-destructive">{errors.recipient}</p>}
      </div>

      <div>
        <label htmlFor="gift-details" className="eyebrow text-muted-foreground">تفاصيل الهدية</label>
        <textarea
          id="gift-details"
          rows={4}
          value={form.details}
          onChange={(e) => set("details", e.target.value)}
          className={`${field} mt-2 resize-none`}
          placeholder="المناسبة، الميزانية، عدد التوزيعات، الألوان أو أي تفاصيل تحبها"
        />
        {errors.details && <p className="mt-1 text-xs text-destructive">{errors.details}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-mocha text-cream py-4 eyebrow hover:bg-foreground transition-colors cursor-pointer flex items-center justify-center gap-3"
      >
        <MessageCircle size={16} strokeWidth={1.5} /> إرسال طلب الهدية على واتساب
      </button>
      <p className="text-center text-xs text-muted-foreground">
        بالضغط على الزر هيفتح واتساب على الرقم {WHATSAPP_DISPLAY} برسالة جاهزة فيها بياناتك وتفاصيل الهدية.
      </p>
    </form>
  );
}
