import type { ReactNode } from "react";

export const inputCls =
  "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors";

export const btnPrimary =
  "bg-mocha text-cream px-6 py-3 eyebrow hover:bg-foreground transition-colors cursor-pointer";

export const btnGhost =
  "border border-border px-4 py-2 text-xs hover:border-foreground transition-colors cursor-pointer";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="border border-border bg-card p-6">{children}</div>;
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="eyebrow text-muted-foreground">{eyebrow}</p>
      <h2 className="font-serif text-3xl mt-2">{title}</h2>
    </div>
  );
}

export const statusLabel: Record<string, string> = {
  new: "جديد",
  confirmed: "تم التأكيد",
  shipped: "اتشحن",
  cancelled: "ملغي",
};

export const sourceLabel: Record<string, string> = {
  checkout: "سلة",
  gift: "هدية",
  baby: "مواليد",
  bridal: "عرايس",
};

export const keyLabel: Record<string, string> = {
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

export function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-EG", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
