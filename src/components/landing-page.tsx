"use client";

import React, { useEffect, useState } from "react";
import { Phone, ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { LangProvider, useT } from "@/components/lang-context";
import { EstimateForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { config, areas, trackCall } from "@/lib/site";

const Stars = ({ className }: { className?: string }) => (
  <span className={cn("tracking-[0.15em] text-clay", className)}>★★★★★</span>
);

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-clay", className)}>{children}</span>;
}

function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2.5", className)}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 13c3-1 5-3 7-6 1 3 3 5 6 6-1 4-3 6-6.5 7C7 19 5 17 4 13Z" fill="#2e5a35" />
        <path d="M13 3c1.6.9 2 2.3 1.4 3.6" stroke="#c0512e" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-xl tracking-tight text-foreground">
        Columbus <span className="italic text-leaf">Cleaning</span>
      </span>
    </a>
  );
}

/* ---------------- Language toggle ---------------- */
function LangPill() {
  const { lang, setLang } = useT();
  return (
    <div className="inline-flex rounded-full border border-sand p-0.5">
      {(["en", "es"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} className={cn("rounded-full px-2.5 py-1 text-xs font-bold uppercase transition", lang === l ? "bg-forest text-cream" : "text-muted-foreground")}>
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
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", scrolled ? "border-b border-sand bg-cream/90 backdrop-blur-md" : "border-b border-transparent")}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Logo />
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {links.map(([href, key]) => (
            <a key={href} href={href} className="text-sm font-medium text-foreground/80 transition hover:text-foreground">{t(key)}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangPill />
          <a href="#contact" className="rounded-md bg-forest px-4 py-2 text-sm font-semibold text-cream transition hover:opacity-90">{t("nav.cta")}</a>
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
    <section id="top" className="bg-cream px-6 pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="flex items-center gap-3"><span className="h-px w-8 bg-clay" /><Eyebrow>{t("hero.eyebrow")}</Eyebrow></span>
          <h1 className="mt-6 font-serif text-[clamp(2.6rem,6.2vw,4.6rem)] leading-[1.02] tracking-tight text-foreground">
            <span className="block">{t("hero.l1")}</span>
            <span className="block italic text-leaf">{t("hero.l2")}</span>
            <span className="block">{t("hero.l3")}<span className="text-clay">.</span></span>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">{t("hero.sub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-md bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition hover:opacity-90">
              {t("hero.cta1")} <ArrowRight className="h-4 w-4" />
            </a>
            <a href={config.phoneHref} onClick={() => trackCall("hero-call")} className="inline-flex items-center justify-center gap-2 rounded-md border border-forest/30 px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-forest/5">
              <Phone className="h-4 w-4" /> {t("hero.cta2")}
            </a>
          </div>
          <div className="mt-7 flex items-center gap-2.5"><Stars /> <span className="text-sm text-muted-foreground">{t("hero.rating")}</span></div>
        </Reveal>

        <Reveal>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/result-patio.jpg" alt="A freshly cleaned, bright Columbus space" className="aspect-[5/6] w-full rounded-lg object-cover shadow-xl md:aspect-[4/5]" />
            <div className="absolute bottom-4 left-4 rounded-md bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-baseline gap-1.5"><span className="font-serif text-2xl text-foreground">5.0</span><span className="text-clay">★</span></div>
              <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">{t("hero.googleReviews")}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-sand border-y border-sand py-5">
            {stats.map(([n, l]) => (
              <div key={l} className="px-2 text-center">
                <div className="font-serif text-2xl text-foreground md:text-3xl">{t(n)}</div>
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
    <div className="overflow-hidden border-y border-sand bg-cream py-4">
      <div className="flex w-max animate-marquee items-center">
        {loop.map((a, i) => (
          <span key={i} className="flex items-center gap-5 px-5 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
            <span className="text-clay">✦</span> {a}
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
    <section id="about" className="scroll-mt-20 bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <Eyebrow>{t("about.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] tracking-tight text-foreground">{t("about.h")}</h2>
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
function Services() {
  const { t } = useT();
  const items = ["svc.house", "svc.deep", "svc.move", "svc.office", "svc.post", "svc.uph"];
  return (
    <section id="services" className="scroll-mt-20 border-t border-sand bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><Eyebrow>{t("services.eyebrow")}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] tracking-tight text-foreground">{t("services.h")}</h2>
        </Reveal>
        <Reveal stagger className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {items.map((k, i) => (
            <div key={k} className="flex gap-5 border-t border-sand pt-6">
              <span className="font-serif text-base text-clay">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-serif text-xl text-foreground">{t(k)}</h3>
                <p className="mt-1.5 text-[0.96rem] leading-relaxed text-muted-foreground">{t(`${k}.d`)}</p>
              </div>
            </div>
          ))}
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
    <section id="gallery" className="scroll-mt-20 bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <Reveal>
            <Eyebrow>{t("work.eyebrow")}</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] tracking-tight text-foreground">{t("work.h")}</h2>
          </Reveal>
          <Reveal as="p" className="text-[1.02rem] leading-relaxed text-muted-foreground md:pb-2">{t("work.sub")}</Reveal>
        </div>
        <Reveal stagger className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {GALLERY.map((img) => (
            <div key={img} className="overflow-hidden rounded-md bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/${img}.jpg`} alt="Columbus Cleaning Services job" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.04]" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Why us ---------------- */
function WhyUs() {
  const { t } = useT();
  const items = ["why.1", "why.2", "why.3", "why.4", "why.5", "why.6"];
  return (
    <section className="scroll-mt-20 bg-cream-2 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{t("why.eyebrow")}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] tracking-tight text-foreground">{t("why.h")}</h2>
        </Reveal>
        <Reveal stagger className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((k, i) => (
            <div key={k} className="border-t border-sand pt-6">
              <div className="font-serif text-2xl text-clay">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-serif text-xl text-foreground">{t(`${k}.t`)}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{t(`${k}.d`)}</p>
            </div>
          ))}
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
    <section id="reviews" className="scroll-mt-20 bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <Eyebrow>{t("rev.eyebrow")}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,6vw,4.4rem)] leading-none tracking-tight text-foreground">{t("rev.h")}</h2>
          <p className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-muted-foreground">{t("rev.sub")}</p>
          <a href={config.googleProfileUrl} target="_blank" rel="noopener" onClick={() => trackCall("google-reviews")} className="mt-6 inline-block border-b border-forest pb-0.5 text-sm font-semibold text-foreground transition hover:text-leaf">{t("rev.link")}</a>
        </Reveal>
        <Reveal stagger className="space-y-5">
          {reviews.map((k) => (
            <figure key={k} className="rounded-md border border-sand bg-card p-6 md:p-7">
              <Stars className="text-sm" />
              <blockquote className="mt-4 font-serif text-[1.15rem] italic leading-relaxed text-foreground">{t(`${k}.q`)}</blockquote>
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
    <section id="contact" className="scroll-mt-20 bg-forest px-6 py-20 text-cream md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <Eyebrow>{t("contact.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.04] tracking-tight text-cream">{t("contact.h")}</h2>
          <p className="mt-5 max-w-md leading-relaxed text-cream/70">{t("contact.sub")}</p>
          <a href={config.phoneHref} onClick={() => trackCall("contact-call")} className="mt-8 flex items-center gap-3 font-serif text-3xl text-cream md:text-4xl">
            <Phone className="h-6 w-6 text-clay" /> {config.phone}
          </a>
          <div className="mt-2 text-sm text-cream/60">{t("contact.open")}</div>
          <a href={config.emailHref} className="mt-3 inline-flex items-center gap-2 text-sm text-cream/85 underline-offset-4 transition hover:text-cream hover:underline">
            <Mail className="h-4 w-4 text-clay" /> {config.email}
          </a>
          <div className="mt-8">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-clay">{t("contact.serving")}</div>
            <p className="mt-2 max-w-sm leading-relaxed text-cream/70">{areas.join(" · ")}</p>
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
    <footer className="bg-[#0f1f14] px-6 pb-24 pt-12 text-cream/65 md:pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <span className="font-serif text-xl text-cream">Columbus <span className="italic text-leaf">Cleaning</span></span>
            <p className="mt-3 text-sm leading-relaxed">{t("foot.tag")}</p>
          </div>
          <div className="text-sm md:text-right">
            <a href={config.phoneHref} onClick={() => trackCall("footer-call")} className="font-serif text-xl text-cream">{config.phone}</a>
            <div className="mt-1"><a href={config.emailHref} className="transition hover:text-cream">{config.email}</a></div>
            <div className="mt-2">{t("foot.legal")}</div>
          </div>
        </div>
        <div className="mt-10 border-t border-cream/10 pt-6 text-xs text-cream/45">{t("foot.rights")}</div>
      </div>
    </footer>
  );
}

/* ---------------- Sticky mobile bar ---------------- */
function MobileBar() {
  const { t } = useT();
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-sand bg-cream/96 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a href={config.phoneHref} onClick={() => trackCall("sticky-call")} className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-forest px-3 py-3 text-sm font-semibold text-cream"><Phone className="h-4 w-4" /> {t("m.call")}</a>
      <a href="#contact" className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-forest/30 px-3 py-3 text-sm font-semibold text-foreground">{t("m.quote")}</a>
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
