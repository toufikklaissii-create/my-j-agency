import React from 'react';
import { motion } from 'framer-motion';
import { Video, Target, Compass, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: <Video className="w-6 h-6 text-purple-400" />,
    title: "Production Vidéo Short-Form",
    desc: "Des Reels, TikToks et Shorts percutants pour capter l'attention en moins de 2 secondes et faire exploser ton audience."
  },
  {
    icon: <Target className="w-6 h-6 text-purple-400" />,
    title: "Stratégie de Contenu",
    desc: "Savoir exactement quoi poster, quand poster et comment transformer tes vues en clients fidèles pour ton agence."
  },
  {
    icon: <Compass className="w-6 h-6 text-purple-400" />,
    title: "Identité de Marque & UI",
    desc: "Un positionnement haut de gamme avec des designs uniques pour te démarquer instantanément de la concurrence."
  }
];

export default function ServicesPro() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto bg-neutral-950 text-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Nos Services <span className="text-purple-500">Pro Max</span>
        </h2>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Des solutions sur-mesure conçues pour propulser l'écosystème digital de ton business.
        </p>
      </div>

      {/* Grille responsive conforme aux règles de layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            // Règle animation : entrée progressive (stagger-sequence)
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
            
            // Règle Touch & Interact : Effet de survol et réduction subtile au clic (scale-feedback)
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            
            className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 transition-colors duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-6 group-hover:bg-purple-500/20 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-wide">{service.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">{service.desc}</p>
            </div>

            <div className="flex items-center gap-2 text-purple-400 font-medium text-sm group-hover:text-purple-300 transition-colors mt-auto">
              En savoir plus 
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}