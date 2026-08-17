export const dynamic = "force-dynamic";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
// TEMP: resto de secciones deshabilitadas, se reactivan una por una — no borrar.
 import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import SpotifyWidget from "@/components/sections/SpotifyWidget";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import { getFolderImages, withCoverFirst } from "@/lib/gallery";

export default function Home() {
  // Las carpetas se leen del filesystem: soltar fotos ahí alcanza, no hace
  // falta tocar código. Las "portadas" solo definen cuál va primero.
  const randomsPhotos = withCoverFirst(
    getFolderImages("images/randoms"),
    "IMG_4819.JPEG"
  );
  const vibesPhotos = withCoverFirst(
    getFolderImages("images/vibes"),
    "62E1F704-C8DB-46EF-BD04-F12C16346F18.PNG"
  );
  const naturePhotos = withCoverFirst(
    getFolderImages("images/nature"),
    "IMG_5185.JPEG"
  );
  const heartPhotos = getFolderImages("easter/my_heart");

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <SpotifyWidget />
      <Blog
        randomsPhotos={randomsPhotos}
        vibesPhotos={vibesPhotos}
        naturePhotos={naturePhotos}
        heartPhotos={heartPhotos}
      />
      <Contact />
    </main>
  );
}
