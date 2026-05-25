import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 45,
          },
          color: {
            value: "#fbbf24",
          },
          links: {
            enable: true,
            color: "#ffffff",
            opacity: 0.08,
          },
          move: {
            enable: true,
            speed: 0.6,
          },
          opacity: {
            value: 0.2,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
}