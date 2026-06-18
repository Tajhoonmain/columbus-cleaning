"use client";

import React, { useState } from "react";
import { useT } from "@/components/lang-context";
import { config, trackLead } from "@/lib/site";

const SERVICE_KEYS = ["svc.house", "svc.deep", "svc.move", "svc.office", "svc.post", "svc.uph", "svc.other"];

export function EstimateForm() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.botcheck) return;
    trackLead(data.service);

    const key = config.web3formsKey;
    const live = key && !key.startsWith("YOUR_");
    if (!live) {
      console.warn("[DEMO MODE] No NEXT_PUBLIC_WEB3FORMS_KEY set — lead NOT emailed.", data);
      setSent(true);
      return;
    }
    setBusy(true);
    try {
      const payload = new FormData(form);
      payload.append("access_key", key);
      payload.append("from_name", "Columbus Cleaning Website");
      payload.append("subject", `New Cleaning Estimate — ${data.service || "Website"}${data.name ? ` (${data.name})` : ""}`);
      if (config.leadEmail) payload.append("cc", config.leadEmail);
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
      const json = await res.json();
      if (json?.success) setSent(true);
      else throw new Error(json?.message || "failed");
    } catch (err) {
      console.error("Lead submission failed:", err);
      alert(t("f.error"));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-md bg-card p-8 text-center font-medium text-leaf shadow-xl">
        {t("f.ok")}
      </div>
    );
  }

  const label = "block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground";
  const field =
    "w-full border-0 border-b border-sand bg-transparent px-0 py-2.5 text-foreground outline-none transition focus:border-forest placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={onSubmit} className="rounded-md bg-card p-7 shadow-xl md:p-8">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-name">{t("f.fullname")}</label>
          <input id="c-name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="c-phone">{t("f.phone")}</label>
          <input id="c-phone" name="phone" type="tel" required autoComplete="tel" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="c-email">{t("f.email")}</label>
          <input id="c-email" name="email" type="email" autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="c-address">{t("f.address")}</label>
          <input id="c-address" name="address" autoComplete="street-address" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="c-service">{t("f.type")}</label>
          <select id="c-service" name="service" required defaultValue="" className={field}>
            <option value="" disabled>{t("f.typePh")}</option>
            {SERVICE_KEYS.map((k) => (
              <option key={k} value={t(k)}>{t(k)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="c-bedbath">{t("f.bedbath")}</label>
          <input id="c-bedbath" name="bedrooms_bathrooms" placeholder="3 / 2" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="c-date">{t("f.date")}</label>
          <input id="c-date" name="date" type="date" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="c-note">{t("f.note")}</label>
          <textarea id="c-note" name="message" rows={2} className={`${field} resize-none`} />
        </div>
      </div>
      <button type="submit" disabled={busy} className="mt-8 w-full rounded-md bg-forest px-6 py-4 text-sm font-semibold uppercase tracking-wide text-cream transition hover:opacity-90 disabled:opacity-70">
        {busy ? t("f.sending") : t("f.submit")}
      </button>
    </form>
  );
}
