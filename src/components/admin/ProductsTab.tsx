import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { refreshCatalog } from "@/lib/catalog";
import {
  deleteProduct,
  uploadProductImage,
  upsertProduct,
  type ProductRow,
} from "@/lib/orders";
import { btnGhost, btnPrimary, Field, inputCls, SectionTitle } from "./ui";
import { fillTpl, useLang } from "./lang";

const categories = ["accessories", "gifts", "bridal-favors", "baby-favors"];

export function ProductsTab({
  rows,
  reload,
}: {
  rows: ProductRow[] | null;
  reload: () => void;
}) {
  const { t } = useLang();
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);
  const [uploading, setUploading] = useState(false);

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    if (!editing?.slug?.trim() || !editing?.name?.trim()) {
      toast.error(t("nameSlugReq"));
      return;
    }
    const ok = await upsertProduct({
      ...editing,
      slug: editing.slug.trim(),
      price: Number(editing.price ?? 0),
      stock: Number(editing.stock ?? 0),
      low_stock_at: Number(editing.low_stock_at ?? 5),
    });
    if (ok) {
      toast.success(t("savedProduct"));
      setEditing(null);
      refreshCatalog();
      reload();
    } else {
      toast.error(t("saveFail"));
    }
  }

  async function onImageFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const url = await uploadProductImage(file);
    setUploading(false);
    if (url) {
      setEditing((p) => ({ ...p, image_url: url }));
      toast.success(t("imgUploaded"));
    } else {
      toast.error(t("imgFail"));
    }
  }

  async function removeProduct(id: string, name: string) {
    if (!window.confirm(fillTpl(t("delConfirm"), { name }))) return;
    const ok = await deleteProduct(id);
    if (ok) {
      toast.success(t("delProduct"));
      refreshCatalog();
      reload();
    } else {
      toast.error(t("delFail"));
    }
  }

  return (
    <div>
      <SectionTitle eyebrow={t("prodEyebrow")} title={t("prodTitle")} />
      <button
        type="button"
        onClick={() => setEditing({ slug: "", name: "", category: "accessories", price: 0, description: "", badge: "", image_url: "", visible: true, stock: 0, low_stock_at: 5 })}
        className={`${btnPrimary} mb-6`}
      >
        {t("addProduct")}
      </button>
      {editing && (
        <form onSubmit={saveProduct} className="mb-8 space-y-4 border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("fName")}>
              <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label={t("fSlug")}>
              <input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t("fCategory")}>
              <select value={editing.category ?? "accessories"} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputCls}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label={t("fPrice")}>
              <input type="number" min={0} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t("fStock")}>
              <input type="number" min={0} value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t("fLowAt")}>
              <input type="number" min={0} value={editing.low_stock_at ?? 5} onChange={(e) => setEditing({ ...editing, low_stock_at: Number(e.target.value) })} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t("fBadge")}>
              <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className={inputCls} dir="ltr" />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
              {t("fVisible")}
            </label>
          </div>
          <Field label={t("fDesc")}>
            <textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
          </Field>
          <Field label={t("fImage")}>
            <div className="flex flex-wrap items-center gap-3">
              {editing.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image_url} alt="" width={80} height={80} className="h-20 w-20 object-cover border border-border" />
              ) : null}
              <label className="cursor-pointer border border-dashed border-border px-4 py-3 text-xs text-muted-foreground hover:border-foreground transition-colors">
                {uploading ? t("uploading") : t("uploadImg")}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onImageFile(e.target.files?.[0])} />
              </label>
              <input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder={t("imgUrlPh")} className={`${inputCls} flex-1 min-w-52`} dir="ltr" />
            </div>
          </Field>
          <div className="flex gap-3">
            <button type="submit" className={btnPrimary}>{t("save")}</button>
            <button type="button" onClick={() => setEditing(null)} className={`${btnGhost} px-6 py-3`}>{t("cancel")}</button>
          </div>
        </form>
      )}
      {rows === null ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-4 py-3">
              {r.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" width={56} height={56} className="h-14 w-14 object-cover border border-border" />
              ) : (
                <span className="grid h-14 w-14 place-items-center border border-border text-xs text-muted-foreground">{t("noImage")}</span>
              )}
              <div className="flex-1">
                <p className="text-sm">{r.name} <span className="text-muted-foreground">· {t("stockLbl")} {r.stock ?? 0}</span></p>
                <p className="text-xs text-muted-foreground" dir="ltr">{r.slug} · {r.category} · {r.price} EGP{r.visible ? "" : ` · ${t("hiddenLbl")}`}</p>
              </div>
              <button type="button" onClick={() => setEditing(r)} className={btnGhost}>{t("edit")}</button>
              <button type="button" onClick={() => removeProduct(r.id, r.name)} className={`${btnGhost} text-destructive hover:border-destructive`}>{t("del")}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
