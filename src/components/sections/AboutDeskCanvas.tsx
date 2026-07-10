"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import RoomScene from "@/components/three/scenes/RoomScene";

/** Canvas de About: diorama de la habitación con el avatar escribiendo. */
export default function AboutDeskCanvas({
  onFrameClick,
  onNoteClick,
}: {
  onFrameClick?: () => void;
  onNoteClick?: () => void;
}) {
  return (
    <SceneCanvas
      camera={{
        position: [5.2, 1.7, 9.5],
        fov: 45,
      }}
      ambient={0.75}
    >
      <RoomScene onFrameClick={onFrameClick} onNoteClick={onNoteClick} />
    </SceneCanvas>
  );
}
