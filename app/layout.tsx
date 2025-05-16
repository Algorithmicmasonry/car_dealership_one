import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Footer, Navbar } from "@/components/landing-page";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Example weights, adjust as needed
  variable: "--font-poppins",
  display: "swap", // or 'block'
});

export const metadata = {
  title: "Car Hub",
  description:
    "Discover high quality reliable new and foreign used vehiles at great prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}  antialiased relative`}>
        <main className="flex min-h-screen flex-col bg-background text-foreground">
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </main>
      </body>
    </html>
  );
}
