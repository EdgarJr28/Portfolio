"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PhotoRollModal from "@/components/ui/PhotoRollModal";
import type { FrameKey } from "@/components/three/scenes/BlogForestScene";

// Bosque 3D con marcos de fotos — carga diferida
const BlogForestCanvas = dynamic(() => import("./BlogForestCanvas"), {
  ssr: false,
  loading: () => null,
});

interface PhotoRoll {
  title: string;
  photos: string[];
}

interface BlogProps {
  /** Fotos leídas automáticamente de public/images/<carpeta> y public/easter/my_heart */
  randomsPhotos: string[];
  vibesPhotos: string[];
  naturePhotos: string[];
  heartPhotos: string[];
}

export default function Blog({
  randomsPhotos,
  vibesPhotos,
  naturePhotos,
  heartPhotos,
}: BlogProps) {
  const [activeRoll, setActiveRoll] = useState<PhotoRoll | null>(null);

  const rolls: Record<FrameKey, PhotoRoll> = {
    randoms: { title: "Randoms", photos: randomsPhotos },
    vibes: { title: "Vibes", photos: vibesPhotos },
    nature: { title: "Nature", photos: naturePhotos },
  };

  return (
    <section
      id="blog"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Bosque 3D a todo el ancho, con los marcos flotando y la luna */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <BlogForestCanvas
          covers={{
            randoms: randomsPhotos[0],
            vibes: vibesPhotos[0],
            nature: naturePhotos[0],
          }}
          onFrameClick={(key) => setActiveRoll(rolls[key])}
          onMoonClick={() =>
            setActiveRoll({ title: "My heart", photos: heartPhotos })
          }
        />
      </div>

      <PhotoRollModal
        open={!!activeRoll}
        onClose={() => setActiveRoll(null)}
        photos={activeRoll?.photos ?? []}
        title={activeRoll?.title}
      />
    </section>
  );
}
