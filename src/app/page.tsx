import Image from "next/image";
import Home from "./Layouts/home/Home";
import Footer from "./Layouts/footer/Footer";

export default function Index() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div>
          <Home />
        </div>
      </main>
    </>
  );
}
