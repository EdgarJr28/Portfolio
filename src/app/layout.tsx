import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Layouts/navbar/Navbar.component";
import Head from "next/head";
import Favicon from '/public/dev.ico';
import Footer from "./Layouts/footer/Footer";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "@Ed's Portfolio",
  icons: [{ rel: 'icon', url: Favicon.src }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description ?? ""} />
        <title>{String(metadata.title ?? "")}</title>
      </Head>
      <body className="dark:bg-dark-100">
        <nav>
          <Navbar />
        </nav>
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
