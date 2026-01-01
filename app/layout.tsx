import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gotempcover.co.uk"),
  title: {
    default: "GoTempCover | Temporary Car Insurance, Simple & Fast",
    template: "%s | GoTempCover",
  },
  description:
    "Buy temporary car insurance in minutes. Pick exact start and end times, view documents instantly, and manage your policy online.",
  applicationName: "GoTempCover",
  authors: [{ name: "GoTempCover" }],
  creator: "GoTempCover",
  publisher: "GoTempCover",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://gotempcover.co.uk",
    title: "GoTempCover | Temporary Car Insurance, Simple & Fast",
    description:
      "Choose exact cover times, get documents instantly, and manage your policy online.",
    siteName: "GoTempCover",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoTempCover | Temporary Car Insurance, Simple & Fast",
    description:
      "Choose exact cover times, get documents instantly, and manage your policy online.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1220",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-wash">
          {/* Skip link for keyboard users */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow"
          >
            Skip to content
          </a>

          <Header />

          {/* Main */}
          <main id="content" role="main" className="relative">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
