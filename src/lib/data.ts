// ─── Types ───────────────────────────────────────────────────────────────────

export type SkillCategory = "Frontend" | "Herramientas" | "Aprendiendo";

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface Project {
  title: string;
  description: string;
  stack: string[];
  demo?: string;
  repo?: string;
  image?: string;
}

export interface BlogPost {
  title: string;
  date: string;
  description: string;
  category: string;
  slug: string;
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills: Skill[] = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "HTML5", category: "Frontend" },
  { name: "CSS3", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Three.js", category: "Frontend" },
  { name: "Node.js", category: "Herramientas" },
  { name: "Git", category: "Herramientas" },
  { name: "Docker", category: "Herramientas" },
  { name: "AWS", category: "Herramientas" },
  { name: "SQL", category: "Herramientas" },
  { name: "REST APIs", category: "Herramientas" },
  { name: "Angular", category: "Herramientas" },
  { name: "WebGL", category: "Aprendiendo" },
  { name: "Rust", category: "Aprendiendo" },
  { name: "WebAssembly", category: "Aprendiendo" },
];

// ─── Experience ───────────────────────────────────────────────────────────────

export const experiences: ExperienceEntry[] = [
  {
    company: "Ludycom",
    role: "Developer",
    period: "2024 — Presente",
    bullets: [
      "Desarrollo de aplicaciones web con React y Next.js",
      "Implementación y consumo de APIs REST con Node.js",
      "Colaboración en equipo bajo metodologías ágiles",
    ],
  },
  {
    company: "Intra Technology",
    role: "Developer",
    period: "2022 — 2023",
    bullets: [
      "Desarrollo de interfaces frontend con React",
      "Integración de servicios backend y gestión de estado",
      "Optimización de rendimiento y accesibilidad web",
    ],
  },
  {
    company: "Freelance",
    role: "Developer Freelancer",
    period: "2021 — 2022",
    bullets: [
      "Desarrollo de proyectos web para clientes de distintos sectores",
      "Diseño e implementación de interfaces de usuario responsive",
    ],
  },
  {
    company: "Soluciona Ingeniería SAS",
    role: "Jr Developer",
    period: "2019 — 2020",
    bullets: [
      "Desarrollo con Angular y Node.js en entorno profesional",
      "Participación en ciclo completo de desarrollo de software",
    ],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    title: "M3DAR",
    description:
      "Aplicación móvil para visualización de dispositivos médicos en Realidad Aumentada, con modelos 3D interactivos desde múltiples ángulos.",
    stack: ["Angular", "Node.js", "Unreal Engine"],
    demo: "https://www.m3d-ar.com/#/home",
  },
  {
    title: "Sports App",
    description:
      "Plataforma de reserva de instalaciones deportivas con autenticación por roles, construida como proyecto académico.",
    stack: ["React", "Firebase", "Firestore"],
    demo: "https://sport-page-murex.vercel.app/",
  },
  {
    title: "Belena",
    description:
      "App en desarrollo para conectar anfitriones con espacio disponible y huéspedes buscando alojamiento temporal.",
    stack: ["React", "Node.js"],
  },
  {
    title: "Black Ops",
    description:
      "Recreación de página de videojuego con tecnologías 3D, HTML y CSS. Proyecto personal de exploración técnica.",
    stack: ["HTML", "CSS", "JavaScript", "Three.js"],
    demo: "https://black-ops-t2.vercel.app/index.html",
  },
  {
    title: "API Rating Videos",
    description:
      "REST API con manejo de roles oAuth que simula una videoteca usando Amazon RDS. Paths públicos y privados con JWT.",
    stack: ["Node.js", "AWS RDS", "JWT", "REST"],
    demo: "https://test-production-2d4b.up.railway.app/docs",
  },
  {
    title: "Backend Projects",
    description:
      "Colección de proyectos backend con SQL/NoSQL, WebSockets y APIs REST. Exploración de arquitecturas y patrones.",
    stack: ["Node.js", "SQL", "NoSQL", "WebSocket"],
    repo: "https://github.com/EdgarJr28",
  },
];

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    title: "Construyendo interfaces con React 19",
    date: "2026-01-15",
    description:
      "Las nuevas capacidades de React 19 y cómo impactan el flujo de desarrollo: Actions, use(), y mejoras en Suspense.",
    category: "React",
    slug: "react-19-interfaces",
  },
  {
    title: "Tailwind CSS v4: la configuración en CSS",
    date: "2026-02-10",
    description:
      "Repaso a los cambios más importantes de Tailwind v4: adiós a tailwind.config.js, hola @theme en CSS puro.",
    category: "CSS",
    slug: "tailwind-v4-config",
  },
  {
    title: "Three.js y React: escenas 3D en el browser",
    date: "2026-03-05",
    description:
      "Cómo integrar Three.js con React usando @react-three/fiber para crear experiencias visuales únicas sin dolor.",
    category: "3D",
    slug: "threejs-react-fiber",
  },
];
