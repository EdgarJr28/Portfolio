"use client";

import { motion } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { skills, type SkillCategory } from "@/lib/data";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

const CATEGORY_ORDER: SkillCategory[] = [
  "Frontend",
  "Herramientas",
  "Aprendiendo",
];

function groupByCategory(items: typeof skills) {
  return CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((s) => s.category === cat);
      return acc;
    },
    {} as Record<SkillCategory, typeof skills>
  );
}

function SkillTag({ name, index }: { name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{
        borderColor: "rgba(240,240,240,0.6)",
        color: "#f0f0f0",
      }}
      viewport={{ once: true }}
      transition={{
        opacity: { duration: 0.4, delay: index * 0.04 },
        scale: { duration: 0.4, delay: index * 0.04 },
        borderColor: { duration: 0.2 },
        color: { duration: 0.2 },
      }}
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "0.4rem 0.9rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.8125rem",
        fontWeight: 300,
        color: "rgba(240,240,240,0.55)",
        letterSpacing: "0.02em",
        cursor: "default",
      }}
    >
      {name}
    </motion.div>
  );
}

export default function Skills() {
  const grouped = groupByCategory(skills);

  return (
    <section id="skills" style={SECTION_STYLE}>
      <SectionTitle number="02" title="Skills" />

      <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
        {CATEGORY_ORDER.map((category, ci) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: ci * 0.08 }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                color: "rgba(240,240,240,0.3)",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              {category}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {grouped[category].map((skill, si) => (
                <SkillTag key={skill.name} name={skill.name} index={si} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
