import type { CSSProperties } from "react";

const BASE_STYLE: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  padding: "0.75rem 0",
  color: "#f0f0f0",
  fontFamily: "var(--font-body)",
  fontSize: "0.9rem",
  fontWeight: 300,
  outline: "none",
  boxSizing: "border-box",
};

interface TextFieldProps {
  as?: "input" | "textarea";
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  style?: CSSProperties;
}

/** Input/textarea de línea (sin borde propio, subrayado), usado en formularios del sitio. */
export default function TextField({
  as = "input",
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required,
  rows,
  style,
}: TextFieldProps) {
  if (as === "textarea") {
    return (
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows ?? 5}
        style={{ ...BASE_STYLE, resize: "none", ...style }}
      />
    );
  }

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={{ ...BASE_STYLE, ...style }}
    />
  );
}
