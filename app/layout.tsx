import type { Metadata } from "next";
import "./globals.css";
import { ContactUs, Footer, Navbar } from "@/components/landing-page";
import { Toaster } from "@/components/ui/toaster";
import { appName } from "@/constants";

import { Rethink_Sans } from "next/font/google";

const rethinkSans = Rethink_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify weights you need
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car Hub",
  description:
    "Discover high quality reliable new and foreign used vehiles at great prices",

  // opengraph meta data
  openGraph: {
    title: "Find the Best Premium cars online",
    description:
      "Discover high quality reliable new and foreign used vehiles at great prices",
    url: "https://car-dealership-one-seven.vercel.app",
    siteName: "Carhub.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/car dealership.webp", // Note: URL has spaces which might cause issues
        width: 1200,
        height: 630,
        alt: "Site preview image",
      },
    ],
  },

  // Twitter specific
  twitter: {
    card: "summary_large_image", // Fix: Use standard Twitter card type
    title: 'Find the Best Premium cars online',
    description: 'At carhub.com we provide you with premium cars that are friendly to your pockey',
    creator: '@y',
    images: ['https://car-dealership-one-seven.vercel.app/car dealership.webp'], // URL has spaces
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
        <main className="flex min-h-screen flex-col bg-background text-foreground">
          <Navbar />
          {children}
          <ContactUs />
          <Footer />
          <Toaster />
        </main>
      </body>
    </html>
  );
}