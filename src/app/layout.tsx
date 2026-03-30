import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LiberatorGroup — Empowering Freedom & Purpose",
    template: "%s | LiberatorGroup",
  },
  description:
    "LiberatorGroup frees capable people from self-limiting beliefs and golden handcuffs — so they can build a life they don't want to retire from.",
  openGraph: {
    type: "website",
    siteName: "LiberatorGroup",
    title: "LiberatorGroup — Empowering Freedom & Purpose",
    description:
      "LiberatorGroup frees capable people from self-limiting beliefs and golden handcuffs — so they can build a life they don't want to retire from.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LiberatorGroup — Empowering Freedom & Purpose",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiberatorGroup — Empowering Freedom & Purpose",
    description:
      "LiberatorGroup frees capable people from self-limiting beliefs and golden handcuffs — so they can build a life they don't want to retire from.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
