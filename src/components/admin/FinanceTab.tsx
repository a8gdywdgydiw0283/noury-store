import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { OrderRow } from "@/lib/orders";
import {
  deleteExpense,
  fetchExpenses,
  monthKey,
  revenueOf,
  todayKey,
  upsertExpense,
  type ExpenseRow,
} from "@/lib/erp";
import { btnGhost, btnPrimary, Card, Field, inputCls, SectionTitle } from "./ui";

const expenseCats = ["بضاعة", "شحن", "تغليف", "إعلانات", "أخرى"];

export function FinanceTab({ orders }: { orders: OrderRow[] }) {
  const [expenses, setExpenses] = useState<ExpenseRow[] | null>(null);
  const [editing, setEditing] = useState<Partial<ExpenseRow> | null>(null);

  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  const month = monthKey();
  const today = todayKey();

  const finance = useMemo(() => {
    const monthOrders = orders.filter((o) => o.created_at.slice(0, 7) === month);
    const monthRevenue = revenueOf(monthOrders);
    const totalRevenue = revenueOf(orders);
    const all = expenses ?? [];
    const monthExp = all.filter((e) => e.spent_on.slice(0, 7) === month).reduce((s, e) => s + Number(e.amount ?? 0), 0);
    const totalExp = all.reduce((s, e) => s + Number(e.amount ?? 0), 0);
    return { monthRevenue, totalRevenue, monthExp, totalExp };
  }, [orders, expenses, month]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing?.title?.trim()) {
      toast.error("اكتب اسم المصروف");
      return;
    }
    const ok = await upsertExpense({
      ...editing,
      title: editing.title.trim(),
      amount: Number(editing?.amount ?? 0),
      spent_on: editing?.spent_on || today,
    });
    if (ok) {
      toast.success("اتحفظ المصروف");
      setEditing(null);
      fetchExpenses().then(setExpenses);
    } else {
      toast.error("فشل الحفظ");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("تحذف المصروف ده؟")) return;
    const ok = await deleteExpense(id);
    if (ok) {
      toast.success("اتحذف");
      fetchExpenses().then(setExpenses);
    } else {
      toast.error("فشل الحذف");
    }
  }

  const cards = [
    { label: "إيراد الشهر", value: `${finance.monthRevenue.toLocaleString("en-EG")} ج` },
    { label: "مصاريف الشهر", value: `${finance.monthExp.toLocaleString("en-EG")} ج` },
    { label: "صافي ربح الشهر", value: `${(finance.monthRevenue - finance.monthExp).toLocaleString("en-EG")} ج` },
    { label: "صافي الربح الكلي", value: `${(finance.totalRevenue - finance.totalExp).toLocaleString("en-EG")} ج` },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="الإيراد من الطلبات المؤكدة والمشحونة" title="المالية" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <p className="eyebrow text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-serif text-3xl">{c.value}</p>
          </Card>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={() => setEditing({ title: "", amount: 0, category: "بضاعة", spent_on: today, notes: "" })}
          className={`${btnPrimary} mb-6`}
        >
          + مصروف جديد
        </button>
        {editing && (
          <form onSubmit={save} className="mb-8 space-y-4 border border-border bg-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="اسم المصروف">
                <input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
              </Field>
              <Field label="المبلغ (جنيه)">
                <input type="number" min={0} value={editing.amount ?? 0} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} className={inputCls} dir="ltr" />
              </Field>
              <Field label="التصنيف">
                <select value={editing.category ?? "بضاعة"} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputCls}>
                  {expenseCats.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="التاريخ">
                <input type="date" value={editing.spent_on ?? today} onChange={(e) => setEditing({ ...editing, spent_on: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="ملاحظات (اختياري)">
              <input value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className={inputCls} />
            </Field>
            <div className="flex gap-3">
              <button type="submit" className={btnPrimary}>حفظ</button>
              <button type="button" onClick={() => setEditing(null)} className={`${btnGhost} px-6 py-3`}>إلغاء</button>
            </div>
          </form>
        )}
        {expenses === null ? (
          <p className="text-sm text-muted-foreground">بيحمّل...</p>
        ) : expenses.length === 0 ? (
          <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">مفيش مصاريف متسجلة لسه.</p>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {expenses.map((x) => (
              <div key={x.id} className="flex items-center gap-4 py-3">
                <div className="flex-1">
                  <p className="text-sm">{x.title}</p>
                  <p className="text-xs text-muted-foreground">{x.category} · {x.spent_on}{x.notes ? ` · ${x.notes}` : ""}</p>
                </div>
                <p className="font-serif text-xl">{Number(x.amount).toLocaleString("en-EG")} ج</p>
                <button type="button" onClick={() => setEditing(x)} className={btnGhost}>تعديل</button>
                <button type="button" onClick={() => remove(x.id)} className={`${btnGhost} text-destructive hover:border-destructive`}>حذف</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
