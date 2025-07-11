import type { Metadata } from "next";
import { Quicksand, Nunito, Open_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  title: "Κλαρκ - Ανταλλακτικά Εταιρεία",
  description: "Η εταιρεία μας προσφέρει ποιοτικά ανταλλακτικά για όλες τις ανάγκες σας.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body
        className={`${quicksand.variable} ${nunito.variable} ${openSans.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
