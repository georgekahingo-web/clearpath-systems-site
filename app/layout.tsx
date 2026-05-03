import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clearpathsystems.dev"),
  openGraph: {
    title: "Clearpath Systems",
    description:
      "Turn Every Customer Interaction Into a Booking — websites, missed call text-back, and ad management for local businesses.",
    url: "https://clearpathsystems.dev",
    siteName: "Clearpath Systems",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clearpath Systems — A Clear Path to Every Customer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clearpath Systems",
    description:
      "Turn Every Customer Interaction Into a Booking — websites, missed call text-back, and ad management for local businesses.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
