"use client";

export default function FlashGame({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      title="Game"
      allowFullScreen
    />
  );
}
