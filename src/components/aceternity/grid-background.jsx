import React from "react";

export function GridBackground({ children }) {
  return (
    <div className="w-full min-h-screen bg-black bg-grid-white/[0.02] relative flex flex-col">
      {/* Un dégradé radial pour donner un effet de projecteur au centre et estomper la grille sur les côtés */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative z-10 w-full flex-1">
        {children}
      </div>
    </div>
  );
}