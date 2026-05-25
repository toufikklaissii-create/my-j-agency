import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Target, BarChart3, Shield, Zap, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { GridBackground } from './components/aceternity/grid-background';

// ==========================================
// STYLES INJECTÉS (Marquee + Grain + Perspective)
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
  .noise-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
  .perspective-container {
    perspective: 1200px;
    transform-style: preserve-3d;
  }
`;

// ==========================================
// MOTEUR 3D : TILT + LUEUR DYNAMIQUE PRO
// ==========================================
function TiltCard3D({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
      {/* LUEUR PRO : Plus grande, diffuse et intense */}
      <motion.div
        style={{
          position: "absolute",
          left: glowX,
          top: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.20) 0%, rgba(251, 191, 36, 0.05) 30%, rgba(0,0,0,0) 80%)",
          width: "500px",
          height: "500px",
          pointerEvents: "none",
          zIndex: 0,
        }}
        className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-out"
      />

      {/* Conteneur Z-index pour le parallaxe interne */}
      <div style={{ transformStyle: "preserve-3d" }} className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// ==========================================
// BOUTON MAGNÉTIQUE
// ==========================================
function MagneticButton({ children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 12 });
  const springY = useSpring(y, { stiffness: 120, damping: 12 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ x: springX, y: springY }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

// ==========================================
// SPLASH SCREEN
// ==========================================
function LogoSplashScreen({ showSplash, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onClose, 300); return 100; }
        return p + 3;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [showSplash, onClose]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div initial={{ opacity: 1 }} exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }} className="fixed inset-0 z-[100] bg-[#050505] flex flex-col justify-between p-8 md:p-16 select-none">
          <div className="flex justify-between items-center w-full font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            <span>MY J AGENCY // ACQUISITION SYSTEM</span>
            <span>RABAT_HQ</span>
          </div>
          <div className="flex flex-col items-center justify-center grow">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative mb-8">
              <img src="/logo.jpg" alt="MY J AGENCY" className="h-20 md:h-28 w-auto object-contain grayscale" />
            </motion.div>
            <div className="h-[1px] w-48 bg-neutral-900 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 bottom-0 bg-amber-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex justify-between items-end w-full">
            <span className="font-mono text-[32px] md:text-[48px] font-bold text-neutral-900 leading-none">01</span>
            <div className="text-right">
              <p className="text-white font-mono text-[10px] tracking-widest uppercase mb-1">INITIALISATION</p>
              <p className="text-neutral-600 text-[9px] font-mono tracking-wider uppercase cursor-pointer hover:text-amber-500 transition-colors" onClick={onClose}>SKIP [X]</p>
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
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', message: '' });

  const slidesData = [
    {
      video: "/video1.mp4",
      title: "L'ACQUISITION N'EST PAS UN HASARD. C'EST UNE SCIENCE.",
      subtitle: "Nous concevons des infrastructures d'acquisition d'élite. Paid Media, Tunnels de vente et Stratégie de croissance pour marques dominantes.",
      tag: "GROWTH MARKETING INFRASTRUCTURE"
    },
    {
      video: "/video2.mp4",
      title: "SCALABILITÉ RADICALE. R.O.I. ASSUMÉ.",
      subtitle: "Ne payez plus pour des impressions stériles. Nous transformons votre trafic en capital avec une précision chirurgicale basée sur la data.",
      tag: "DATA-DRIVEN ACQUISITION"
    },
    {
      video: "/video3.mp4",
      title: "DOMINATION MULTI-CANAL GLOBALE.",
      subtitle: "Déployez vos actifs à l'international. Nous saturons votre marché cible sur Meta, Google et TikTok grâce au contenu et à la data.",
      tag: "OMNICHANNEL SCALING"
    }
  ];

  useEffect(() => {
    if (showSplash) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [showSplash]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_ACCESS_KEY_HERE", 
          name: formData.name, email: formData.email, budget: formData.budget, message: formData.message,
          subject: "🔥 Lead Qualifié - MY J AGENCY",
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', budget: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else { setFormStatus('idle'); }
    } catch (error) { setFormStatus('idle'); }
  };

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: false }}>
      <>
        <style>{styles}</style>
        <div className="noise-overlay"></div>
        
        <LogoSplashScreen showSplash={showSplash} onClose={() => setShowSplash(false)} />

        <GridBackground>
          <div className="bg-[#050505] text-[#F5F5F3] font-sans antialiased selection:bg-amber-500 selection:text-black min-h-screen overflow-x-hidden">
            
            {/* NAVBAR */}
            <div className="w-full fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
              <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-md border border-neutral-800 rounded-full pl-6 pr-2 py-2 flex items-center justify-between w-full max-w-[680px] shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                <div onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center gap-2.5 cursor-pointer">
                  <img src="/logo.jpg" alt="Logo" className="h-5 w-auto object-contain grayscale" />
                  <span className="text-[9px] font-mono tracking-[0.3em] text-white hidden sm:block">MY J AGENCY</span>
                </div>
                <nav className="hidden sm:flex items-center gap-1">
                  <span onClick={() => scrollToSection('expertise')} className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 px-4 py-2 rounded-full cursor-pointer hover:text-white transition-all">/ EXPERTISE</span>
                  <span onClick={() => scrollToSection('contact')} className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 px-4 py-2 rounded-full cursor-pointer hover:text-white transition-all">/ AUDIT</span>
                </nav>
                <MagneticButton onClick={() => scrollToSection('contact')} className="bg-white text-black px-4 py-2 rounded-full text-[9px] font-mono tracking-widest uppercase hover:bg-amber-400 transition-colors flex items-center gap-1.5">
                  <span>SCALE NOW</span> <ArrowUpRight size={12} />
                </MagneticButton>
              </motion.header>
            </div>

            {/* HERO */}
            <section className="relative w-full h-screen overflow-hidden flex flex-col justify-end border-b border-neutral-900">
              <div className="absolute inset-0 w-full h-full z-0 bg-black">
                <AnimatePresence mode="popLayout">
                  <motion.video key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 0.4, scale: 1.02 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }} autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 contrast-125">
                    <source src={slidesData[currentSlide].video} type="video/mp4" />
                  </motion.video>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
              </div>
              <div className="relative z-20 w-full px-6 md:px-16 pb-12 lg:pb-20 max-w-[1400px] mx-auto">
                <div className="max-w-5xl">
                  <div className="font-mono text-[9px] tracking-[0.4em] text-amber-500 uppercase mb-5 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> {slidesData[currentSlide].tag}
                  </div>
                  <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tighter uppercase leading-[0.9] text-white mb-6">
                    {slidesData[currentSlide].title}
                  </h1>
                  <div className="md:grid md:grid-cols-12 gap-8 items-start mt-8">
                    <p className="md:col-span-7 text-neutral-400 text-sm md:text-base tracking-wide leading-relaxed font-light mb-6">
                      {slidesData[currentSlide].subtitle}
                    </p>
                    <div className="md:col-span-5 flex md:justify-end">
                      <button onClick={() => scrollToSection('contact')} className="bg-white text-black text-[10px] font-mono tracking-widest uppercase px-6 py-4 hover:bg-amber-400 transition-colors">
                        DEMANDER UN AUDIT STRATÉGIQUE →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MARQUEE */}
            <div className="w-full bg-[#090909] py-5 border-b border-neutral-900 overflow-hidden flex whitespace-nowrap">
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

            {/* SECTION EXPERTISE - BENTO GRID VRAIE 3D PARALLAXE */}
            <section id="expertise" className="relative w-full py-32 bg-[#050505] border-t border-neutral-900">
              <div className="max-w-[1300px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-2">// NOS VECTEURS DE CROISSANCE</span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white leading-none">
                      L'INGÉNIERIE DE <span className="text-neutral-800">L'ACQUISITION</span>
                    </h3>
                  </div>
                  <p className="text-neutral-500 font-mono text-[11px] max-w-sm leading-relaxed">
                    Nous ne vendons pas des clics, nous vendons des parts de marché. Nos systèmes sont architecturés pour écraser les coûts.
                  </p>
                </div>

                {/* GRILLE PERSPECTIVE */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 perspective-container">
                  
                  {/* CARTE 1 (PAID MEDIA) */}
                  <TiltCard3D className="md:col-span-8 bg-[#090909] border border-neutral-900">
                    <div className="p-8 md:p-12 flex flex-col justify-between min-h-[420px] h-full shadow-[0_30px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-center" style={{ transform: "translateZ(60px)" }}>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 text-amber-500 shadow-2xl"><TrendingUp size={20} /></div>
                        <span className="font-mono text-[9px] text-neutral-600 tracking-widest uppercase">/ 01 // PAID MEDIA</span>
                      </div>
                      <div className="mt-8" style={{ transform: "translateZ(40px)" }}>
                        <h4 className="text-xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">Trafic & Média Buying d'Élite</h4>
                        <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mb-6 max-w-2xl">
                          Déploiement de campagnes publicitaires chirurgicales sur Meta, Google Ads et TikTok. Nous utilisons la data de manière agressive pour isoler les audiences les plus rentables et scaler vos budgets sans casser le ROAS.
                        </p>
                        <div className="flex flex-wrap gap-2" style={{ transform: "translateZ(20px)" }}>
                          {["Meta Ads", "Google Ads", "TikTok Ads", "Retargeting Avancé"].map((tag, i) => (
                            <span key={i} className="text-[9px] font-mono uppercase bg-black px-2.5 py-1 border border-neutral-800 text-neutral-500">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>

                  {/* CARTE 2 (TUNNELS & CRO) */}
                  <TiltCard3D className="md:col-span-4 bg-[#090909] border border-neutral-900">
                    <div className="p-8 flex flex-col justify-between min-h-[420px] h-full shadow-[0_30px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-start" style={{ transform: "translateZ(60px)" }}>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 text-white shadow-2xl"><BarChart3 size={20} /></div>
                        <span className="font-mono text-[9px] text-neutral-600 tracking-widest">/ 02</span>
                      </div>
                      <div style={{ transform: "translateZ(40px)" }}>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-2">Tunnels & C.R.O.</h4>
                        <p className="text-neutral-500 text-xs font-light leading-relaxed">
                          Optimisation du taux de conversion. Nous designons des landing pages psychologiques qui transforment le trafic froid en acheteurs réels.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>

                  {/* CARTE 3 (STRATÉGIE CRÉATIVE) */}
                  <TiltCard3D className="md:col-span-4 bg-[#090909] border border-neutral-900">
                    <div className="p-8 flex flex-col justify-between min-h-[350px] h-full shadow-[0_30px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-start" style={{ transform: "translateZ(60px)" }}>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 text-white shadow-2xl"><Target size={20} /></div>
                        <span className="font-mono text-[9px] text-neutral-600 tracking-widest">/ 03</span>
                      </div>
                      <div style={{ transform: "translateZ(40px)" }}>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-2">Stratégie Créative</h4>
                        <p className="text-neutral-500 text-xs font-light leading-relaxed">
                          Les algorithmes privilégient le contenu. Nous produisons des vidéos UGC conçues spécifiquement pour abaisser vos CPA drastiquement.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>

                  {/* CARTE 4 (TRACKING SERVEUR) */}
                  <TiltCard3D className="md:col-span-8 bg-[#090909] border border-neutral-900">
                    <div className="p-8 md:p-12 flex flex-col justify-between min-h-[350px] h-full relative overflow-hidden shadow-[0_30px_50px_rgba(0,0,0,0.5)]">
                      <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
                      <div className="flex justify-between items-start" style={{ transform: "translateZ(60px)" }}>
                        <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-500 tracking-widest"><Shield size={10} className="text-amber-500"/> DATA INFRASTRUCTURE</div>
                        <span className="font-mono text-[9px] text-neutral-600 tracking-widest">/ 04</span>
                      </div>
                      <div className="mt-8 relative z-10" style={{ transform: "translateZ(40px)" }}>
                        <h4 className="text-xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">Tracking & Attribution Serveur</h4>
                        <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed max-w-xl">
                          Dans un monde post-iOS 14, la donnée est reine. Nous implémentons des trackings serveur-side complexes pour récupérer 100% de la visibilité sur votre parcours client et nourrir les algorithmes publicitaires.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>

                </div>
              </div>
            </section>

            {/* SECTION CONTACT */}
            <section id="contact" className="relative w-full py-32 bg-[#050505] px-6 border-t border-neutral-900">
              <div className="max-w-[1100px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <div className="lg:col-span-5 sticky top-32">
                    <span className="text-[9px] font-mono tracking-[0.4em] text-neutral-500 uppercase block mb-4">// AUDIT & SCALE</span>
                    <h3 className="text-4xl font-black uppercase text-white tracking-tighter leading-none mb-6">DOMINEZ VOTRE <br/><span className="text-neutral-800">MARCHÉ.</span></h3>
                    <p className="text-neutral-400 text-xs font-light leading-relaxed mb-8 max-w-sm">
                      Nous travaillons exclusivement avec des entreprises prêtes à scaler. Remplissez ce manifeste pour que notre équipe analyse le potentiel de votre infrastructure.
                    </p>
                    <div className="space-y-4 font-mono text-[9px] tracking-widest text-neutral-600">
                      <p className="flex items-center gap-3"><Zap size={12} className="text-amber-500" /> Audit stratégique offert aux profils qualifiés</p>
                      <p className="flex items-center gap-3"><Shield size={12} className="text-white" /> Exclusivité sectorielle garantie</p>
                    </div>
                  </div>
                  <div className="lg:col-span-7 bg-[#090909] p-8 md:p-10 border border-neutral-900">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">01 / Marque ou Entreprise</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nom de votre structure" className="w-full bg-transparent text-white outline-none text-sm font-light placeholder:text-neutral-800" required />
                      </div>
                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">02 / Contact Exécutif</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@entreprise.com" className="w-full bg-transparent text-white outline-none text-sm font-light placeholder:text-neutral-800" required />
                      </div>
                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">03 / Budget d'Acquisition Mensuel</label>
                        <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-transparent text-white outline-none text-sm font-light appearance-none cursor-pointer" required>
                          <option value="" disabled className="bg-[#090909] text-neutral-500">Sélectionnez une fourchette</option>
                          <option value="1k-5k" className="bg-[#090909]">- de 5 000 MAD / mois</option>
                          <option value="5k-20k" className="bg-[#090909]">5 000 - 20 000 MAD / mois</option>
                          <option value="20k-50k" className="bg-[#090909]">20 000 - 50 000 MAD / mois</option>
                          <option value="50k+" className="bg-[#090909]">+ de 50 000 MAD / mois</option>
                        </select>
                      </div>
                      <div className="border-b border-neutral-800 pb-3 focus-within:border-white transition-colors">
                        <label className="block font-mono text-[8px] tracking-widest text-neutral-600 uppercase mb-2">04 / Enjeux Actuels</label>
                        <textarea rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="CPA trop élevé, besoin de scaler, lancement..." className="w-full bg-transparent text-white outline-none text-sm font-light placeholder:text-neutral-800 resize-none" required></textarea>
                      </div>
                      <button type="submit" disabled={formStatus !== 'idle'} className="w-full bg-white text-black font-mono text-[10px] tracking-widest uppercase py-5 transition-all hover:bg-amber-400 disabled:opacity-50">
                        {formStatus === 'idle' && "DEMANDER L'AUDIT STRATÉGIQUE →"}
                        {formStatus === 'sending' && "ANALYSE EN COURS..."}
                        {formStatus === 'success' && "DOSSIER REÇU. NOUS VOUS CONTACTERONS."}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-[#050505] border-t border-neutral-900 px-6 font-mono text-[9px] text-neutral-600 tracking-widest uppercase text-center sm:text-left">
              <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <span>MY J AGENCY // DIGITAL ACQUISITION</span>
                <span>©2026 // CASABLANCA - RABAT</span>
              </div>
            </footer>

          </div>
        </GridBackground>
      </>
    </ReactLenis>
  );
}

export default App;