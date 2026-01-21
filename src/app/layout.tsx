import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Goshen Clothing | African Elegance Meets Modern Design",
  description: "Discover authentic African fashion. Premium handcrafted kimonos, traditional wear, and contemporary African designs. Visit our showroom in Accra, Ghana.",
  keywords: "African fashion, Goshen Clothing, kimonos, African prints, Ghana fashion, Accra, traditional wear",
  authors: [{ name: "Goshen Clothing" }],
  openGraph: {
    title: "Goshen Clothing - African Elegance Meets Modern Design",
    description: "Premium handcrafted African fashion. Visit our showroom in Accra, Ghana.",
    type: "website",
  },
};

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
        {children}
      </body>
    </html>
  );
}
