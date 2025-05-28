import { appName } from "@/constants";
import type { Metadata } from "next";
import "./globals.css";

import { Rethink_Sans } from "next/font/google";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: appName,
  description:
    "Discover high quality reliable new and foreign used vehicles at great prices",
  metadataBase: new URL("https://car-dealership-one-seven.vercel.app"),

  openGraph: {
    title: "Find the Best Premium Cars Online",
    description:
      "Discover high quality reliable new and foreign used vehicles at great prices",
    url: "https://car-dealership-one-seven.vercel.app",
    siteName: appName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/car-dealership.webp",
        width: 1200,
        height: 630,
        alt: "Durie Autos vehicle showcase",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Find the Best Premium Cars Online",
    description:
      "Discover high quality reliable new and foreign used vehicles at great prices",
    creator: "@yourtwitterhandle",
    images: ["https://car-dealership-one-seven.vercel.app/car-dealership.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rethinkSans.className} antialiased relative`}>
        {children}
      </body>
    </html>
  );
}
