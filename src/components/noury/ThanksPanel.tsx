import type { ReactNode } from "react";
import { Heart, MessageCircle } from "lucide-react";

export function ThanksPanel({ onContinue, extra }: { onContinue: () => void; extra?: ReactNode }) {
  return (
    <div className="border border-border bg-card px-8 py-14 text-center">
      <Heart size={30} strokeWidth={1} className="mx-auto text-gold" />
      <h3 className="mt-5 font-serif text-3xl">شكرًا من القلب لاختياركِ Noury 🤍</h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-loose text-muted-foreground">
        سعداء جدًا إن إحدى تفاصيلنا أصبحت جزءًا من يومكِ أو من لحظة مميزة تخصكِ.
        نتمنى إن كل قطعة وصلتكِ تكون على قد توقعاتكِ، وتضيف لكِ لمسة جميلة تحبيها.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-loose text-muted-foreground">
        وجودكِ معانا يعني لنا الكثير، وننتظر زيارتكِ القادمة بكل حب. ♡
      </p>
      <p className="mt-6 text-sm leading-loose">
        بكل حب،
        <br />
        <span className="font-serif font-medium uppercase tracking-[0.18em] text-mocha">Noury</span>
        <br />
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your Style, Your Story.</span>
      </p>
      {extra}
      <button
        type="button"
        onClick={onContinue}
        className="mt-8 inline-flex items-center justify-center gap-3 bg-mocha text-cream px-8 py-4 eyebrow hover:bg-foreground transition-colors cursor-pointer"
      >
        <MessageCircle size={16} strokeWidth={1.5} /> متابعة وإرسال الطلب على واتساب
      </button>
    </div>
  );
}
