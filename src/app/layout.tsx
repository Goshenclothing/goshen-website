import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://goshen-clothing.com'),
  title: "Goshen Clothing | African Elegance Meets Modern Design",
  description: "Discover authentic African fashion. Premium handcrafted kimonos, traditional wear, and contemporary African designs. Visit our showroom in Accra, Ghana.",
  keywords: "African fashion, Goshen Clothing, kimonos, African prints, Ghana fashion, Accra, traditional wear",
  authors: [{ name: "Goshen Clothing" }],
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Goshen Clothing - African Elegance Meets Modern Design",
    description: "Premium handcrafted African fashion. Visit our showroom in Accra, Ghana.",
    type: "website",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Goshen Clothing Logo',
      },
    ],
  },
};

import { AdminProvider } from "@/context/AdminContext";
import { CartProvider } from "@/context/CartContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <ErrorBoundary>
          <UserAuthProvider>
            <AdminProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AdminProvider>
          </UserAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
