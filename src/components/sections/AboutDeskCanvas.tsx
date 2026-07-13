"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import RoomScene from "@/components/three/scenes/RoomScene";
import { useIsMobile } from "@/components/three/useIsMobile";

/** Canvas de About: diorama de la habitación con el avatar escribiendo. */
export default function AboutDeskCanvas({
  onFrameClick,
  onNoteClick,
  onScreenClick,
}: {
  onFrameClick?: () => void;
  onNoteClick?: () => void;
  onScreenClick?: () => void;
}) {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas
      camera={isMobile
        ? { position:[2, 2, 7], fov: 30 }
        : { position: [5.2, 1.7, 9.5], fov: 45 }}
      ambient={0.75}
    >
      <RoomScene
        onFrameClick={onFrameClick}
        onNoteClick={onNoteClick}
        onScreenClick={onScreenClick}
      />
    </SceneCanvas>
  );
}
