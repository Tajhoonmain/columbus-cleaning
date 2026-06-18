"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Phone, ArrowRight, Mail, Sparkles, SprayCan, Package, Building2, HardHat, Sofa,
  ShieldCheck, BadgeDollarSign, CalendarClock, Users, Home, Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LangProvider, useT } from "@/components/lang-context";
import { EstimateForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { config, areas, trackCall } from "@/lib/site";

/* Reusable button styles (deep-blue gradient CTA + outline) */
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-[#3b82f6] to-[#2563eb] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,.7)] transition hover:brightness-110";
const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#3b82f6]/60 hover:bg-white/10";

const Stars = ({ className }: { className?: string }) => (
  <span className={cn("tracking-[0.15em] text-[#fbbf24]", className)}>★★★★★</span>
);

function Eyebrow({ children, icon: Icon, className }: { children: React.ReactNode; icon?: LucideIcon; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#3b82f6]", className)}>
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </span>
  );
}

/** Brand logo. Renders /logo.png (in a white chip so it reads cleanly on the
 *  dark theme); falls back to a styled wordmark if the image is missing. */
function Logo({ imgClass, textClass }: { imgClass?: string; textClass?: string }) {
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // Catch a 404 that resolves before hydration attaches onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setErr(true);
  }, []);
  if (err) {
    return (
      <span className={cn("font-serif tracking-tight text-white", textClass ?? "text-xl")}>
        Columbus <span className="italic text-[#60a5fa]">Cleaning Services</span>
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src="/logo.png" alt="Columbus Cleaning Services" onError={() => setErr(true)} className={cn("w-auto rounded-md bg-white object-contain", imgClass ?? "h-10 p-1")} />
  );
}

/* ---------------- Language toggle ---------------- */
function LangPill() {
  const { lang, setLang } = useT();
  return (
    <div className="inline-flex rounded-full border border-white/15 p-0.5">
      {(["en", "es"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} className={cn("rounded-full px-2.5 py-1 text-xs font-bold uppercase transition", lang === l ? "bg-[#2563eb] text-white" : "text-muted-foreground hover:text-white")}>
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["#about", "nav.about"], ["#services", "nav.services"], ["#gallery", "nav.gallery"],
    ["#reviews", "nav.reviews"], ["#contact", "nav.contact"],
  ] as const;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", scrolled ? "border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md" : "border-b border-transparent")}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a href="#top" aria-label="Columbus Cleaning Services" className="flex items-center"><Logo imgClass="h-11 p-1" /></a>
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {links.map(([href, key]) => (
            <a key={href} href={href} className="text-sm font-medium text-white/75 transition hover:text-white">{t(key)}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangPill />
          <a href="#contact" className="rounded-md bg-gradient-to-b from-[#3b82f6] to-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,.8)] transition hover:brightness-110">{t("nav.cta")}</a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const { t } = useT();
  const stats = [
    ["hero.stat1n", "hero.stat1l"], ["hero.stat2n", "hero.stat2l"], ["hero.stat3n", "hero.stat3l"],
  ] as const;
  return (
    <section id="top" className="relative px-6 pb-16 pt-28 md:pb-24 md:pt-36" style={{ background: "radial-gradient(120% 85% at 50% -10%, #0e1c3f 0%, #0a0a0a 58%)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="flex items-center gap-3"><span className="h-px w-8 bg-[#3b82f6]" /><Eyebrow>{t("hero.eyebrow")}</Eyebrow></span>
          <h1 className="mt-6 font-serif text-[clamp(2.6rem,6.2vw,4.6rem)] leading-[1.02] tracking-tight text-white">
            <span className="block">{t("hero.l1")}</span>
            <span className="block bg-gradient-to-r from-[#60a5fa] to-[#2563eb] bg-clip-text italic text-transparent">{t("hero.l2")}</span>
            <span className="block">{t("hero.l3")}<span className="text-[#3b82f6]">.</span></span>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">{t("hero.sub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className={btnPrimary}>{t("hero.cta1")} <ArrowRight className="h-4 w-4" /></a>
            <a href={config.phoneHref} onClick={() => trackCall("hero-call")} className={btnOutline}>
              <Phone className="h-4 w-4" /> {t("hero.cta2")}
            </a>
          </div>
          <div className="mt-7 flex items-center gap-2.5"><Stars /> <Sparkles className="h-4 w-4 text-[#3b82f6]" /> <span className="text-sm text-muted-foreground">{t("hero.rating")}</span></div>
        </Reveal>

        <Reveal>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/result-patio.jpg" alt="A freshly cleaned, bright Columbus space" className="aspect-[5/6] w-full rounded-lg object-cover shadow-2xl ring-1 ring-white/10 md:aspect-[4/5]" />
            <div className="absolute bottom-4 left-4 rounded-md border border-white/10 bg-[#0f172a]/90 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-baseline gap-1.5"><span className="font-serif text-2xl text-white">5.0</span><span className="text-[#fbbf24]">★</span></div>
              <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">{t("hero.googleReviews")}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-white/[0.02] py-5">
            {stats.map(([n, l]) => (
              <div key={l} className="px-2 text-center">
                <div className="font-serif text-2xl text-white md:text-3xl">{t(n)}</div>
                <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t(l)}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Marquee ---------------- */
function Marquee() {
  const loop = [...areas, ...areas];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0d1326] py-4">
      <div className="flex w-max animate-marquee items-center">
        {loop.map((a, i) => (
          <span key={i} className="flex items-center gap-5 px-5 text-sm font-medium uppercase tracking-[0.18em] text-white/55">
            <Sparkles className="h-3.5 w-3.5 text-[#3b82f6]" /> {a}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- About ---------------- */
function About() {
  const { t } = useT();
  return (
    <section id="about" className="scroll-mt-20 bg-[#0a0a0a] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <Eyebrow icon={Home}>{t("about.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] tracking-tight text-white">{t("about.h")}</h2>
        </Reveal>
        <Reveal className="space-y-5 self-end text-[1.05rem] leading-relaxed text-muted-foreground">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
const SERVICE_ICONS: LucideIcon[] = [Home, SprayCan, Package, Building2, HardHat, Sofa];
function Services() {
  const { t } = useT();
  const items = ["svc.house", "svc.deep", "svc.move", "svc.office", "svc.post", "svc.uph"];
  return (
    <section id="services" className="scroll-mt-20 border-t border-white/10 bg-[#0a0a0a] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><Eyebrow icon={SprayCan}>{t("services.eyebrow")}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] tracking-tight text-white">{t("services.h")}</h2>
        </Reveal>
        <Reveal stagger className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {items.map((k, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <div key={k} className="flex gap-5 border-t border-white/10 pt-6">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 text-[#60a5fa]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl text-white">{t(k)}</h3>
                  <p className="mt-1.5 text-[0.96rem] leading-relaxed text-muted-foreground">{t(`${k}.d`)}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */
const GALLERY = [
  "action-bathroom", "action-steam", "action-deepclean",
  "result-patio", "action-vacuum", "action-mop",
  "result-bathroom", "action-dust", "result-floor",
];
function Gallery() {
  const { t } = useT();
  return (
    <section id="gallery" className="scroll-mt-20 bg-[#0a0a0a] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <Reveal>
            <Eyebrow icon={Sparkles}>{t("work.eyebrow")}</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] tracking-tight text-white">{t("work.h")}</h2>
          </Reveal>
          <Reveal as="p" className="text-[1.02rem] leading-relaxed text-muted-foreground md:pb-2">{t("work.sub")}</Reveal>
        </div>
        <Reveal stagger className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GALLERY.map((img) => (
            <div key={img} className="overflow-hidden rounded-md border border-white/10 bg-[#111827]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/${img}.jpg`} alt="Columbus Cleaning Services job" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.04]" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Why us (trust) ---------------- */
const WHY_ICONS: LucideIcon[] = [ShieldCheck, BadgeDollarSign, CalendarClock, Building2, Sparkles, Users];
function WhyUs() {
  const { t } = useT();
  const items = ["why.1", "why.2", "why.3", "why.4", "why.5", "why.6"];
  return (
    <section className="scroll-mt-20 border-t border-white/10 bg-[#0d1326] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow icon={ShieldCheck}>{t("why.eyebrow")}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] tracking-tight text-white">{t("why.h")}</h2>
        </Reveal>
        <Reveal stagger className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((k, i) => {
            const Icon = WHY_ICONS[i];
            return (
              <div key={k} className="border-t border-white/10 pt-6">
                <span className="grid h-12 w-12 place-items-center rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 text-[#60a5fa]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-serif text-xl text-white">{t(`${k}.t`)}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{t(`${k}.d`)}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  const { t } = useT();
  const reviews = ["rev.1", "rev.2", "rev.3"];
  return (
    <section id="reviews" className="scroll-mt-20 border-t border-white/10 bg-[#0a0a0a] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <Eyebrow icon={Star}>{t("rev.eyebrow")}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,6vw,4.4rem)] leading-none tracking-tight text-white">{t("rev.h")}</h2>
          <p className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-muted-foreground">{t("rev.sub")}</p>
          <a href={config.googleProfileUrl} target="_blank" rel="noopener" onClick={() => trackCall("google-reviews")} className="mt-6 inline-block border-b border-[#3b82f6] pb-0.5 text-sm font-semibold text-white transition hover:text-[#60a5fa]">{t("rev.link")}</a>
        </Reveal>
        <Reveal stagger className="space-y-5">
          {reviews.map((k) => (
            <figure key={k} className="rounded-md border border-white/10 bg-[#111827] p-6 md:p-7">
              <Stars className="text-sm" />
              <blockquote className="mt-4 font-serif text-[1.15rem] italic leading-relaxed text-white">{t(`${k}.q`)}</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">{t(`${k}.a`)}</figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const { t } = useT();
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-white/10 px-6 py-20 md:py-28" style={{ background: "linear-gradient(160deg,#0e1c3f 0%,#0a0a0a 70%)" }}>
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <Eyebrow icon={Sparkles}>{t("contact.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.04] tracking-tight text-white">{t("contact.h")}</h2>
          <p className="mt-5 max-w-md leading-relaxed text-white/70">{t("contact.sub")}</p>
          <a href={config.phoneHref} onClick={() => trackCall("contact-call")} className="mt-8 flex items-center gap-3 font-serif text-3xl text-white md:text-4xl">
            <Phone className="h-6 w-6 text-[#3b82f6]" /> {config.phone}
          </a>
          <div className="mt-2 text-sm text-white/55">{t("contact.open")}</div>
          <a href={config.emailHref} className="mt-3 inline-flex items-center gap-2 text-sm text-white/85 underline-offset-4 transition hover:text-white hover:underline">
            <Mail className="h-4 w-4 text-[#3b82f6]" /> {config.email}
          </a>
          <div className="mt-8">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">{t("contact.serving")}</div>
            <p className="mt-2 max-w-sm leading-relaxed text-white/70">{areas.join(" · ")}</p>
          </div>
        </Reveal>
        <Reveal>
          <EstimateForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-white/10 bg-[#070707] px-6 pb-24 pt-12 text-white/60 md:pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <Logo imgClass="h-20 w-auto p-2" textClass="text-xl" />
            <p className="mt-3 text-sm leading-relaxed">{t("foot.tag")}</p>
          </div>
          <div className="text-sm md:text-right">
            <a href={config.phoneHref} onClick={() => trackCall("footer-call")} className="font-serif text-xl text-white">{config.phone}</a>
            <div className="mt-1"><a href={config.emailHref} className="transition hover:text-white">{config.email}</a></div>
            <div className="mt-2">{t("foot.legal")}</div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">{t("foot.rights")}</div>
      </div>
    </footer>
  );
}

/* ---------------- Sticky mobile bar ---------------- */
function MobileBar() {
  const { t } = useT();
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-white/10 bg-[#0a0a0a]/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a href={config.phoneHref} onClick={() => trackCall("sticky-call")} className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gradient-to-b from-[#3b82f6] to-[#2563eb] px-3 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,.8)]"><Phone className="h-4 w-4" /> {t("m.call")}</a>
      <a href="#contact" className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-3 text-sm font-semibold text-white">{t("m.quote")}</a>
    </div>
  );
}

function Site() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Gallery />
      <WhyUs />
      <Reviews />
      <Contact />
      <Footer />
      <MobileBar />
    </>
  );
}

export function LandingPage() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  );
}
