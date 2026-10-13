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
import { useLang } from "./lang";

export function FinanceTab({ orders }: { orders: OrderRow[] }) {
  const { t, lang } = useLang();
  const [expenses, setExpenses] = useState<ExpenseRow[] | null>(null);
  const [editing, setEditing] = useState<Partial<ExpenseRow> | null>(null);

  const expenseCats = [t("expCatGoods"), t("expCatShip"), t("expCatPack"), t("expCatAds"), t("expCatOther")];

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
      toast.error(t("expNameReq"));
      return;
    }
    const ok = await upsertExpense({
      ...editing,
      title: editing.title.trim(),
      amount: Number(editing?.amount ?? 0),
      spent_on: editing?.spent_on || today,
    });
    if (ok) {
      toast.success(t("expSaved"));
      setEditing(null);
      fetchExpenses().then(setExpenses);
    } else {
      toast.error(t("saveFail"));
    }
  }

  async function remove(id: string) {
    if (!window.confirm(t("expDelConfirm"))) return;
    const ok = await deleteExpense(id);
    if (ok) {
      toast.success(t("expDeleted"));
      fetchExpenses().then(setExpenses);
    } else {
      toast.error(t("delFail"));
    }
  }

  const cards = [
    { label: t("finMonthRev"), value: `${finance.monthRevenue.toLocaleString("en-EG")} ${t("egp")}` },
    { label: t("finMonthExp"), value: `${finance.monthExp.toLocaleString("en-EG")} ${t("egp")}` },
    { label: t("finMonthNet"), value: `${(finance.monthRevenue - finance.monthExp).toLocaleString("en-EG")} ${t("egp")}` },
    { label: t("finTotalNet"), value: `${(finance.totalRevenue - finance.totalExp).toLocaleString("en-EG")} ${t("egp")}` },
  ];

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SectionTitle eyebrow={t("finEyebrow")} title={t("finTitle")} />
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
          onClick={() => setEditing({ title: "", amount: 0, category: expenseCats[0] ?? "", spent_on: today, notes: "" })}
          className={`${btnPrimary} mb-6`}
        >
          {t("addExp")}
        </button>
        {editing && (
          <form onSubmit={save} className="mb-8 space-y-4 border border-border bg-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("eName")}>
                <input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
              </Field>
              <Field label={t("eAmount")}>
                <input type="number" min={0} value={editing.amount ?? 0} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} className={inputCls} dir="ltr" />
              </Field>
              <Field label={t("eCat")}>
                <select value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputCls}>
                  {expenseCats.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("eDate")}>
                <input type="date" value={editing.spent_on ?? today} onChange={(e) => setEditing({ ...editing, spent_on: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label={t("eNotes")}>
              <input value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className={inputCls} />
            </Field>
            <div className="flex gap-3">
              <button type="submit" className={btnPrimary}>{t("save")}</button>
              <button type="button" onClick={() => setEditing(null)} className={`${btnGhost} px-6 py-3`}>{t("cancel")}</button>
            </div>
          </form>
        )}
        {expenses === null ? (
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        ) : expenses.length === 0 ? (
          <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">{t("noExp")}</p>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {expenses.map((x) => (
              <div key={x.id} className="flex items-center gap-4 py-3">
                <div className="flex-1">
                  <p className="text-sm">{x.title}</p>
                  <p className="text-xs text-muted-foreground">{x.category} · {x.spent_on}{x.notes ? ` · ${x.notes}` : ""}</p>
                </div>
                <p className="font-serif text-xl">{Number(x.amount).toLocaleString("en-EG")} {t("egp")}</p>
                <button type="button" onClick={() => setEditing(x)} className={btnGhost}>{t("edit")}</button>
                <button type="button" onClick={() => remove(x.id)} className={`${btnGhost} text-destructive hover:border-destructive`}>{t("del")}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
