import { ContactUs, Footer, Navbar } from "@/components/landing-page";
import { Toaster } from "@/components/ui/toaster";
import { appName, defaultContent } from "@/constants";
import { fetchContentData } from "@/server actions/content.actions";
import { Metadata } from "next";
import React from "react";

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



const MainLayout = async  ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const content = await fetchContentData() || defaultContent
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      {children}
      <ContactUs getInTouch={content.getInTouch} />
      <Footer />
      <Toaster />
    </main>
  );
};

export default MainLayout;
