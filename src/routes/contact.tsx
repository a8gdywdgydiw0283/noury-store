import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHero } from "@/components/noury/PageHero";
import { Mail, MapPin, Phone, Instagram, Music2 } from "lucide-react";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Noury" },
      { name: "description", content: "Get in touch with the Noury team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: { name?: string; email?: string; message?: string } = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (form.message.trim().length < 10) next.message = "Please tell us a little more.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    toast.success("Thanks! Your message has been sent.");
    setForm({ name: "", email: "", message: "" });
  }

  const field =
    "w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <>
      <PageHero
        eyebrow="We're here to help"
        title="Contact Us"
        subtitle="Questions about an order, a product or a gift? Send us a note and we'll get back to you within 24 hours."
        image={story}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="eyebrow text-muted-foreground">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`${field} mt-2`}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="eyebrow text-muted-foreground">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${field} mt-2`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="message" className="eyebrow text-muted-foreground">Message</label>
            <textarea
              id="message"
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${field} mt-2 resize-none`}
              placeholder="How can we help?"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="bg-mocha text-cream px-8 py-3.5 eyebrow hover:bg-foreground transition-colors cursor-pointer"
          >
            Send Message
          </button>
        </form>

        <aside className="space-y-8 border-l border-border pl-0 md:pl-12">
          <div>
            <h3 className="font-serif text-2xl">Reach us directly</h3>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Mail size={16} strokeWidth={1.25} /> hello@noury.eg</li>
              <li className="flex items-center gap-3"><Phone size={16} strokeWidth={1.25} /> +20 100 000 0000</li>
              <li className="flex items-center gap-3"><MapPin size={16} strokeWidth={1.25} /> Cairo, Egypt</li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-2xl">Follow along</h3>
            <div className="mt-5 flex items-center gap-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="hover:text-gold transition-colors">
                <Instagram size={18} strokeWidth={1.25} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer noopener" aria-label="TikTok" className="hover:text-gold transition-colors">
                <Music2 size={18} strokeWidth={1.25} />
              </a>
              <span className="text-sm text-muted-foreground">@noury.eg</span>
            </div>
          </div>
          <div className="bg-card border border-border p-6 text-sm text-muted-foreground">
            Customer support hours: Sunday – Thursday, 10am – 6pm.
          </div>
        </aside>
      </section>
    </>
  );
}
