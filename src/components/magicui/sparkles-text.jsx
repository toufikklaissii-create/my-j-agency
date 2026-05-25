import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SparklesText({ text, className = "" }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const generateSparkle = () => ({
      id: Math.random().toString(),
      createdAt: Date.now(),
      size: Math.random() * 10 + 10,
      style: {
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
      },
    });

    // Génère des étincelles au début
    setSparkles(Array.from({ length: 4 }, generateSparkle));

    const interval = setInterval(() => {
      setSparkles((current) => [
        ...current.filter((sp) => Date.now() - sp.createdAt < 800),
        generateSparkle(),
      ]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.svg
          key={sparkle.id}
          className="absolute pointer-events-none z-20"
          style={sparkle.style}
          width={sparkle.size}
          height={sparkle.size}
          viewBox="0 0 24 24"
          fill="none"
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0], rotate: [0, 45, 90] }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <path
            d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"
            fill="#E1E0CC"
          />
        </motion.svg>
      ))}
      <span className="relative z-10">{text}</span>
    </span>
  );
}