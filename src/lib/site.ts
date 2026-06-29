// ============================================================
// Site config. Set these via .env.local (NEXT_PUBLIC_*) to go live.
// Blank = demo mode (form shows success but does not email; no analytics calls).
// ============================================================
export const config = {
  phone: "(614) 615-2871",
  phoneHref: "tel:+16146152871",
  email: "cleaningandpaintingingeneral@gmail.com",
  emailHref: "mailto:cleaningandpaintingingeneral@gmail.com",
  // Lead copies are CC'd here on every submission (in addition to the Web3Forms account inbox).
  leadEmail: process.env.NEXT_PUBLIC_LEAD_EMAIL ?? "cleaningandpaintingingeneral@gmail.com",
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  adsId: process.env.NEXT_PUBLIC_ADS_ID ?? "",
  adsLeadLabel: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL ?? "",
  adsCallLabel: process.env.NEXT_PUBLIC_ADS_CALL_LABEL ?? "",
  googleProfileUrl:
    process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL ??
    "https://share.google/413Ccm5j02r6P5uYY",
};

export const areas = ["Worthington", "Upper Arlington", "New Albany", "Reynoldsburg", "Dublin", "Columbus", "Gahanna", "Westerville"];

type GtagFn = (...args: unknown[]) => void;
function gtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { gtag?: GtagFn };
  return typeof w.gtag === "function" ? w.gtag : null;
}

export function trackLead(service?: string) {
  const g = gtag();
  if (!g) return;
  g("event", "generate_lead", { service: service ?? "", currency: "USD", value: 1 });
  if (config.adsId && config.adsLeadLabel) g("event", "conversion", { send_to: `${config.adsId}/${config.adsLeadLabel}` });
}

export function trackCall(location?: string) {
  const g = gtag();
  if (!g) return;
  g("event", "click_to_call", { location: location ?? "link" });
  if (config.adsId && config.adsCallLabel) g("event", "conversion", { send_to: `${config.adsId}/${config.adsCallLabel}` });
}
