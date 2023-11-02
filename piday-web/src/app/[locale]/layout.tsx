import ThemeRegistry from "@src/components/ThemeRegistry/ThemeRegistry";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

import Footer from "./_components/layout/Footer";
import Header from "./_components/layout/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piday",
  description: "Piday app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-20">
          <ThemeRegistry>{children}</ThemeRegistry>
        </main>
        <Footer />
      </body>
    </html>
  );
}
