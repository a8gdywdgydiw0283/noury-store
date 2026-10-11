import { useMemo, useState } from "react";
import type { OrderRow } from "@/lib/orders";
import { summarizeCustomers } from "@/lib/erp";
import { fmtDate, inputCls, SectionTitle, sourceLabel } from "./ui";

export function CustomersTab({ orders }: { orders: OrderRow[] }) {
  const [q, setQ] = useState("");
  const customers = useMemo(() => summarizeCustomers(orders), [orders]);
  const term = q.trim();
  const shown = term
    ? customers.filter((c) => `${c.name} ${c.phone} ${c.governorate}`.includes(term))
    : customers;

  const totalSpent = customers.reduce((s, c) => s + c.spent, 0);

  return (
    <div>
      <SectionTitle eyebrow={`${customers.length} عميل · إجمالي مشتريات ${totalSpent.toLocaleString("en-EG")} ج`} title="العملاء" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="دوّر بالاسم أو الموبايل أو المحافظة..."
        className={`${inputCls} mb-6 max-w-md`}
      />
      {shown.length === 0 ? (
        <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          مفيش عملاء لسه — أول ما ييجي طلب هيظهر هنا ملف العميل.
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
                <p>{c.orders} {c.orders === 1 ? "طلب" : "طلبات"}</p>
                <p className="mt-1 text-xs text-muted-foreground">آخر طلب: {fmtDate(c.lastOrder)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.sources.map((s) => (
                  <span key={s} className="border border-border px-2.5 py-1 text-xs">{sourceLabel[s] ?? s}</span>
                ))}
              </div>
              <p className="font-serif text-2xl">{c.spent.toLocaleString("en-EG")} ج</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
