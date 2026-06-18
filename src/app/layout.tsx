import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Layouts/navbar/Navbar.component";
import Footer from "./Layouts/footer/Footer";
import { CtxProvider } from "./context/context";
import { Analytics } from "@vercel/analytics/react"
import ClientOnlyWrapper from "./components/Loaders/ClientOnlyWrapper";

export const metadata: Metadata = {
  title: "EdDev Portfolio / Innovative Developer Projects",
  description: "Welcome to EdDev Portfolio - Showcasing Innovative Web Development Projects. Explore my latest designs, coding skills and professional tech insights.",
  icons: [
    { rel: 'icon', url: '/dev.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/dev.ico' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-dark-100">
        <CtxProvider>
          <ClientOnlyWrapper>
            <nav>
              <Navbar />
            </nav>
            <div>
              {children}
              <Analytics />
            </div>
            <Footer />
          </ClientOnlyWrapper>
        </CtxProvider>
      </body>
    </html>
  );
}
