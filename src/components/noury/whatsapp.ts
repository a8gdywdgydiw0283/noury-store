import type { CartLine } from "./store";
import { getProduct } from "./data";

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
      const product = getProduct(line.slug);
      if (!product) return null;
      const lineTotal = product.price * line.qty;
      return `• ${product.name} × ${line.qty} = ${egp(lineTotal)}`;
    })
    .filter((l): l is string => Boolean(l));

  return [
    "🛍️ *طلب جديد من موقع Noury*",
    "",
    "━━━━━ بيانات العميل ━━━━━",
    `👤 الاسم: ${customer.name}`,
    `📞 رقم الموبايل: ${customer.phone}`,
    `📱 الرقم البديل: ${customer.altPhone}`,
    `📍 المحافظة: ${customer.governorate}`,
    `🏠 العنوان بالتفصيل: ${customer.address}`,
    "",
    "━━━━━ تفاصيل الطلب ━━━━━",
    ...lines,
    "",
    "الشحن: يتحدد مع الأونر 📞",
    `*الإجمالي (بدون الشحن): ${egp(subtotal)}*`,
    "",
    "شكرًا لتعاملكم مع Noury 💛",
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
    "🎁 *طلب هدية مخصصة من Noury*",
    "",
    "━━━━━ بيانات العميل ━━━━━",
    `👤 الاسم: ${gift.name}`,
    `📞 رقم الموبايل: ${gift.phone}`,
    `🏠 العنوان بالتفصيل: ${gift.address}`,
    "",
    "━━━━━ تفاصيل الهدية ━━━━━",
    `🎀 الهدية لمين: ${gift.recipient}`,
    `📝 تفاصيل الهدية: ${gift.details}`,
    "",
    "الشحن بيتحدد مع الأونر 📞",
    "",
    "شكرًا لتعاملكم مع Noury 💛",
  ].join("\n");
}
