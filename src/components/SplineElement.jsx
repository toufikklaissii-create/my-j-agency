import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';

export default function SplineElement() {
  return (
    <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center relative">
      {/* Fallback de chargement le temps que l'objet 3D apparaisse */}
      <Suspense fallback={<Loader2 className="animate-spin text-amber-500" size={40} />}>
        <Spline 
          // C'est ici qu'on met le lien de ton objet 3D. 
          // J'ai mis une forme abstraite futuriste par défaut pour tester.
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" 
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}