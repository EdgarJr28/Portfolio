"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faConnectdevelop } from "@fortawesome/free-brands-svg-icons";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#spotify", label: "Music" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Detectar sección activa con IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Cerrar menú mobile al redimensionar
  useEffect(() => {
    const close = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1rem, 4vw, 2.5rem)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <motion.a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#hero");
          }}
          whileHover="hover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#f0f0f0",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          <motion.span
            variants={{ hover: { rotate: 360 } }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ display: "flex" }}
          >
            <FontAwesomeIcon icon={faConnectdevelop} width={22} height={22} />
          </motion.span>
          EdDev
        </motion.a>

        {/* Desktop links */}
        <div
          className="hidden md:flex"
          style={{ gap: "2.5rem", alignItems: "center" }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(href);
                }}
                style={{
                  position: "relative",
                  color: isActive
                    ? "#f0f0f0"
                    : "rgba(240,240,240,0.45)",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  paddingBottom: "3px",
                  letterSpacing: "0.03em",
                }}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: "#f0f0f0",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            background: "none",
            border: "none",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                menuOpen
                  ? i === 0
                    ? { rotate: 45, y: 10 }
                    : i === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -10 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.2 }}
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "#f0f0f0",
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              background: "rgba(10,10,10,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              padding: "2rem clamp(1rem, 4vw, 2.5rem)",
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              zIndex: 99,
            }}
          >
            {NAV_LINKS.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(href);
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  color: "#f0f0f0",
                  fontSize: "1.5rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
