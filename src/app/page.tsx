'use client'
import Image from "next/image";
import Home from "./Layouts/home/Home";
import Footer from "./Layouts/footer/Footer";
import { CtxProvider } from "./context/context";

export default function Index() {
  return (
    <>
      <CtxProvider>
        <main className="flex min-h-screen flex-col items-center">
          <div>
            <Home />
          </div>
        </main>
      </CtxProvider>
    </>
  );
}
