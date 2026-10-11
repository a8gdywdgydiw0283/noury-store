import { toast } from "sonner";
import { adjustStock } from "@/lib/erp";
import { updateOrderStatus, type OrderRow, type OrderStatus } from "@/lib/orders";
import { fmtDate, keyLabel, SectionTitle, sourceLabel, statusLabel } from "./ui";

const statuses: OrderStatus[] = ["new", "confirmed", "shipped", "cancelled"];
const COUNTED = new Set(["confirmed", "shipped"]);

export function OrdersTab({
  orders,
  setOrders,
  statusFilter,
  setStatusFilter,
}: {
  orders: OrderRow[];
  setOrders: (fn: (prev: OrderRow[]) => OrderRow[]) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}) {
  async function changeStatus(order: OrderRow, status: OrderStatus) {
    const prev = order.status;
    const ok = await updateOrderStatus(order.id, status);
    if (!ok) {
      toast.error("فشل التحديث");
      return;
    }
    // Keep inventory in sync: decrement when an order becomes counted, restore on cancel.
    if (order.source === "checkout" && order.items?.length > 0) {
      if (!COUNTED.has(prev) && COUNTED.has(status)) await adjustStock(order.items, -1);
      if (COUNTED.has(prev) && status === "cancelled") await adjustStock(order.items, 1);
      if (prev === "cancelled" && COUNTED.has(status)) await adjustStock(order.items, -1);
    }
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status } : o)));
    toast.success("اتحدثت الحالة");
  }

  const shown = orders
    .filter((o) => o.source === "checkout")
    .filter((o) => statusFilter === "all" || o.status === statusFilter);

  const favors = orders.filter((o) => o.source !== "checkout").length;

  return (
    <div>
      <SectionTitle eyebrow={`طلبات السلة · طلبات الهدايا والتوزيعات: ${favors}`} title="الطلبات" />
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="eyebrow text-muted-foreground">الحالة:</span>
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`border px-4 py-1.5 text-xs cursor-pointer transition-colors ${statusFilter === s ? "bg-mocha text-cream border-mocha" : "border-border hover:border-foreground"}`}
          >
            {s === "all" ? "الكل" : statusLabel[s]}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">مفيش طلبات هنا لسه.</p>
      ) : (
        <div className="space-y-4">
          {shown.map((o) => (
            <article key={o.id} className="border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="eyebrow text-gold">{sourceLabel[o.source] ?? o.source}</span>
                  <span className="text-muted-foreground">{fmtDate(o.created_at)}</span>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                  className="border border-border bg-background px-3 py-1.5 text-xs cursor-pointer"
                  aria-label="حالة الطلب"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="eyebrow text-muted-foreground mb-2">العميل</p>
                  <dl className="space-y-1 text-sm">
                    {Object.entries(o.customer ?? {}).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="text-muted-foreground">{keyLabel[k] ?? k}:</dt>
                        <dd>{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <p className="eyebrow text-muted-foreground mb-2">الأصناف</p>
                  <ul className="space-y-1 text-sm">
                    {(o.items ?? []).map((it, k) => (
                      <li key={k}>{it.name} × {it.qty} = {Number(it.price ?? 0) * Number(it.qty ?? 0)} جنيه</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">الإجمالي: {Number(o.subtotal ?? 0)} جنيه (بدون الشحن)</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function FavorsTab({
  orders,
  setOrders,
  statusFilter,
  setStatusFilter,
}: {
  orders: OrderRow[];
  setOrders: (fn: (prev: OrderRow[]) => OrderRow[]) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}) {
  async function changeStatus(order: OrderRow, status: OrderStatus) {
    const ok = await updateOrderStatus(order.id, status);
    if (!ok) {
      toast.error("فشل التحديث");
      return;
    }
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status } : o)));
    toast.success("اتحدثت الحالة");
  }

  const shown = orders
    .filter((o) => o.source !== "checkout")
    .filter((o) => statusFilter === "all" || o.status === statusFilter);

  return (
    <div>
      <SectionTitle eyebrow="هدايا ومواليد وعرايس" title="الهدايا والتوزيعات" />
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="eyebrow text-muted-foreground">الحالة:</span>
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`border px-4 py-1.5 text-xs cursor-pointer transition-colors ${statusFilter === s ? "bg-mocha text-cream border-mocha" : "border-border hover:border-foreground"}`}
          >
            {s === "all" ? "الكل" : statusLabel[s]}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">مفيش طلبات هنا لسه.</p>
      ) : (
        <div className="space-y-4">
          {shown.map((o) => (
            <article key={o.id} className="border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="eyebrow text-gold">{sourceLabel[o.source] ?? o.source}</span>
                  <span className="text-muted-foreground">{fmtDate(o.created_at)}</span>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                  className="border border-border bg-background px-3 py-1.5 text-xs cursor-pointer"
                  aria-label="حالة الطلب"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="eyebrow text-muted-foreground mb-2">العميل</p>
                  <dl className="space-y-1 text-sm">
                    {Object.entries(o.customer ?? {}).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="text-muted-foreground">{keyLabel[k] ?? k}:</dt>
                        <dd>{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <p className="eyebrow text-muted-foreground mb-2">التفاصيل</p>
                  <dl className="space-y-1 text-sm">
                    {Object.entries(o.details ?? {}).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="text-muted-foreground">{keyLabel[k] ?? k}:</dt>
                        <dd>{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
