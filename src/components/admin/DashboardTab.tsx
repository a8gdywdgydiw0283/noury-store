import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { OrderRow } from "@/lib/orders";
import { dayKey, monthKey, revenueOf, todayKey } from "@/lib/erp";
import { Card, SectionTitle, sourceLabel, statusLabel } from "./ui";

function last14Days(): string[] {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function DashboardTab({ orders }: { orders: OrderRow[] }) {
  const today = todayKey();
  const month = monthKey();

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => dayKey(o.created_at) === today);
    const monthOrders = orders.filter((o) => o.created_at.slice(0, 7) === month);
    return {
      todayRevenue: revenueOf(todayOrders),
      todayCount: todayOrders.length,
      monthRevenue: revenueOf(monthOrders),
      monthCount: monthOrders.length,
      pending: orders.filter((o) => o.status === "new").length,
      customers: new Set(
        orders.map((o) => String((o.customer as Record<string, string>)?.["phone"] ?? "").trim()).filter(Boolean),
      ).size,
    };
  }, [orders, today, month]);

  const chart = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const o of orders) {
      if (o.status !== "confirmed" && o.status !== "shipped") continue;
      const k = dayKey(o.created_at);
      byDay.set(k, (byDay.get(k) ?? 0) + Number(o.subtotal ?? 0));
    }
    return last14Days().map((d) => ({ day: d.slice(5), revenue: byDay.get(d) ?? 0 }));
  }, [orders]);

  const recent = useMemo(() => orders.slice(0, 5), [orders]);

  const kpis = [
    { label: "إيراد اليوم", value: `${stats.todayRevenue.toLocaleString("en-EG")} ج`, sub: `${stats.todayCount} طلبات` },
    { label: "إيراد الشهر", value: `${stats.monthRevenue.toLocaleString("en-EG")} ج`, sub: `${stats.monthCount} طلبات` },
    { label: "طلبات جديدة", value: String(stats.pending), sub: "محتاجة تأكيد" },
    { label: "العملاء", value: String(stats.customers), sub: "عميل مسجل بطلب" },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="نظرة عامة" title="لوحة القيادة" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <p className="eyebrow text-muted-foreground">{k.label}</p>
            <p className="mt-2 font-serif text-3xl">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p className="eyebrow text-muted-foreground mb-4">الإيراد — آخر 14 يوم</p>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString("en-EG")} ج`, "الإيراد"]} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-mocha)" fill="var(--color-gold)" fillOpacity={0.35} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <p className="eyebrow text-muted-foreground mb-4">أحدث الطلبات</p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">مفيش طلبات لسه.</p>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {recent.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span>{String((o.customer as Record<string, string>)?.["name"] ?? "—")}</span>
                <span className="text-muted-foreground">{sourceLabel[o.source] ?? o.source}</span>
                <span>{Number(o.subtotal ?? 0).toLocaleString("en-EG")} ج</span>
                <span className="eyebrow text-gold">{statusLabel[o.status] ?? o.status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
