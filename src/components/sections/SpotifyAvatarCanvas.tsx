"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import MusicAvatarScene from "@/components/three/scenes/MusicAvatarScene";

/** Canvas del widget de Spotify: avatar quieto o bailando según si suena música. */
export default function SpotifyAvatarCanvas({ playing }: { playing: boolean }) {
  return (
    <SceneCanvas camera={{ position: [0, 1, 2.9], fov: 40 }} ambient={0.8}>
      <MusicAvatarScene playing={playing} />
    </SceneCanvas>
  );
}
