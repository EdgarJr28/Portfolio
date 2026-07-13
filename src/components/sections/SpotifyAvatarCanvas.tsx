"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import MusicAvatarScene from "@/components/three/scenes/MusicAvatarScene";
import { useIsMobile } from "@/components/three/useIsMobile";

/** Canvas del widget de Spotify: avatar quieto o bailando según si suena música. */
export default function SpotifyAvatarCanvas({ playing }: { playing: boolean }) {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas
      camera={isMobile
        ? { position: [0, 1, 5.2], fov: 42 }
        : { position: [0, 1, 2.9], fov: 40 }}
      ambient={0.8}
    >
      <MusicAvatarScene playing={playing} />
    </SceneCanvas>
  );
}
