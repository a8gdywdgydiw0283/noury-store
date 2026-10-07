import type { CartLine } from "./store";
import { findProduct } from "@/lib/catalog";

/** Store WhatsApp number: 01069313045 -> international format for wa.me */
export const WHATSAPP_NUMBER = "201069313045";
export const WHATSAPP_DISPLAY = "01069313045";

export type CustomerInfo = {
  name: string;
  governorate: string;
  address: string;
  phone: string;
  altPhone: string;
};

function egp(value: number): string {
  return `${value.toLocaleString("en-EG")} جنيه`;
}

export function buildOrderMessage(cart: CartLine[], customer: CustomerInfo, subtotal: number): string {
  const lines = cart
    .map((line) => {
      const product = findProduct(line.slug);
      if (!product) return null;
      const lineTotal = product.price * line.qty;
      return `• ${product.name} × ${line.qty} = ${egp(lineTotal)}`;
    })
    .filter((l): l is string => Boolean(l));

  return [
    "*طلب جديد من Noury*",
    "أهلاً بيك، وطلبك وصلنا خلاص!",
    "",
    "━━━━━ بيانات الشحن ━━━━━",
    `الاسم: ${customer.name}`,
    `رقم الموبايل: ${customer.phone}`,
    `الرقم البديل: ${customer.altPhone}`,
    `المحافظة: ${customer.governorate}`,
    `العنوان بالتفصيل: ${customer.address}`,
    "",
    "━━━━━ تفاصيل الطلب ━━━━━",
    ...lines,
    "",
    "ملحوظة: الشحن بيتحدد مع الأونر",
    `*الإجمالي (بدون الشحن): ${egp(subtotal)}*`,
    "",
    "شكرًا لثقتك في Noury! منورنا، وهنأكد معاك كل التفاصيل قريب.",
    "Noury | نُورِى",
  ].join("\n");
}

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export type GiftRequest = {
  name: string;
  phone: string;
  address: string;
  recipient: string;
  details: string;
};

export function buildGiftMessage(gift: GiftRequest): string {
  return [
    "*طلب هدية مخصصة - Noury*",
    "أهلاً بيك، وطلبك وصلنا خلاص!",
    "",
    "━━━━━ بيانات العميل ━━━━━",
    `الاسم: ${gift.name}`,
    `رقم الموبايل: ${gift.phone}`,
    `العنوان بالتفصيل: ${gift.address}`,
    "",
    "━━━━━ تفاصيل الهدية ━━━━━",
    `الهدية لمين: ${gift.recipient}`,
    `تفاصيل الهدية: ${gift.details}`,
    "",
    "ملحوظة: الشحن بيتحدد مع الأونر",
    "",
    "شكرًا لثقتك في Noury! منورنا، وهنأكد معاك كل التفاصيل قريب.",
    "Noury | نُورِى",
  ].join("\n");
}

export type BabyFavorsRequest = {
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

export function buildBabyFavorsMessage(req: BabyFavorsRequest): string {
  return [
    "*طلب توزيعات مواليد - Noury*",
    "أهلاً بيك، وطلبك وصلنا خلاص!",
    "",
    "━━━━━ بيانات الشحن ━━━━━",
    `الاسم: ${req.name}`,
    `رقم الموبايل: ${req.phone}`,
    `الرقم البديل: ${req.altPhone}`,
    `المحافظة: ${req.governorate}`,
    `العنوان بالتفصيل: ${req.address}`,
    "",
    "━━━━━ تفاصيل التوزيعات ━━━━━",
    `اسم البيبي: ${req.babyName}`,
    `العدد: ${req.quantity}`,
    `تاريخ الولادة: ${req.birthDate}`,
    `الإضافة: ${req.addition}`,
    "",
    "ملحوظة: الشحن بيتحدد مع الأونر",
    "",
    "شكرًا لثقتك في Noury! منورنا، وهنأكد معاك كل التفاصيل قريب.",
    "Noury | نُورِى",
  ].join("\n");
}

export type BridalFavorsRequest = {
  name: string;
  governorate: string;
  address: string;
  phone: string;
  altPhone: string;
  groomName: string;
  brideName: string;
  cardPhrase: string;
  eventDate: string;
  photosCount: number;
};

export function buildBridalFavorsMessage(req: BridalFavorsRequest): string {
  return [
    "*طلب توزيعات عرائس - Noury*",
    "أهلاً بيك، وطلبك وصلنا خلاص!",
    "",
    "━━━━━ بيانات الشحن ━━━━━",
    `الاسم: ${req.name}`,
    `رقم الموبايل: ${req.phone}`,
    `الرقم البديل: ${req.altPhone}`,
    `المحافظة: ${req.governorate}`,
    `العنوان بالتفصيل: ${req.address}`,
    "",
    "━━━━━ تفاصيل التوزيعات ━━━━━",
    `اسم العريس: ${req.groomName}`,
    `اسم العروسة: ${req.brideName}`,
    `الجملة على الكارت: ${req.cardPhrase.trim() ? req.cardPhrase : "يترك للأونر"}`,
    `التاريخ: ${req.eventDate}`,
    req.photosCount > 0
      ? `صور مرفقة (${req.photosCount}) - العميل هيبعتها في الشات`
      : "بدون صور مرفقة",
    "",
    "ملحوظة: الشحن بيتحدد مع الأونر",
    "",
    "شكرًا لثقتك في Noury! منورنا، وهنأكد معاك كل التفاصيل قريب.",
    "Noury | نُورِى",
  ].join("\n");
}
