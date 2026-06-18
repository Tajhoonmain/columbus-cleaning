import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-serif", subsets: ["latin"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  title: "House & Commercial Cleaning in Columbus, OH | Free Quote — Columbus Cleaning Services",
  description:
    "Professional residential & commercial cleaning in Columbus, Ohio. Fast, reliable, insured. Open 24 hours. Call (614) 615-2871 for a free quote.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='5' fill='%230a66c2'/%3E%3Cpath d='M5 18c3-1 5-3 7-7 1 2 2 3 4 4-1 3-3 4-6 5-2 0-4-1-5-2z' fill='white'/%3E%3C/svg%3E",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Columbus Cleaning Services",
  legalName: "In General Cleaning And Painting Guys LLC",
  telephone: "+16146152871",
  areaServed: ["Columbus OH", "Dublin OH", "Westerville OH", "Gahanna OH", "Hilliard OH", "Reynoldsburg OH"],
  address: { "@type": "PostalAddress", addressLocality: "Columbus", addressRegion: "OH", addressCountry: "US" },
  description: "Residential and commercial cleaning services in Columbus, Ohio and surrounding areas.",
  openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "00:00", closes: "23:59" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "1" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const adsId = process.env.NEXT_PUBLIC_ADS_ID;
  const firstId = gaId || adsId;

  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {firstId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${firstId}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
              __html:
                `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());` +
                (gaId ? `gtag('config','${gaId}');` : "") +
                (adsId ? `gtag('config','${adsId}');` : ""),
            }} />
          </>
        )}
        {children}
      </body>
    </html>
  );
}
