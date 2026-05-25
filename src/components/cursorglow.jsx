import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: position.x - 150,
        y: position.y - 150,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
      }}
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[1]"
      style={{
        background:
          "radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.08) 30%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}