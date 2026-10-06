import type { ReactNode } from "react";
import { Heart, MessageCircle } from "lucide-react";

export function ThanksPanel({ onContinue, extra }: { onContinue: () => void; extra?: ReactNode }) {
  return (
    <div className="border border-border bg-card px-8 py-14 text-center">
      <Heart size={30} strokeWidth={1} className="mx-auto text-gold" />
      <h3 className="mt-5 font-serif text-3xl">شكرًا ليك من قلبنا!</h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-loose text-muted-foreground">
        طلبك وصلنا يا غالي، ومبسوطين إنك اخترت Noury تكون جزء من يومك ومناسبتك الحلوة.
        فريقنا هيراجع طلبك ويأكده معاك على واتساب خطوة بخطوة.
        ومستنينك دايمًا — عندنا كل جديد هيعجبك، ويسعدنا تطلب مننا تاني قريب!
      </p>
      {extra}
      <button
        type="button"
        onClick={onContinue}
        className="mt-8 inline-flex items-center justify-center gap-3 bg-mocha text-cream px-8 py-4 eyebrow hover:bg-foreground transition-colors cursor-pointer"
      >
        <MessageCircle size={16} strokeWidth={1.5} /> متابعة وإرسال الطلب على واتساب
      </button>
      <p className="mt-6 text-xs tracking-[0.2em] text-muted-foreground">Noury | نُورِى</p>
    </div>
  );
}
