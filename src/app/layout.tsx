import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { LangProvider } from "@/context/LangContext";
import { Analytics } from "@vercel/analytics/react";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Edgar Maldonado — Developer",
  description:
    "Frontend developer, construyendo interfaces rápidas, accesibles y visualmente memorables.",
  icons: [{ rel: "icon", url: "/dev.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${syne.variable} ${inter.variable}`}>
      <body>
        <LangProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navbar />
            {children}
            <Footer />
            <Analytics />
          </SmoothScrollProvider>
        </LangProvider>
      </body>
    </html>
  );
}
