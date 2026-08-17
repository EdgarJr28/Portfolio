import type { Lang } from "@/context/LangContext";

export const t = {
  // ─── Navbar ────────────────────────────────────────────────────────────────
  nav: {
    about:      { es: "Sobre mí",    en: "About" },
    skills:     { es: "Habilidades", en: "Skills" },
    experience: { es: "Experiencia", en: "Experience" },
    projects:   { es: "Proyectos",   en: "Projects" },
    music:      { es: "Música",      en: "Music" },
    contact:    { es: "Contacto",    en: "Contact" },
  },

  // ─── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    tag:        { es: "Developer",        en: "Developer" },
    cta_work:   { es: "Ver proyectos",    en: "View projects" },
    cta_contact:{ es: "Contactar",        en: "Contact" },
    scroll:     { es: "Scroll",           en: "Scroll" },
  },

  // ─── About ─────────────────────────────────────────────────────────────────
  about: {
    bio: {
      es: "Frontend developer con pasion por construir interfaces rapidas, accesibles y visualmente memorables. Especializado en React y Next.js, con foco en rendimiento y experiencia de usuario.",
      en: "Frontend developer passionate about building fast, accessible, and visually memorable interfaces. Specialized in React and Next.js, with a focus on performance and user experience.",
    },
    location_label: { es: "Ubicacion",      en: "Location" },
    location_value: { es: "Barranquilla, Colombia", en: "Barranquilla, Colombia" },
    email_label:    { es: "Email",           en: "Email" },
    exp_label:      { es: "Experiencia",     en: "Experience" },
    exp_value:      { es: "5+ anos",         en: "5+ years" },
    avail_label:    { es: "Disponibilidad",  en: "Availability" },
    avail_value:    { es: "Abierto a oportunidades", en: "Open to opportunities" },
  },

  // ─── Skills ────────────────────────────────────────────────────────────────
  skills: {
    learning: { es: "Aprendiendo", en: "Learning" },
  },

  // ─── Experience ────────────────────────────────────────────────────────────
  experience: {
    present: { es: "Presente", en: "Present" },
    entries: {
      es: [
        {
          company: "Ludycom",
          role: "Developer",
          period: "2024 — Presente",
          bullets: [
            "Desarrollo de aplicaciones web con React y Next.js",
            "Implementacion y consumo de APIs REST con Node.js",
            "Colaboracion en equipo bajo metodologias agiles",
          ],
        },
        {
          company: "Intra Technology",
          role: "Developer",
          period: "2022 — 2023",
          bullets: [
            "Desarrollo de interfaces frontend con React",
            "Integracion de servicios backend y gestion de estado",
            "Optimizacion de rendimiento y accesibilidad web",
          ],
        },
        {
          company: "Freelance",
          role: "Developer Freelancer",
          period: "2021 — 2022",
          bullets: [
            "Desarrollo de proyectos web para clientes de distintos sectores",
            "Diseno e implementacion de interfaces de usuario responsive",
          ],
        },
        {
          company: "Soluciona Ingenieria SAS",
          role: "Jr Developer",
          period: "2019 — 2020",
          bullets: [
            "Desarrollo con Angular y Node.js en entorno profesional",
            "Participacion en ciclo completo de desarrollo de software",
          ],
        },
      ],
      en: [
        {
          company: "Ludycom",
          role: "Developer",
          period: "2024 — Present",
          bullets: [
            "Web application development with React and Next.js",
            "Implementation and consumption of REST APIs with Node.js",
            "Team collaboration under agile methodologies",
          ],
        },
        {
          company: "Intra Technology",
          role: "Developer",
          period: "2022 — 2023",
          bullets: [
            "Frontend interface development with React",
            "Backend service integration and state management",
            "Performance optimization and web accessibility",
          ],
        },
        {
          company: "Freelance",
          role: "Freelance Developer",
          period: "2021 — 2022",
          bullets: [
            "Web project development for clients across various industries",
            "Design and implementation of responsive user interfaces",
          ],
        },
        {
          company: "Soluciona Ingenieria SAS",
          role: "Jr Developer",
          period: "2019 — 2020",
          bullets: [
            "Development with Angular and Node.js in a professional environment",
            "Participation in the full software development lifecycle",
          ],
        },
      ],
    },
  },

  // ─── Education ─────────────────────────────────────────────────────────────
  education: {
    entries: {
      es: [
        {
          title: "Ingeniero de Sistemas",
          institution: "Universidad de la Costa CUC",
          period: "2021 — Presente",
        },
        {
          title: "Tecnologías de Software para la Industria 4.0",
          institution: "Universidad de la Costa CUC",
          period: "Mayo 2025",
        },
        {
          title: "Analista de Sistemas",
          institution: "SENA",
          period: "2020",
        },
      ],
      en: [
        {
          title: "Systems Engineer",
          institution: "Universidad de la Costa CUC",
          period: "2021 — Present",
        },
        {
          title: "Software Technologies for Industry 4.0",
          institution: "Universidad de la Costa CUC",
          period: "May 2025",
        },
        {
          title: "Systems Analyst",
          institution: "SENA",
          period: "2020",
        },
      ],
    },
  },

  // ─── Projects ──────────────────────────────────────────────────────────────
  projects: {
    entries: {
      es: [
        {
          title: "M3DAR",
          description: "Aplicacion movil para visualizacion de dispositivos medicos en Realidad Aumentada, con modelos 3D interactivos desde multiples angulos.",
          stack: ["Angular", "Node.js", "Unreal Engine"],
          demo: "https://www.m3d-ar.com/#/home",
          image: "/images/projects_galery/m3dar.png",
        },
        {
          title: "Sports App",
          description: "Plataforma de reserva de instalaciones deportivas con autenticacion por roles, construida como proyecto academico.",
          stack: ["React", "Firebase", "Firestore"],
          demo: "https://sport-page-murex.vercel.app/",
          image: "/images/projects_galery/sportweb.png",
        },
        {
          title: "Belena",
          description: "App en desarrollo para conectar anfitriones con espacio disponible y huespedes buscando alojamiento temporal.",
          stack: ["React", "Node.js"],
          image: "/images/projects_galery/belena.png",
        },
        {
          title: "Black Ops",
          description: "Recreacion de pagina de videojuego con tecnologias 3D, HTML y CSS. Proyecto personal de exploracion tecnica.",
          stack: ["HTML", "CSS", "JavaScript", "Three.js"],
          demo: "https://black-ops-t2.vercel.app/index.html",
          image: "/images/projects_galery/blackops.png",
        },
        {
          title: "API Rating Videos",
          description: "REST API con manejo de roles oAuth que simula una videoteca usando Amazon RDS. Paths publicos y privados con JWT.",
          stack: ["Node.js", "AWS RDS", "JWT", "REST"],
          demo: "https://test-production-2d4b.up.railway.app/docs",
          image: "/images/projects_galery/APIvideo.png",
        },
        {
          title: "Backend Projects",
          description: "Coleccion de proyectos backend con SQL/NoSQL, WebSockets y APIs REST. Exploracion de arquitecturas y patrones.",
          stack: ["Node.js", "SQL", "NoSQL", "WebSocket"],
          repo: "https://github.com/EdgarJr28",
          image: "/images/projects_galery/backend-development.png",
        },
      ],
      en: [
        {
          title: "M3DAR",
          description: "Mobile app for visualizing medical devices in Augmented Reality, with interactive 3D models from multiple angles.",
          stack: ["Angular", "Node.js", "Unreal Engine"],
          demo: "https://www.m3d-ar.com/#/home",
          image: "/images/projects_galery/m3dar.png",
        },
        {
          title: "Sports App",
          description: "Sports facility booking platform with role-based authentication, built as an academic project.",
          stack: ["React", "Firebase", "Firestore"],
          demo: "https://sport-page-murex.vercel.app/",
          image: "/images/projects_galery/sportweb.png",
        },
        {
          title: "Belena",
          description: "App in development to connect hosts with available space and guests looking for temporary accommodation.",
          stack: ["React", "Node.js"],
          image: "/images/projects_galery/belena.png",
        },
        {
          title: "Black Ops",
          description: "Video game page recreation using 3D technologies, HTML and CSS. Personal technical exploration project.",
          stack: ["HTML", "CSS", "JavaScript", "Three.js"],
          demo: "https://black-ops-t2.vercel.app/index.html",
          image: "/images/projects_galery/blackops.png",
        },
        {
          title: "API Rating Videos",
          description: "REST API with oAuth role management simulating a video library using Amazon RDS. Public and private paths with JWT.",
          stack: ["Node.js", "AWS RDS", "JWT", "REST"],
          demo: "https://test-production-2d4b.up.railway.app/docs",
          image: "/images/projects_galery/APIvideo.png",
        },
        {
          title: "Backend Projects",
          description: "Collection of backend projects with SQL/NoSQL, WebSockets and REST APIs. Exploration of architectures and patterns.",
          stack: ["Node.js", "SQL", "NoSQL", "WebSocket"],
          repo: "https://github.com/EdgarJr28",
          image: "/images/projects_galery/backend-development.png",
        },
      ],
    },
  },

  // ─── Contact ───────────────────────────────────────────────────────────────
  contact: {
    name_placeholder:    { es: "Nombre",          en: "Name" },
    email_placeholder:   { es: "Email",            en: "Email" },
    message_placeholder: { es: "Mensaje",          en: "Message" },
    send_btn:            { es: "Enviar mensaje",   en: "Send message" },
    sending:             { es: "Enviando...",       en: "Sending..." },
    success:             { es: "Mensaje enviado",  en: "Message sent" },
    error:               { es: "Error al enviar. Intentalo de nuevo.", en: "Failed to send. Please try again." },
    captcha_required:    { es: "Completa el captcha primero.", en: "Please complete the captcha first." },
  },

  // ─── Name Easter Egg Modal ─────────────────────────────────────────────────
  nameEgg: {
    bio: {
      es: "Hola, un placer. Soy una persona alegre y vibrante, me gusta mucho la musica y el arte. Me destacan los lugares tranquilos y tengo la felicidad como motor de mi crecimiento personal.",
      en: "Hello, a pleasure. I am a cheerful and vibrant person, I really like music and art. I emphasize quiet places and I have happiness as an engine of personal growth.",
    },
    phrases_es: [
      "Desarrollando ideas, un momento...",
      "Hola, es un placer verte!",
      "Que tengas un dia lleno de positividad!",
      "Convierte ideas en realidad. A programar!",
      "Hey! Mucho gusto.",
    ],
    phrases_en: [
      "Developing ideas, a moment...",
      "Hello, it's wonderful to see you!",
      "Wishing you a day full of positivity and joy!",
      "Turn ideas into reality. Happy coding!",
      "Hey! Nice to meet you.",
    ],
  },

  // ─── MiniOS ────────────────────────────────────────────────────────────────
  os: {
    private_folder: { es: "Privado",   en: "Private" },
    photos:         { es: "Fotos",     en: "Photos" },
    images:         { es: "Imagenes",  en: "Images" },
    games_folder:   { es: "Juegos",    en: "Games" },
    contact_text:   { es: "Contacto",  en: "Contact" },
    contact_sub:    { es: "Enviame un mensaje", en: "Send me a message" },
    recent:         { es: "Recientes", en: "Recent" },
    all_programs:   { es: "Todos los programas", en: "All Programs" },
    trending:       { es: "Tendencias", en: "Trending" },
    recycle_bin:    { es: "Papelera",  en: "Recycle Bin" },
    minimize:       { es: "Minimizar", en: "Minimize" },
    maximize:       { es: "Maximizar", en: "Maximize" },
    restore:        { es: "Restaurar", en: "Restore" },
    close_win:      { es: "Cerrar ventana", en: "Close window" },
    close:          { es: "Cerrar",    en: "Close" },
    // IE toolbar buttons
    ie_back:        { es: "Atrás",     en: "Back" },
    ie_forward:     { es: "Adelante",  en: "Forward" },
    ie_stop:        { es: "Detener",   en: "Stop" },
    ie_refresh:     { es: "Actualizar", en: "Refresh" },
    ie_home:        { es: "Inicio",    en: "Home" },
    ie_search_btn:  { es: "Buscar",    en: "Search" },
    ie_favorites:   { es: "Favoritos", en: "Favorites" },
    ie_mail:        { es: "Correo",    en: "Mail" },
    ie_print:       { es: "Imprimir",  en: "Print" },
    ie_address:     { es: "Dirección", en: "Address" },
    ie_go:          { es: "Ir",        en: "Go" },
    ie_loading:     { es: "Cargando",  en: "Loading" },
    ie_ready:       { es: "Listo",     en: "Done" },
    ie_connecting:  { es: "Conectando...", en: "Connecting..." },
    // IE home page
    ie_search_web:  { es: "Buscar",    en: "Search" },
    ie_lucky:       { es: "Voy a tener suerte", en: "I'm Feeling Lucky" },
    // IE search results
    ie_your_search: { es: "Tu búsqueda —", en: "Your search —" },
    ie_no_match:    { es: "— no coincidió con ningún documento.", en: "— did not match any documents." },
    ie_suggestions: { es: "Sugerencias:", en: "Suggestions:" },
    ie_sug1:        { es: "Asegurate de que todas las palabras estén bien escritas.", en: "Make sure all words are spelled correctly." },
    ie_sug2:        { es: "Prueba con otras palabras clave.", en: "Try different keywords." },
    ie_sug3:        { es: "Prueba con palabras clave más generales.", en: "Try more general keywords." },
    // IE search tabs & top links (arrays keyed by lang)
    ie_tabs: {
      es: ["Todo", "Imágenes", "Noticias", "Videos", "Más"],
      en: ["All", "Images", "News", "Videos", "More"],
    },
    ie_top_links: {
      es: ["Correo", "Imágenes"],
      en: ["Mail", "Images"],
    },
    // IE error page
    ie_error_title: { es: "No se puede mostrar la página", en: "Page cannot be displayed" },
    ie_error_body:  { es: "La página que estás buscando no está disponible en este universo. Prueba con otra dirección de la lista, o volvé a la página de inicio.", en: "The page you are looking for is not available in this universe. Try another address or return to the home page." },
    // Photo viewer (inside IE)
    pv_prev:        { es: "Anterior",  en: "Previous" },
    pv_next:        { es: "Siguiente", en: "Next" },
    pv_of:          { es: "de",        en: "of" },
    pv_no_comments: { es: "Sin comentarios aún.", en: "No comments yet." },
    pv_likes:       { es: "A 12 personas les gusta esto", en: "12 people like this" },
    pv_like:        { es: "Me gusta",  en: "Like" },
    pv_comment:     { es: "Comentar",  en: "Comment" },
    // Games folder
    dbl_open:       { es: "doble click para abrir", en: "double-click to open" },
    obj_singular:   { es: "objeto",    en: "object" },
    obj_plural:     { es: "objetos",   en: "objects" },
    // Game genres
    genre_racing:   { es: "Carreras",  en: "Racing" },
    genre_sim:      { es: "Simulación", en: "Simulation" },
    // My Computer
    mc_system_tasks:    { es: "Tareas del sistema", en: "System Tasks" },
    mc_view_info:       { es: "Ver información del sistema", en: "View system information" },
    mc_add_remove:      { es: "Agregar o quitar programas", en: "Add or remove programs" },
    mc_change_setting:  { es: "Cambiar una configuración", en: "Change a setting" },
    mc_other_places:    { es: "Otros sitios", en: "Other Places" },
    mc_network:         { es: "Mis sitios de red", en: "My Network Places" },
    mc_documents:       { es: "Mis documentos", en: "My Documents" },
    mc_shared:          { es: "Documentos compartidos", en: "Shared Documents" },
    mc_control:         { es: "Panel de control", en: "Control Panel" },
    mc_details:         { es: "Detalles", en: "Details" },
    mc_tech_note:       { es: "Hecho con Next.js, React Three Fiber & Tailwind.", en: "Built with Next.js, React Three Fiber & Tailwind." },
    mc_source_code:     { es: "Ver el código fuente →", en: "View source code →" },
    mc_files_stored:    { es: "Archivos en esta computadora", en: "Files Stored on This Computer" },
    mc_hard_disk:       { es: "Unidades de disco duro", en: "Hard Disk Drives" },
    mc_removable:       { es: "Dispositivos con almacenamiento extraíble", en: "Devices with Removable Storage" },
    mc_about_me:        { es: "Sobre mí :)", en: "About Me :)" },
    mc_address:         { es: "Dirección", en: "Address" },
    mc_close:           { es: "Cerrar", en: "Close" },
    mc_select_all:      { es: "Seleccionar todo", en: "Select All" },
    mc_large_icons:     { es: "Iconos grandes", en: "Large Icons" },
    mc_add_favorites:   { es: "Agregar a Favoritos", en: "Add to Favorites" },
    mc_folder_options:  { es: "Opciones de carpeta", en: "Folder Options" },
    // Shortcuts (portfolio sections) — labels match nav translations
    mc_about:      { es: "Sobre mí",    en: "About Me" },
    mc_skills:     { es: "Habilidades", en: "Skills" },
    mc_experience: { es: "Experiencia", en: "Experience" },
    mc_projects:   { es: "Proyectos",   en: "Projects" },
    mc_contact:    { es: "Contacto",    en: "Contact" },
    // Spotify widget
    spotify_see_more: { es: "Ver más música →", en: "See more music →" },
    spotify_top5_label: { es: "Top 5 · Últimos 6 meses", en: "Top 5 · Last 6 months" },
    spotify_playlists: { es: "Mis playlists en Spotify", en: "My Playlists on Spotify" },
    spotify_loading: { es: "Cargando…", en: "Loading…" },
    spotify_error: { es: "No se pudieron cargar las playlists.", en: "Could not load playlists." },
    news: {
      es: [
        "React 20 llega con Compiler estable por defecto",
        "WebGPU ya corre en todos los navegadores mayores",
        "TypeScript 6.0: inferencia mas rapida en monorepos",
      ],
      en: [
        "React 20 ships with stable Compiler enabled by default",
        "WebGPU now runs in all major browsers",
        "TypeScript 6.0: faster inference in monorepos",
      ],
    },
  },
} as const;

/** Helper: returns the string for the active language */
export function tr<T extends { es: string; en: string }>(
  entry: T,
  lang: Lang
): string {
  return entry[lang];
}
