"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import BlogForestScene, {
  type FrameKey,
} from "@/components/three/scenes/BlogForestScene";

interface BlogForestCanvasProps {
  covers: Record<FrameKey, string | undefined>;
  onFrameClick?: (key: FrameKey) => void;
  onMoonClick?: () => void;
}

/** Canvas decorativo de Blog: bosque con marcos de fotos flotando y luna. */
export default function BlogForestCanvas({
  covers,
  onFrameClick,
  onMoonClick,
}: BlogForestCanvasProps) {
  return (
    <SceneCanvas
      camera={{ position: [0, 0.75, 4.6], fov: 50 }}
      ambient={0.5}
      environment={false}
    >
      <BlogForestScene
        covers={covers}
        onFrameClick={onFrameClick}
        onMoonClick={onMoonClick}
      />
    </SceneCanvas>
  );
}
