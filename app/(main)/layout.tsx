import { ContactUs, Footer, Navbar } from "@/components/landing-page";
import { Toaster } from "@/components/ui/toaster";
import { defaultContent } from "@/constants";
import { fetchContentData } from "@/server actions/content.actions";
import React from "react";



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
