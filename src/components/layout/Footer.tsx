import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSquareXTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const SOCIALS = [
  {
    icon: faGithub,
    href: "https://github.com/EdgarJr28",
    label: "GitHub",
  },
  {
    icon: faLinkedin,
    href: "https://linkedin.com/in/edgar-maldonado-5619171a0",
    label: "LinkedIn",
  },
  {
    icon: faSquareXTwitter,
    href: "https://x.com/ed__28",
    label: "X (Twitter)",
  },
  {
    icon: faInstagram,
    href: "https://instagram.com/ed__2898",
    label: "Instagram",
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem clamp(1rem, 4vw, 2.5rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          fontWeight: 300,
          color: "rgba(240,240,240,0.3)",
        }}
      >
        Ed Maldonado © 2026
      </p>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        {SOCIALS.map(({ icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{
              color: "rgba(240,240,240,0.35)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={icon} width={18} height={18} />
          </a>
        ))}
      </div>
    </footer>
  );
}
