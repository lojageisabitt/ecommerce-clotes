import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from '@/context/CartContext';
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loja de Roupas CM Teixeiras",
  authors: [
    {
      name: "CM Teixeiras",
      url: "https://lojateixeiras.com",
    },  ],
  keywords: [
    "loja de roupas",
    "roupas personalizadas",
    "eventos",
    "empresas",
    "moda",
    "vestuário",
    "roupas sob medida",
  ],
  description: "Loja de roupas com soluções personalizadas para eventos e empresas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" reverseOrder={false} />
         <CartProvider>
          <Header />
          {children}
          <Footer />
          </CartProvider>
      </body>
    </html>
  );
}
