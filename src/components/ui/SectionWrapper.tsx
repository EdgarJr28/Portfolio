"use client";

import { motion } from "motion/react";
import { ReactNode, CSSProperties } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  style?: CSSProperties;
  className?: string;
  delay?: number;
}

export default function SectionWrapper({
  children,
  id,
  style,
  className,
  delay = 0,
}: SectionWrapperProps) {
  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
