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
        fullScreen: false,

        background: {
          color: {
            value: "transparent",
          },
        },

        fpsLimit: 120,

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            resize: true,
          },

          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.15,
              },
            },
          },
        },

        particles: {
          color: {
            value: "#fbbf24",
          },

          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.08,
            width: 1,
          },

          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.6,
            straight: false,
          },

          number: {
            density: {
              enable: true,
            },
            value: 50,
          },

          opacity: {
            value: 0.2,
          },

          shape: {
            type: "circle",
          },

          size: {
            value: { min: 1, max: 3 },
          },
        },

        detectRetina: true,
      }}
      className="absolute inset-0"
    />
  );
}