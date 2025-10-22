// src/app/layout.js
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

export const metadata = {
  title: "Keechi - Book Salons in Dhaka",
  description: "Discover and book trusted salons and parlours in Dhaka. Professional stylists, transparent pricing, instant booking.",
  icons: {
    icon: "/logo/keechi-logo.svg",
    shortcut: "/logo/keechi-logo.svg",
    apple: "/logo/keechi-logo.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-charcoal-800">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
