interface SectionTitleProps {
  number: string;
  title: string;
}

export default function SectionTitle({ number, title }: SectionTitleProps) {
  return (
    <div style={{ position: "relative", marginBottom: "5rem" }}>
      {/* Número decorativo de fondo */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-1.5rem",
          left: "-0.25rem",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(5rem, 16vw, 11rem)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.02em",
        }}
      >
        {number}
      </span>
      <h2
        style={{
          position: "relative",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          fontWeight: 700,
          color: "#f0f0f0",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
    </div>
  );
}
