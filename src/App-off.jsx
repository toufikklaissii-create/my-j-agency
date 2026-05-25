import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Video, Target, BarChart3, TrendingUp, Globe, Shield, Zap } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// ==========================================
// STYLES INJECTÉS (Marquee + Perspective)
// ==========================================
const styles = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: flex;
    width: 200%;
    animation: marquee 20s linear infinite;
  }
  .perspective-container {
    perspective: 1200px;
    transform-style: preserve-3d;
  }
`;

// ==========================================
// FOND 3D : CHAMP D'ÉTOILES
// ==========================================
function StarField(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 12;
    ref.current.rotation.y -= delta / 18;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#fbbf24" size={0.003} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

// ==========================================
// MOTEUR 3D BENTO : TILT + LUEUR SPÉCIALE
// ==========================================
function TiltCard3D({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);

    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden group/card ${className}`}
    >
      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.03) 40%, rgba(0,0,0,0) 80%)",
          width: "450px",
          height: "450px",
          pointerEvents: "none",
          zIndex: 0,
        }}
        className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-out"
      />
      <div style={{ transformStyle: "preserve-3d" }} className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// ==========================================
// COMPOSANT : SPLASH SCREEN ANIMÉ
// ==========================================
function LogoSplashScreen({ showSplash, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onClose, 200);
          return 100;
        }
        return p + 2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [showSplash, onClose]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div 
          initial={{ opacity: 1 }} 
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }} 
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col justify-between p-8 md:p-16 select-none"
        >
          <div className="flex justify-between items-center w-full font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            <span>MY J AGENCY // ACQUISITION SYSTEM</span>
            <span>RABAT_HQ</span>
          </div>
          
          <div className="flex flex-col items-center justify-center grow">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mb-8">
              <img src="/logo_refined.png" alt="MY J AGENCY" className="h-20 md:h-24 w-auto object-contain" />
            </motion.div>
            <div className="h-[1px] w-48 bg-neutral-900 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 bottom-0 bg-amber-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          
          <div className="flex justify-between items-end w-full">
            <span className="font-mono text-[24px] md:text-[32px] font-bold text-neutral-900 leading-none">01</span>
            <div className="text-right">
              <p className="text-white font-mono text-[9px] tracking-widest uppercase mb-1">INITIALISATION</p>
              <p className="text-neutral-600 text-[8px] font-mono tracking-wider uppercase cursor-pointer hover:text-amber-500 transition-colors" onClick={onClose}>SKIP [X]</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// APPLICATION PRINCIPALE
// ==========================================
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', message: '' });

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: false }}>
      <>
        <style>{styles}</style>
        
        <LogoSplashScreen showSplash={showSplash} onClose={() => setShowSplash(false)} />

        <div className="relative min-h-screen bg-[#050505] text-[#E1E0CC] font-sans overflow-x-hidden">
          
          {/* CANVAS 3D FIXE EN ARRIÈRE-PLAN */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
              <StarField />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
          </div>

          {/* CONTENU GLOBAL */}
          <div className="relative z-10 w-full">
            
            {/* NAVBAR */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
              <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center justify-between w-full max-w-[600px] shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-2">
                  <img src="/logo_refined.png" alt="MY J AGENCY" className="h-6 w-auto object-contain" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white hidden sm:block">MY J AGENCY</span>
                </div>
                <button className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-semibold uppercase hover:bg-amber-400 hover:scale-105 transition-all duration-300">
                  Let's talk
                </button>
              </div>
            </nav>

            {/* HERO SECTION AVEC IFRAME SPLINE PROPRÉGÉE */}
            <section className="min-h-screen w-full flex items-center justify-center px-6 md:px-12 relative pt-24">
              <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                
                {/* TEXTE ACCROCHE */}
                <motion.div
                  className="lg:col-span-7 text-center lg:text-left"
                  initial={{ opacity: 0, y: 30 }}
                  animate={!showSplash ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="font-mono text-[9px] tracking-[0.4em] text-amber-500 uppercase mb-4 mx-auto lg:mx-0 max-w-max">
                    // GROWTH MARKETING INFRASTRUCTURE
                  </div>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6 text-white">
                    L'ACQUISITION <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">EST UNE SCIENCE</span>
                  </h1>
                  <p className="text-gray-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
                    Nous concevons des infrastructures d'acquisition d'élite. Paid Media, Tunnels de vente et Stratégie de croissance pour marques dominantes.
                  </p>
                  <button className="bg-amber-500 text-black px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                    DEMANDER UN AUDIT GRATUIT →
                  </button>
                </motion.div>

                {/* ZONE INTÉGRATION IFRAME 3D EN CAPITALE (ZÉRO CONFLIT) */}
                <div className="hidden lg:block lg:col-span-5 h-[500px] w-full relative">
                  <iframe 
                    src="https://my.spline.design/untitled-PMe9h1GpwAaws6g6zsORBYvJ/" 
                    frameBorder="0" 
                    width="100%" 
                    height="100%"
                    className="w-full h-full pointer-events-auto"
                    title="My J Agency 3D Space"
                  />
                </div>

              </div>
            </section>

            {/* MARQUEE */}
            <div className="w-full py-5 border-b border-neutral-900/50 overflow-hidden flex whitespace-nowrap bg-black/40 backdrop-blur-md">
              <div className="animate-marquee font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase items-center">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="flex shrink-0 items-center">
                    <span className="mx-8 flex items-center gap-2"><TrendingUp size={12} className="text-amber-500"/> ROAS MOYEN 4.2X</span><span className="mx-8 text-neutral-800">/</span>
                    <span className="mx-8 flex items-center gap-2"><Globe size={12} className="text-white"/> DÉPLOIEMENT INTERNATIONAL</span><span className="mx-8 text-neutral-800">/</span>
                    <span className="mx-8 flex items-center gap-2"><Target size={12} className="text-amber-500"/> ACQUISITION MULTI-CANAL</span><span className="mx-8 text-neutral-800">/</span>
                    <span className="mx-8 flex items-center gap-2"><BarChart3 size={12} className="text-white"/> +15M€ GÉNÉRÉS EN 2025</span><span className="mx-8 text-neutral-800">/</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SERVICES SECTION */}
            <section className="relative w-full py-32 border-t border-white/5">
              <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm z-0" />
              <div className="max-w-6xl mx-auto px-6 relative z-10">
                
                <div className="mb-20 text-center md:text-left">
                  <span className="text-xs font-mono text-neutral-500 tracking-[0.3em] uppercase block mb-2">// CAPACITÉS STRATÉGIQUES</span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">Nos Vecteurs de Croissance</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 perspective-container">
                  <TiltCard3D className="md:col-span-8 bg-[#090909]/90 border border-neutral-900 rounded-2xl shadow-xl group">
                    <div className="p-8 md:p-10 flex flex-col justify-between min-h-[380px] h-full">
                      <div className="flex justify-between items-start">
                        <div className="text-amber-500 bg-neutral-950 border border-neutral-800 w-12 h-12 flex items-center justify-center rounded-xl group-hover:text-white group-hover:bg-amber-500 transition-all duration-300">
                          <Video size={24} />
                        </div>
                        <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase">/ 01 // IMPACT</span>
                      </div>
                      <div className="mt-12">
                        <h3 className="font-bold uppercase text-2xl text-white mb-3 tracking-wide">Production Vidéo Short-Form</h3>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-xl">
                          Création de contenus short-form millimétrés pour capturer instantanément l'attention, maximiser les taux de rétention et dominer les algorithmes de manière agressive.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>

                  <TiltCard3D className="md:col-span-4 bg-[#090909]/90 border border-neutral-900 rounded-2xl shadow-xl group">
                    <div className="p-8 flex flex-col justify-between min-h-[380px] h-full">
                      <div className="flex justify-between items-start">
                        <div className="text-amber-500 bg-neutral-950 border border-neutral-800 w-12 h-12 flex items-center justify-center rounded-xl group-hover:text-white group-hover:bg-amber-500 transition-all duration-300">
                          <Target size={24} />
                        </div>
                        <span className="font-mono text-[10px] text-neutral-600 tracking-widest">/ 02</span>
                      </div>
                      <div className="mt-12">
                        <h3 className="font-bold uppercase text-xl text-white mb-2 tracking-wide">Stratégie Content</h3>
                        <p className="text-neutral-400 text-xs font-light leading-relaxed">
                          Positionnement d'autorité et copywriting chirurgical pensé pour éduquer ton marché et transformer ton audience en acheteurs qualifiés.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>

                  <TiltCard3D className="md:col-span-12 bg-[#090909]/90 border border-neutral-900 rounded-2xl shadow-xl group">
                    <div className="p-8 md:p-12 flex flex-col justify-between min-h-[300px] h-full relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-72 h-72 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <div className="text-amber-500 bg-neutral-950 border border-neutral-800 w-12 h-12 flex items-center justify-center rounded-xl group-hover:text-white group-hover:bg-amber-500 transition-all duration-300">
                          <BarChart3 size={24} />
                        </div>
                        <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase">/ 03 // PERFORMANCE</span>
                      </div>
                      
                      <div className="mt-8 md:mt-12 relative z-10">
                        <h3 className="font-bold uppercase text-2xl text-white mb-3 tracking-wide">Tunnels de Vente & C.R.O.</h3>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-2xl">
                          Architecture de conversion complète et optimisation psychologique du taux de conversion (CRO). Nous consevons des parcours clients sans friction pour rentabiliser et maximiser chaque centime de tes budgets publicitaires.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>
                </div>

              </div>
            </section>

            {/* SECTION CONTACT */}
            <section id="contact" className="relative w-full py-32 bg-black/40 backdrop-blur-md px-6 border-t border-neutral-900/60">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  
                  <div className="lg:col-span-5 sticky top-32">
                    <span className="text-[9px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-4">// AUDIT & INTÉGRATION</span>
                    <h3 className="text-4xl font-black uppercase text-white tracking-tighter leading-none mb-6">DOMINEZ VOTRE <br/><span className="text-neutral-800">MARCHÉ.</span></h3>
                    <p className="text-neutral-400 text-xs font-light leading-relaxed mb-8 max-w-sm">
                      Nous sélectionnons uniquement les projets capables de soutenir une croissance agressive. Soumets ton manifeste pour faire analyser tes systèmes par notre équipe.
                    </p>
                    <div className="space-y-4 font-mono text-[9px] tracking-widest text-neutral-500">
                      <p className="flex items-center gap-3"><Zap size={12} className="text-amber-500" /> Audit offert aux profils qualifiés</p>
                      <p className="flex items-center gap-3"><Shield size={12} className="text-white" /> Exclusivité sectorielle garantie</p>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#090909]/80 border border-neutral-900 p-8 md:p-10 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <form onSubmit={(e) => { e.preventDefault(); setFormStatus('sending'); setTimeout(() => { setFormStatus('success'); setFormData({ name: '', email: '', budget: '', message: '' }); setTimeout(() => setFormStatus('idle'), 4000); }, 1500); }} className="flex flex-col gap-8">
                      
                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">01 / Entreprise ou Nom de Marque</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nom de ta structure" className="w-full bg-transparent text-white outline-none text-sm font-light placeholder:text-neutral-800" required />
                      </div>

                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">02 / Contact Principal (Email)</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="directeur@entreprise.com" className="w-full bg-transparent text-white outline-none text-sm font-light placeholder:text-neutral-800" required />
                      </div>

                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">03 / Budget d'Acquisition Mensuel Actuel</label>
                        <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-transparent text-white outline-none text-sm font-light appearance-none cursor-pointer text-neutral-400" required>
                          <option value="" disabled className="bg-[#090909] text-neutral-600">Sélectionne ta tranche budgétaire</option>
                          <option value="1k-10k" className="bg-[#090909] text-white">- de 10 000 MAD / mois</option>
                          <option value="10k-30k" className="bg-[#090909] text-white">10 000 - 30 000 MAD / mois</option>
                          <option value="30k-100k" className="bg-[#090909] text-white">30 000 - 100 000 MAD / mois</option>
                          <option value="100k+" className="bg-[#090909] text-white">+ de 100 000 MAD / mois</option>
                        </select>
                      </div>

                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">04 / Obstacles majeurs à ton scaling</label>
                        <textarea rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Coût par acquisition trop élevé, tracking..." className="w-full bg-transparent text-white outline-none text-sm font-light placeholder:text-neutral-800 resize-none" required></textarea>
                      </div>

                      <button type="submit" disabled={formStatus !== 'idle'} className="w-full bg-white text-black font-mono text-[10px] tracking-widest uppercase py-5 rounded-xl transition-all hover:bg-amber-400 disabled:opacity-50 font-bold shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                        {formStatus === 'idle' && "SOUMETTRE MON MANIFESTE →"}
                        {formStatus === 'sending' && "ANALYSE DE TON INFRASTRUCTURE..."}
                        {formStatus === 'success' && "MANIFESTE REÇU. DOSSIER EN COURS DE QUALIFICATION."}
                      </button>

                    </form>
                  </div>

                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-[#050505] border-t border-neutral-900/60 px-6 font-mono text-[8px] text-neutral-600 tracking-widest uppercase text-center sm:text-left relative z-10">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <span>MY J AGENCY // DIGITAL ACQUISITION INFRASTRUCTURE</span>
                <span>©2026 // CASABLANCA - RABAT</span>
              </div>
            </footer>

          </div>
        </div>
      </>
    </ReactLenis>
  );
}