import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { refreshCategories, type CategoryRow } from "@/lib/catalog";
import { fetchCategoriesAdmin, upsertCategory } from "@/lib/erp";
import { uploadProductImage } from "@/lib/orders";
import { btnGhost, btnPrimary, Field, inputCls, SectionTitle } from "./ui";
import { useLang } from "./lang";

export function CategoriesTab() {
  const { t } = useLang();
  const [rows, setRows] = useState<CategoryRow[] | null>(null);
  const [editing, setEditing] = useState<Partial<CategoryRow> | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategoriesAdmin().then(setRows);
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing?.slug?.trim() || !editing?.title?.trim()) {
      toast.error(t("nameSlugReq"));
      return;
    }
    const ok = await upsertCategory({
      slug: editing.slug.trim(),
      title: editing.title.trim(),
      subtitle: editing.subtitle ?? "",
      blurb: editing.blurb ?? "",
      image_url: editing.image_url ?? null,
      custom: editing.custom ?? false,
      visible: editing.visible ?? true,
      sort_order: Number(editing.sort_order ?? 0),
    });
    if (ok) {
      toast.success(t("catSaved"));
      setEditing(null);
      refreshCategories();
      fetchCategoriesAdmin().then(setRows);
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

  return (
    <div>
      <SectionTitle eyebrow={t("catEyebrow")} title={t("catTitle")} />
      <button
        type="button"
        onClick={() => setEditing({ slug: "", title: "", subtitle: "", blurb: "", image_url: "", custom: false, visible: true, sort_order: (rows?.length ?? 0) + 1 })}
        className={`${btnPrimary} mb-6`}
      >
        {t("addCat")}
      </button>
      {editing && (
        <form onSubmit={save} className="mb-8 space-y-4 border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("cName")}>
              <input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
            </Field>
            <Field label={t("fSlug")}>
              <input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t("cTagline")}>
              <input value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className={inputCls} />
            </Field>
            <Field label={t("cOrder")}>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} dir="ltr" />
            </Field>
          </div>
          <Field label={t("fDesc")}>
            <textarea value={editing.blurb ?? ""} onChange={(e) => setEditing({ ...editing, blurb: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
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
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editing.custom ?? false} onChange={(e) => setEditing({ ...editing, custom: e.target.checked })} />
              {t("customChk")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
              {t("fVisible")}
            </label>
          </div>
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
            <div key={r.slug} className="flex items-center gap-4 py-3">
              {r.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" width={56} height={56} className="h-14 w-14 object-cover border border-border" />
              ) : (
                <span className="grid h-14 w-14 place-items-center border border-border text-xs text-muted-foreground">{t("noImage")}</span>
              )}
              <div className="flex-1">
                <p className="text-sm">{r.title}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">{r.slug}{r.custom ? ` · ${t("customLbl")}` : ""}{r.visible ? "" : ` · ${t("hiddenLbl")}`}</p>
              </div>
              <button type="button" onClick={() => setEditing(r)} className={btnGhost}>{t("edit")}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
