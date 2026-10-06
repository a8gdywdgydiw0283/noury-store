import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { ImagePlus, MessageCircle } from "lucide-react";
import { buildBridalFavorsMessage, openWhatsApp, WHATSAPP_DISPLAY } from "./whatsapp";

type BridalFormData = {
  name: string;
  governorate: string;
  address: string;
  phone: string;
  altPhone: string;
  groomName: string;
  brideName: string;
  cardPhrase: string;
  eventDate: string;
};

type BridalErrors = Partial<Record<"name" | "governorate" | "address" | "phone" | "altPhone" | "groomName" | "brideName" | "eventDate", string>>;

const empty: BridalFormData = {
  name: "",
  governorate: "",
  address: "",
  phone: "",
  altPhone: "",
  groomName: "",
  brideName: "",
  cardPhrase: "",
  eventDate: "",
};

export function BridalFavorsForm() {
  const [form, setForm] = useState<BridalFormData>(empty);
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<BridalErrors>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof BridalFormData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPhotosChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    setPhotos(files);
  }

  function validate(): BridalErrors {
    const e: BridalErrors = {};
    const clean = (v: string) => v.replace(/[\s-]/g, "");
    const phoneRe = /^01[0125][0-9]{8}$/;
    if (form.name.trim().length < 2) e.name = "من فضلك اكتب الاسم";
    if (!phoneRe.test(clean(form.phone))) e.phone = "من فضلك اكتب رقم موبايل صحيح (11 رقم يبدأ بـ 01)";
    if (!phoneRe.test(clean(form.altPhone))) e.altPhone = "من فضلك اكتب رقم بديل صحيح (11 رقم يبدأ بـ 01)";
    if (!form.governorate.trim()) e.governorate = "من فضلك اكتب المحافظة";
    if (form.address.trim().length < 10) e.address = "من فضلك اكتب العنوان بالتفصيل بالكامل";
    if (form.groomName.trim().length < 2) e.groomName = "من فضلك اكتب اسم العريس";
    if (form.brideName.trim().length < 2) e.brideName = "من فضلك اكتب اسم العروسة";
    if (!form.eventDate) e.eventDate = "من فضلك اختار التاريخ";
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
    openWhatsApp(buildBridalFavorsMessage({ ...form, photosCount: photos.length }));
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
          فتحنالك واتساب على الرقم {WHATSAPP_DISPLAY} بتفاصيل طلب التوزيعات. اضغط «إرسال» عشان توصلنا
          {photos.length > 0 && (
            <>
              ، وبعدها <span className="text-foreground">ابعت الصور ({photos.length}) في نفس الشات</span>
            </>
          )}
          ، وهنتواصل معاك لتأكيد الشحن والسعر.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setPhotos([]);
          }}
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
          <label htmlFor="bridal-name" className="eyebrow text-muted-foreground">الاسم الكامل</label>
          <input id="bridal-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسمك" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="bridal-phone" className="eyebrow text-muted-foreground">رقم الموبايل</label>
            <input id="bridal-phone" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="bridal-alt" className="eyebrow text-muted-foreground">رقم بديل</label>
            <input id="bridal-alt" inputMode="numeric" value={form.altPhone} onChange={(e) => set("altPhone", e.target.value)} className={`${field} mt-2`} placeholder="01xxxxxxxxx" />
            {errors.altPhone && <p className="mt-1 text-xs text-destructive">{errors.altPhone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="bridal-gov" className="eyebrow text-muted-foreground">المحافظة</label>
          <input id="bridal-gov" value={form.governorate} onChange={(e) => set("governorate", e.target.value)} className={`${field} mt-2`} placeholder="مثال: القاهرة" />
          {errors.governorate && <p className="mt-1 text-xs text-destructive">{errors.governorate}</p>}
        </div>
        <div>
          <label htmlFor="bridal-address" className="eyebrow text-muted-foreground">العنوان بالتفصيل</label>
          <textarea
            id="bridal-address"
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
            <label htmlFor="bridal-groom" className="eyebrow text-muted-foreground">اسم العريس</label>
            <input id="bridal-groom" value={form.groomName} onChange={(e) => set("groomName", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسم العريس" />
            {errors.groomName && <p className="mt-1 text-xs text-destructive">{errors.groomName}</p>}
          </div>
          <div>
            <label htmlFor="bridal-bride" className="eyebrow text-muted-foreground">اسم العروسة</label>
            <input id="bridal-bride" value={form.brideName} onChange={(e) => set("brideName", e.target.value)} className={`${field} mt-2`} placeholder="اكتب اسم العروسة" />
            {errors.brideName && <p className="mt-1 text-xs text-destructive">{errors.brideName}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="bridal-phrase" className="eyebrow text-muted-foreground">الجملة على الكارت (اختياري)</label>
          <textarea
            id="bridal-phrase"
            rows={2}
            value={form.cardPhrase}
            onChange={(e) => set("cardPhrase", e.target.value)}
            className={`${field} mt-2 resize-none`}
            placeholder="اكتب الجملة اللي حابب تظهر على الكارت — أو سيبها فاضية والأونر تكتبها"
          />
        </div>
        <div>
          <label htmlFor="bridal-date" className="eyebrow text-muted-foreground">التاريخ</label>
          <input id="bridal-date" type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className={`${field} mt-2`} />
          {errors.eventDate && <p className="mt-1 text-xs text-destructive">{errors.eventDate}</p>}
        </div>
        <div>
          <label htmlFor="bridal-photos" className="eyebrow text-muted-foreground">صوركم على التوزيعات (اختياري)</label>
          <label
            htmlFor="bridal-photos"
            className="mt-2 flex cursor-pointer items-center justify-center gap-3 border border-dashed border-border px-4 py-6 text-sm text-muted-foreground hover:border-foreground transition-colors"
          >
            <ImagePlus size={18} strokeWidth={1.25} />
            {photos.length > 0 ? `تم اختيار ${photos.length} ${photos.length === 1 ? "صورة" : "صور"}` : "اضغط لاختيار الصور من جهازك"}
          </label>
          <input id="bridal-photos" type="file" accept="image/*" multiple onChange={onPhotosChange} className="sr-only" />
          {photos.length > 0 && (
            <ul className="mt-2 space-y-1">
              {photos.map((f, k) => (
                <li key={k} className="text-xs text-muted-foreground">📷 {f.name}</li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            ملحوظة: بعد ما تفتح الواتساب وتضغط إرسال، ابعت الصور دي في نفس الشات عشان توصلنا مع الطلب.
          </p>
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
