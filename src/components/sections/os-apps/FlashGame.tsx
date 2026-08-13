"use client";

export default function FlashGame({ swfPath }: { swfPath: string }) {
  return (
    <iframe
      src={`/ruffle/player.html?swf=${encodeURIComponent(swfPath)}`}
      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      title="Flash Game"
      allowFullScreen
    />
  );
}
