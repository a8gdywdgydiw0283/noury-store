import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";

export type Lang = "ar" | "en";
const KEY = "noury.admin.lang.v1";

const ar = {
  pageTitle: "الإدارة — Noury",
  loginTitle: "الإدارة",
  loginSub: "لوحة تحكم المتجر — للمدير فقط.",
  password: "كلمة السر",
  passwordPh: "اكتب كلمة السر",
  loginBtn: "دخول",
  wrongPass: "كلمة السر غلط",
  adminTitle: "لوحة الإدارة",
  logout: "خروج",
  tab_dashboard: "لوحة القيادة",
  tab_orders: "الطلبات",
  tab_favors: "الهدايا والتوزيعات",
  tab_customers: "العملاء",
  tab_products: "المنتجات والمخزون",
  tab_categories: "الأقسام",
  tab_finance: "المالية",
  envWarn: "Supabase غير مربوط — ضيف المتغيرات في ملف .env (ولو على Vercel ضيفهم في Environment Variables).",
  dbError: "تعذر الاتصال بقاعدة البيانات — اتأكد إن رابط المشروع والمفتاح صح وإن ملف schema.sql اتنفذ في Supabase.",
  dashEyebrow: "نظرة عامة",
  dashTitle: "لوحة القيادة",
  kpiToday: "إيراد اليوم",
  kpiMonth: "إيراد الشهر",
  kpiNew: "طلبات جديدة",
  kpiCustomers: "العملاء",
  ordersWord: "طلبات",
  needConfirm: "محتاجة تأكيد",
  withOrders: "عميل مسجل بطلب",
  chartTitle: "الإيراد — آخر 14 يوم",
  revenue: "الإيراد",
  recentTitle: "أحدث الطلبات",
  noOrders: "مفيش طلبات لسه.",
  egp: "ج",
  ordersEyebrowA: "طلبات السلة",
  giftCount: "طلبات الهدايا والتوزيعات: {n}",
  ordersTitle: "الطلبات",
  statusFilter: "الحالة:",
  all: "الكل",
  noOrdersHere: "مفيش طلبات هنا لسه.",
  statusAria: "حالة الطلب",
  customer: "العميل",
  items: "الأصناف",
  total: "الإجمالي:",
  noShipping: "بدون الشحن",
  updFail: "فشل التحديث",
  updOk: "اتحدثت الحالة",
  favorsEyebrow: "هدايا ومواليد وعرايس",
  favorsTitle: "الهدايا والتوزيعات",
  details: "التفاصيل",
  custEyebrow: "{n} عميل · إجمالي مشتريات {t} ج",
  custTitle: "العملاء",
  custSearch: "دوّر بالاسم أو الموبايل أو المحافظة...",
  noCustomers: "مفيش عملاء لسه — أول ما ييجي طلب هيظهر هنا ملف العميل.",
  order_one: "طلب",
  order_many: "طلبات",
  lastOrder: "آخر طلب:",
  nameSlugReq: "الاسم والـ slug مطلوبين",
  savedProduct: "اتحفظ المنتج",
  saveFail: "فشل الحفظ",
  imgUploaded: "اترفعت الصورة",
  imgFail: "فشل رفع الصورة",
  delConfirm: "تحذف \"{name}\"؟",
  delProduct: "اتحذف المنتج",
  delFail: "فشل الحذف",
  prodEyebrow: "المخزون بينقص تلقائيًا مع تأكيد الطلبات",
  prodTitle: "المنتجات",
  addProduct: "+ منتج جديد",
  fName: "اسم المنتج",
  fSlug: "slug (بالإنجليزي، بدون مسافات)",
  fCategory: "القسم",
  fPrice: "السعر (جنيه)",
  fStock: "الكمية بالمخزون",
  fLowAt: "تنبيه عند الوصول لـ",
  fBadge: "شارة (اختياري: New / Best Seller)",
  fVisible: "ظاهر في الموقع",
  fDesc: "الوصف",
  fImage: "الصورة",
  uploading: "بيرفع...",
  uploadImg: "ارفع صورة",
  imgUrlPh: "أو الصق رابط صورة",
  save: "حفظ",
  cancel: "إلغاء",
  loading: "بيحمّل...",
  noImage: "لا صورة",
  stockLbl: "مخزون:",
  hiddenLbl: "مخفي",
  customLbl: "مخصص",
  edit: "تعديل",
  del: "حذف",
  catSaved: "اتحفظ القسم",
  catEyebrow: "الأقسام المخصصة (هدايا/عرايس/مواليد) بتعرض فورم طلب",
  catTitle: "الأقسام",
  addCat: "+ قسم جديد",
  cName: "اسم القسم",
  cTagline: "سطر تعريفي",
  cOrder: "الترتيب",
  customChk: "قسم مخصص (فورم طلب بدل منتجات)",
  expCatGoods: "بضاعة",
  expCatShip: "شحن",
  expCatPack: "تغليف",
  expCatAds: "إعلانات",
  expCatOther: "أخرى",
  expNameReq: "اكتب اسم المصروف",
  expSaved: "اتحفظ المصروف",
  expDelConfirm: "تحذف المصروف ده؟",
  expDeleted: "اتحذف",
  finEyebrow: "الإيراد من الطلبات المؤكدة والمشحونة",
  finTitle: "المالية",
  finMonthRev: "إيراد الشهر",
  finMonthExp: "مصاريف الشهر",
  finMonthNet: "صافي ربح الشهر",
  finTotalNet: "صافي الربح الكلي",
  addExp: "+ مصروف جديد",
  eName: "اسم المصروف",
  eAmount: "المبلغ (جنيه)",
  eCat: "التصنيف",
  eDate: "التاريخ",
  eNotes: "ملاحظات (اختياري)",
  noExp: "مفيش مصاريف متسجلة لسه.",
} as const;

export type TKey = keyof typeof ar;

const en: Record<TKey, string> = {
  pageTitle: "Admin — Noury",
  loginTitle: "Admin",
  loginSub: "Store control panel — managers only.",
  password: "Password",
  passwordPh: "Enter password",
  loginBtn: "Sign in",
  wrongPass: "Wrong password",
  adminTitle: "Admin Panel",
  logout: "Sign out",
  tab_dashboard: "Dashboard",
  tab_orders: "Orders",
  tab_favors: "Gifts & Favors",
  tab_customers: "Customers",
  tab_products: "Products & Stock",
  tab_categories: "Categories",
  tab_finance: "Finance",
  envWarn: "Supabase is not connected — add the variables in .env (or in Environment Variables on Vercel).",
  dbError: "Could not reach the database — check the project URL, key, and that schema.sql was executed in Supabase.",
  dashEyebrow: "Overview",
  dashTitle: "Dashboard",
  kpiToday: "Today's revenue",
  kpiMonth: "Month revenue",
  kpiNew: "New orders",
  kpiCustomers: "Customers",
  ordersWord: "orders",
  needConfirm: "need confirmation",
  withOrders: "customers with orders",
  chartTitle: "Revenue — last 14 days",
  revenue: "Revenue",
  recentTitle: "Latest orders",
  noOrders: "No orders yet.",
  egp: "EGP",
  ordersEyebrowA: "Cart orders",
  giftCount: "Gift & favor requests: {n}",
  ordersTitle: "Orders",
  statusFilter: "Status:",
  all: "All",
  noOrdersHere: "No orders here yet.",
  statusAria: "Order status",
  customer: "Customer",
  items: "Items",
  total: "Total:",
  noShipping: "excl. shipping",
  updFail: "Update failed",
  updOk: "Status updated",
  favorsEyebrow: "Gifts, newborn & bridal",
  favorsTitle: "Gifts & Favors",
  details: "Details",
  custEyebrow: "{n} customers · total spent {t} EGP",
  custTitle: "Customers",
  custSearch: "Search by name, phone, or city...",
  noCustomers: "No customers yet — a profile appears here with the first order.",
  order_one: "order",
  order_many: "orders",
  lastOrder: "Last order:",
  nameSlugReq: "Name and slug are required",
  savedProduct: "Product saved",
  saveFail: "Save failed",
  imgUploaded: "Image uploaded",
  imgFail: "Image upload failed",
  delConfirm: "Delete \"{name}\"?",
  delProduct: "Product deleted",
  delFail: "Delete failed",
  prodEyebrow: "Stock decreases automatically on confirmation",
  prodTitle: "Products",
  addProduct: "+ New product",
  fName: "Product name",
  fSlug: "slug (English, no spaces)",
  fCategory: "Category",
  fPrice: "Price (EGP)",
  fStock: "Stock quantity",
  fLowAt: "Alert below",
  fBadge: "Badge (optional: New / Best Seller)",
  fVisible: "Visible on site",
  fDesc: "Description",
  fImage: "Image",
  uploading: "Uploading...",
  uploadImg: "Upload image",
  imgUrlPh: "Or paste image URL",
  save: "Save",
  cancel: "Cancel",
  loading: "Loading...",
  noImage: "No image",
  stockLbl: "Stock:",
  hiddenLbl: "Hidden",
  customLbl: "Custom",
  edit: "Edit",
  del: "Delete",
  catSaved: "Category saved",
  catEyebrow: "Custom sections (gifts/bridal/baby) show an order form",
  catTitle: "Categories",
  addCat: "+ New category",
  cName: "Category name",
  cTagline: "Tagline",
  cOrder: "Order",
  customChk: "Custom section (order form instead of products)",
  expCatGoods: "Stock",
  expCatShip: "Shipping",
  expCatPack: "Packaging",
  expCatAds: "Ads",
  expCatOther: "Other",
  expNameReq: "Enter expense name",
  expSaved: "Expense saved",
  expDelConfirm: "Delete this expense?",
  expDeleted: "Deleted",
  finEyebrow: "Revenue from confirmed & shipped orders",
  finTitle: "Finance",
  finMonthRev: "Month revenue",
  finMonthExp: "Month expenses",
  finMonthNet: "Month net profit",
  finTotalNet: "Total net profit",
  addExp: "+ New expense",
  eName: "Expense name",
  eAmount: "Amount (EGP)",
  eCat: "Category",
  eDate: "Date",
  eNotes: "Notes (optional)",
  noExp: "No expenses recorded yet.",
};

const dicts: Record<Lang, Record<TKey, string>> = { ar: ar as unknown as Record<TKey, string>, en };

const statuses: Record<Lang, Record<string, string>> = {
  ar: { new: "جديد", confirmed: "تم التأكيد", shipped: "اتشحن", cancelled: "ملغي" },
  en: { new: "New", confirmed: "Confirmed", shipped: "Shipped", cancelled: "Cancelled" },
};

const sources: Record<Lang, Record<string, string>> = {
  ar: { checkout: "سلة", gift: "هدية", baby: "مواليد", bridal: "عرايس" },
  en: { checkout: "Cart", gift: "Gift", baby: "Newborn", bridal: "Bridal" },
};

const fields: Record<Lang, Record<string, string>> = {
  ar: {
    name: "الاسم", phone: "الموبايل", altPhone: "الرقم البديل", governorate: "المحافظة",
    address: "العنوان", recipient: "الهدية لمين", details: "التفاصيل", babyName: "اسم البيبي",
    quantity: "العدد", birthDate: "تاريخ الولادة", addition: "الإضافة", groomName: "اسم العريس",
    brideName: "اسم العروسة", cardPhrase: "الجملة على الكارت", eventDate: "التاريخ", photosCount: "عدد الصور",
  },
  en: {
    name: "Name", phone: "Phone", altPhone: "Alt phone", governorate: "City",
    address: "Address", recipient: "Gift for", details: "Details", babyName: "Baby name",
    quantity: "Quantity", birthDate: "Birth date", addition: "Add-on", groomName: "Groom",
    brideName: "Bride", cardPhrase: "Card message", eventDate: "Date", photosCount: "Photos",
  },
};

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  trStatus: (s: string) => string;
  trSource: (s: string) => string;
  trField: (k: string) => string;
};

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    return window.localStorage.getItem(KEY) === "en" ? "en" : "ar";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: TKey) => dicts[lang][key] ?? ar[key];
  const trStatus = (s: string) => statuses[lang][s] ?? s;
  const trSource = (s: string) => sources[lang][s] ?? s;
  const trField = (k: string) => fields[lang][k] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t, trStatus, trSource, trField }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

export function fillTpl(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, String(v));
  return out;
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="flex items-center gap-2 border border-cream/30 px-4 py-2 text-xs hover:border-cream transition-colors cursor-pointer"
      aria-label="Switch language"
    >
      <Languages size={14} strokeWidth={1.5} />
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}
