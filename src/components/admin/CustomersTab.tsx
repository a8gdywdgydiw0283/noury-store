import { useMemo, useState } from "react";
import type { OrderRow } from "@/lib/orders";
import { summarizeCustomers } from "@/lib/erp";
import { fmtDate, inputCls, SectionTitle } from "./ui";
import { fillTpl, useLang } from "./lang";

export function CustomersTab({ orders }: { orders: OrderRow[] }) {
  const { t, lang, trSource } = useLang();
  const [q, setQ] = useState("");
  const customers = useMemo(() => summarizeCustomers(orders), [orders]);
  const term = q.trim();
  const shown = term
    ? customers.filter((c) => `${c.name} ${c.phone} ${c.governorate}`.includes(term))
    : customers;

  const totalSpent = customers.reduce((s, c) => s + c.spent, 0);

  return (
    <div>
      <SectionTitle eyebrow={fillTpl(t("custEyebrow"), { n: customers.length, t: totalSpent.toLocaleString("en-EG") })} title={t("custTitle")} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("custSearch")}
        className={`${inputCls} mb-6 max-w-md`}
      />
      {shown.length === 0 ? (
        <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          {t("noCustomers")}
        </p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {shown.map((c) => (
            <div key={c.phone} className="grid gap-3 py-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground" dir="ltr">{c.phone}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.governorate} · {c.address}</p>
              </div>
              <div className="text-sm">
                <p>{c.orders} {c.orders === 1 ? t("order_one") : t("order_many")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("lastOrder")} {fmtDate(c.lastOrder)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.sources.map((s) => (
                  <span key={s} className="border border-border px-2.5 py-1 text-xs">{trSource(s)}</span>
                ))}
              </div>
              <p className="font-serif text-2xl" dir={lang === "ar" ? "rtl" : "ltr"}>{c.spent.toLocaleString("en-EG")} {t("egp")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
