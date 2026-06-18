"use client";

import { motion } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { blogPosts, type BlogPost } from "@/lib/data";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        paddingTop: "1.75rem",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        cursor: "default",
      }}
    >
      {/* Categoría */}
      <span
        style={{
          display: "inline-block",
          width: "fit-content",
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          fontWeight: 400,
          color: "rgba(240,240,240,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "0.2rem 0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {post.category}
      </span>

      {/* Título */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#f0f0f0",
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
        {post.title}
      </h3>

      {/* Descripción */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 300,
          color: "rgba(240,240,240,0.5)",
          lineHeight: 1.7,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        {post.description}
      </p>

      {/* Fecha */}
      <time
        dateTime={post.date}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 300,
          color: "rgba(240,240,240,0.25)",
          marginTop: "auto",
        }}
      >
        {formatDate(post.date)}
      </time>
    </motion.article>
  );
}

export default function Blog() {
  return (
    <section id="blog" style={SECTION_STYLE}>
      <SectionTitle number="06" title="Blog" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: "0 3rem",
        }}
      >
        {blogPosts.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} />
        ))}
      </div>

      <p
        style={{
          marginTop: "3.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          fontWeight: 300,
          color: "rgba(240,240,240,0.25)",
          fontStyle: "italic",
        }}
      >
        Próximamente conectado a MDX o un CMS.
      </p>
    </section>
  );
}
