import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";

// Demo typography, self-hosted via next/font: Inter (variable weights,
// covers the demo's 450) + Noto Sans Bengali for the Bangla greeting.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500"],
  variable: "--font-bengali",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DEFAULT_SETTINGS.seoTitle,
    template: "%s",
  },
  description: DEFAULT_SETTINGS.seoDescription,
  openGraph: {
    type: "website",
    siteName: DEFAULT_SETTINGS.siteName,
    title: DEFAULT_SETTINGS.seoTitle,
    description: DEFAULT_SETTINGS.seoDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SETTINGS.seoTitle,
    description: DEFAULT_SETTINGS.seoDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme bootstrap: resolves System/Light/Dark from localStorage
            ("pf-theme") and sets <html data-theme> before first paint, so
            there is no flash of the wrong theme and no hydration mismatch
            (React never renders this attribute). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("pf-theme");if(p!=="light"&&p!=="dark")p="system";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";document.documentElement.dataset.themePref=p;}catch(e){document.documentElement.dataset.theme="light";}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${bengali.variable}`}>{children}</body>
    </html>
  );
}
