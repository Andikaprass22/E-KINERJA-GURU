"use client";

import { motion } from "framer-motion";

interface AnimatedContentProps {
  children: React.ReactNode;
}

export function AnimatedContent({ children }: AnimatedContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-6"
    >
      {children}
    </motion.div>
  );
}
