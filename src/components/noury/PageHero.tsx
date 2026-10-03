import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  breadcrumb,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  image?: string | undefined;
  breadcrumb?: { label: string; to?: string | undefined }[] | undefined;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-mocha text-cream">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-mocha/90 via-mocha/70 to-mocha/40" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
        {breadcrumb && (
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase opacity-80">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-gold transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="text-gold">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
        <h1 className="mt-3 font-serif text-4xl md:text-6xl leading-[1.05]">{title}</h1>
        {subtitle && <p className="mt-5 max-w-xl text-sm leading-relaxed opacity-90">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
