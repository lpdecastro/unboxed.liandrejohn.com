import "../scss/main.scss";
import { GoogleAnalytics } from "@next/third-parties/google";
import BootstrapClient from "@/components/BootstrapClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const title = "Unboxed — Board Game Rentals in Metro Manila";
const description =
  "Rent board games from a small personal collection in Metro Manila. Pick your dates, pay via GCash, and get games delivered and returned through Lalamove.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s — Unboxed",
    default: title,
  },
  description,
  icons: {
    icon: "/img/favicon.png",
    apple: "/img/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Unboxed",
    locale: "en_PH",
    type: "website",
    images: ["/img/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="d-flex flex-column min-vh-100">
        {children}
        <BootstrapClient />
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
