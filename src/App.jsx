import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";

const fontStyle = `
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
  * { font-family: 'Plus Jakarta Sans', sans-serif; }
  h1, h2, h3 { font-family: 'Clash Display', sans-serif; font-weight: 700; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  ::selection { background: rgba(139,92,246,0.4); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #050510; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #4f46e5, #8b5cf6); border-radius: 2px; }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #38bdf8 50%, #f472b6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .glow-violet { box-shadow: 0 0 40px rgba(139,92,246,0.35), 0 0 80px rgba(139,92,246,0.12); }
  .glow-cyan { box-shadow: 0 0 40px rgba(6,182,212,0.3); }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .float-anim { animation: float 6s ease-in-out infinite; }
  .float-anim-slow { animation: float 9s ease-in-out infinite; }

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .marquee-track {
    display: flex;
    white-space: nowrap;
    animation: marquee 32s linear infinite;
    width: max-content;
  }
  .marquee-track:hover { animation-play-state: paused; }

  .dot-grid {
    background-image: radial-gradient(circle, rgba(139,92,246,0.09) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .card-tilt {
    transition: transform 0.3s ease;
    transform-style: preserve-3d;
  }
  .card-tilt:hover { transform: perspective(1000px) rotateX(-2deg) rotateY(2deg) scale(1.02); }
`;

/* ─── TYPEWRITER ─── */
function useTypewriter(words, delay = 120) {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    const word = words[idx];
    let t;
    if (!deleting && charIdx <= word.length) {
      t = setTimeout(() => { setDisplayed(word.slice(0, charIdx)); setCharIdx(c => c + 1); }, delay);
    } else if (!deleting && charIdx > word.length) {
      t = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && charIdx >= 0) {
      t = setTimeout(() => { setDisplayed(word.slice(0, charIdx)); setCharIdx(c => c - 1); }, delay / 2);
    } else {
      setDeleting(false);
      setIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, idx, words, delay]);
  return displayed;
}

/* ─── ANIMATED COUNTER ─── */
function AnimCounter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const inc = to / 50;
    const timer = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 40);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── RESUME DOWNLOAD ─── */
async function downloadResume(setLoading) {
  setLoading(true);
  try {
    const r = await fetch("/Rushabh-fullstack.pdf");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Rushabh-Savaliya-Resume.pdf";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch { window.open("/Rushabh-fullstack.pdf", "_blank"); }
  finally { setLoading(false); }
}

/* ─── CURSOR GLOW ─── */
function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ width: 600, height: 600, borderRadius: "50%", zIndex: 0, background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)" }}
      animate={{ left: pos.x - 300, top: pos.y - 300 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    />
  );
}

/* ─── GRAIN OVERLAY ─── */
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.055,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 300px",
      }}
    />
  );
}

/* ─── HERO ORBITAL RINGS ─── */
function HeroRings() {
  return (
    <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none" style={{ zIndex: 1, overflow: "hidden" }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", width: 880, height: 290, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.06)", borderTop: "1px solid rgba(139,92,246,0.28)" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", width: 640, height: 210, borderRadius: "50%", border: "1px dashed rgba(6,182,212,0.05)", borderLeft: "1px solid rgba(6,182,212,0.22)" }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", width: 380, height: 125, borderRadius: "50%", border: "1px solid rgba(244,114,182,0.04)", borderBottom: "1px solid rgba(244,114,182,0.18)" }}
      />
    </div>
  );
}

/* ─── ORB ─── */
function Orb({ color, size, top, left, delay = 0, opacity = 0.12 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left, background: color, filter: "blur(80px)", opacity }}
      animate={{ scale: [1, 1.15, 1], x: [0, 25, 0], y: [0, -15, 0] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── SECTION LABEL ─── */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="mono text-xs text-violet-400 tracking-widest uppercase">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent" />
    </div>
  );
}

/* ─── TECH MARQUEE ─── */
function TechMarquee() {
  const items = [
    "Node.js", "React", "TypeScript", "Supabase", "MongoDB", "Claude AI",
    "LangChain", "AWS S3", "Redis", "GraphQL", "Stripe", "Next.js",
    "PostgreSQL", "WebSockets", "Shopify API", "Tailwind CSS", "Pinecone", "VAPI",
    "Twilio", "ElevenLabs", "Docker", "JWT", "REST APIs", "Framer Motion",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden py-7 relative"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "linear-gradient(180deg, rgba(139,92,246,0.025) 0%, transparent 100%)" }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #030712, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, #030712, transparent)" }} />
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-5 px-2">
            <span className="mono text-sm text-slate-500 hover:text-violet-300 transition-colors cursor-default select-none">{item}</span>
            <span className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SPOTLIGHT CARD ─── */
function SpotlightCard({ children, className = "", style = {}, onClick }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [visible, setVisible] = useState(false);
  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.08) 0%, transparent 55%)`, opacity: visible ? 1 : 0 }}
      />
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["About", "Skills", "Projects", "Experience", "Contact"];
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-3 bg-[#030712]/85 backdrop-blur-2xl border-b border-white/5" : "py-5 bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <motion.a href="#" className="mono text-xl font-bold gradient-text" whileHover={{ scale: 1.05 }}>
          {"<RS />"}
        </motion.a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <motion.a
              key={l} href={`#${l.toLowerCase()}`}
              className="text-sm text-slate-400 hover:text-white transition-colors relative group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              {l}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <motion.a
            href="mailto:rushabh1245@gmail.com"
            className="text-sm px-5 py-2 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600/30 transition-all"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          >
            Hire Me
          </motion.a>
        </div>
        <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 space-y-3"
          >
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="block text-slate-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>{l}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const role = useTypewriter(["Backend Architect", "AI Engineer", "Full Stack Developer", "System Designer"]);
  const [downloading, setDownloading] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" style={{ opacity: 0.55 }} />
      {/* Top spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />

      <Orb color="#8b5cf6" size={600} top="-10%" left="-8%" delay={0} opacity={0.1} />
      <Orb color="#06b6d4" size={500} top="50%" left="62%" delay={3} opacity={0.08} />
      <Orb color="#f472b6" size={300} top="20%" left="72%" delay={5} opacity={0.07} />

      <HeroRings />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 mb-10"
          style={{ border: "1px solid rgba(139,92,246,0.25)" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="mono text-xs text-slate-300 tracking-wide">Available for freelance work</span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl lg:text-[110px] font-black leading-none mb-4"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="gradient-text">Rushabh</span>
          <br />
          <span className="text-white">Savaliya</span>
        </motion.h1>

        <motion.div className="h-10 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="mono text-lg md:text-2xl text-cyan-400 font-medium">
            {role}<span className="animate-pulse ml-0.5">|</span>
          </span>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          Building <span className="text-violet-300 font-semibold">intelligent backend systems</span> and{" "}
          <span className="text-cyan-300 font-semibold">AI-powered applications</span> that scale
          seamlessly and deliver real business impact.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="group relative px-8 py-4 rounded-2xl overflow-hidden font-semibold text-lg text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">View Projects <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            </motion.button>
            <motion.a
              href="mailto:rushabh1245@gmail.com"
              className="px-8 py-4 rounded-2xl border border-white/15 text-slate-300 font-semibold text-lg hover:border-violet-400/50 hover:text-white hover:bg-white/3 transition-all"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              Get In Touch
            </motion.a>
          </div>
          <motion.button
            className="mono text-sm text-slate-500 hover:text-violet-300 underline-offset-4 hover:underline transition-all disabled:opacity-60 flex items-center gap-2"
            onClick={() => downloadResume(setDownloading)} disabled={downloading}
          >
            {downloading
              ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" /> Downloading...</>
              : <>Download Resume ↓</>}
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        >
          <span className="mono text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-violet-500 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════ */
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const stats = [
    { value: 3, suffix: "+", label: "Years Experience" },
    { value: 10, suffix: "+", label: "Projects Delivered" },
    { value: 5, suffix: "+", label: "Tech Domains" },
    { value: 100, suffix: "K+", label: "API Requests/mo" },
  ];
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <Orb color="#f59e0b" size={400} top="0" left="80%" delay={2} opacity={0.07} />
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={fadeUp}>
            <SectionLabel>01 — About Me</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black mb-16">
              I craft <span className="shimmer-text">digital systems</span>
              <br />that last.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div variants={fadeUp} className="space-y-5 text-slate-400 text-base leading-relaxed">
              <p>
                I&apos;m a <span className="text-violet-400 font-medium">Full-Stack Developer</span> with
                3+ years of experience specializing in{" "}
                <span className="text-violet-400 font-medium">backend architecture</span> and{" "}
                <span className="text-cyan-400 font-medium">AI integration</span>. My superpower?
                Engineering robust, scalable systems that handle complex logic with elegance.
              </p>
              <p>
                While I navigate the full stack comfortably, my passion ignites when tackling
                backend challenges — designing efficient APIs, optimizing database queries,
                building intelligent caching layers, and ensuring systems perform under pressure.
              </p>
              <p>
                I believe great software is invisible: it just works, scales, and empowers businesses
                to grow without friction.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              {[
                { icon: "🧠", title: "AI-Powered Platforms", desc: "Chatbots & forecasting with LangChain, Claude, OpenAI" },
                { icon: "🏗️", title: "Scalable Architecture", desc: "Microservices, REST APIs, real-time systems" },
                { icon: "🌍", title: "Global E-Commerce", desc: "Multi-language, multi-currency, 18-country deployments" },
                { icon: "⚡", title: "Performance First", desc: "Redis caching, CDN, sub-200ms response times" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-violet-500/20 transition-all cursor-default"
                  whileHover={{ x: 6 }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-white text-sm mb-0.5">{item.title}</div>
                    <div className="text-slate-500 text-sm">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center relative overflow-hidden group hover:border-violet-500/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-black gradient-text mb-1">
                  {inView ? <AnimCounter to={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                </div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   SKILLS — BENTO GRID
══════════════════════════════════════════════ */
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const colorMap = {
    violet: { tag: "bg-violet-500/10 border-violet-500/30 text-violet-300", dot: "bg-violet-400", glow: "rgba(139,92,246,0.12)" },
    cyan:   { tag: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",       dot: "bg-cyan-400",   glow: "rgba(6,182,212,0.12)"   },
    pink:   { tag: "bg-pink-500/10 border-pink-500/30 text-pink-300",       dot: "bg-pink-400",   glow: "rgba(236,72,153,0.12)"  },
    emerald:{ tag: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300", dot: "bg-emerald-400", glow: "rgba(16,185,129,0.12)" },
    amber:  { tag: "bg-amber-500/10 border-amber-500/30 text-amber-300",    dot: "bg-amber-400",  glow: "rgba(245,158,11,0.12)"  },
  };

  // Order matters for CSS grid auto-placement:
  // [AI (2-col)][Backend (1-col, row-span-2)]
  // [Databases] [Frontend]  [Backend cont.]
  // [Integrations (3-col full)]
  const items = [
    {
      label: "AI & Machine Learning", number: "02", color: "pink",
      col: "md:col-span-2", row: "",
      desc: "LLM integration, voice AI & vector search",
      skills: ["LangChain", "Anthropic Claude", "Eleven Labs", "Deepgram", "Vapi", "OpenAI", "RAG Systems", "Vector Search"],
    },
    {
      label: "Backend & APIs", number: "01", color: "violet",
      col: "", row: "md:row-span-2",
      desc: "Scalable server-side architecture",
      skills: ["Node.js", "Express.js", "REST APIs", "GraphQL", "Microservices", "JWT Auth", "WebSockets"],
    },
    {
      label: "Databases", number: "03", color: "cyan",
      col: "", row: "",
      desc: "Relational, NoSQL & vector storage",
      skills: ["Supabase", "MongoDB", "MySQL", "PostgreSQL", "Redis", "Pinecone"],
    },
    {
      label: "Frontend", number: "04", color: "emerald",
      col: "", row: "",
      desc: "Modern reactive user interfaces",
      skills: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Redux"],
    },
    {
      label: "Integrations & Tools", number: "05", color: "amber",
      col: "md:col-span-3", row: "",
      desc: "Third-party services, payments & cloud infrastructure",
      skills: ["Shopify API", "Stripe", "Twilio", "PayPal", "Braintree", "AWS S3", "AWS SQS", "Socket.io"],
    },
  ];

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #030712 0%, #060618 100%)" }}>
      <Orb color="#14b8a6" size={450} top="10%" left="85%" delay={1} opacity={0.07} />
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionLabel>02 — Technical Arsenal</SectionLabel>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2 className="text-4xl md:text-5xl font-black">Tools I <span className="gradient-text">master</span></h2>
          <p className="text-slate-500 max-w-xs text-sm">Technologies I leverage to architect powerful, scalable solutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const s = colorMap[item.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`glass rounded-2xl p-6 group relative overflow-hidden transition-all hover:border-white/15 ${item.col} ${item.row}`}
                whileHover={{ y: item.row ? 0 : -3 }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 25% 25%, ${s.glow} 0%, transparent 65%)` }}
                />
                {/* Ghost number */}
                <div
                  className="absolute right-3 bottom-1 mono font-black select-none pointer-events-none"
                  style={{ fontSize: 88, lineHeight: 1, color: "rgba(255,255,255,0.03)", letterSpacing: "-0.05em" }}
                >
                  {item.number}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                    <span className="font-bold text-white text-sm">{item.label}</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-5 pl-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, j) => (
                      <motion.span
                        key={j}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${s.tag} cursor-default`}
                        whileHover={{ scale: 1.06 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════ */
function Projects() {
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const projects = [
    {
      title: "Dental AI Assistant",
      subtitle: "AI-Powered Clinic Operations Platform for Dental Practices",
      tags: ["Node.js", "Supabase", "VAPI", "ElevenLabs", "Deepgram", "Twilio", "Google Calendar", "Stripe", "Stedi", "Claude AI"],
      accent: "#10b981", accentSecondary: "#06b6d4",
      images: ["/DentalAI/1.png", "/DentalAI/2.png", "/DentalAI/3.png", "/DentalAI/4.png"],
      highlights: [
        "VAPI-powered AI voice agent books, reschedules & cancels appointments live during patient calls — full autonomous scheduling cycle",
        "Voice-driven periodontal charting: spoken exam findings converted into structured tooth-by-tooth chart data with AI summaries",
        "End-to-end inventory system: multi-location stock, batch/serial tracking, purchase orders, transfers, shipments & supplier returns",
        "Gmail integration auto-classifies incoming emails into appointment, referral, or general-action workflows",
        "Practice availability engine with general & custom weekly hours, consumed by the scheduler, AI agent, and internal booking",
        "Stripe-integrated subscriptions & prepaid credits, Stedi-integrated dental insurance claim submission, and a persistent Claude-powered in-app chatbot",
      ],
      details: {
        overview: "Dental AI Assistant is a full-stack clinic operations platform that unifies appointment scheduling, patient communication, clinical documentation, referral processing, and dental-supply inventory into one system. It combines a role-based clinic dashboard with AI-assisted features — voice booking, email triage, and voice-to-chart documentation — so practices can run daily operations without juggling disconnected tools.",
        challenges: [
          "Letting an AI voice agent complete a full booking cycle (find doctor, check real availability, create/reschedule/cancel) without double-booking or violating practice hours",
          "Converting free-form spoken periodontal exam findings into structured, tooth-level clinical data reliably",
          "Classifying incoming Gmail messages into appointment vs. referral vs. general intent and routing them to the right workflow",
          "Modeling a variant-based inventory system with per-location stock, batch/serial compliance tracking, and atomic reversals on order cancellation",
          "Keeping a strict, non-skippable shipment status lifecycle in sync with automatic purchase-order and back-order fulfillment",
          "Gating an entire feature set (inventory, voice-to-text, billing) per practice via subscription tier without duplicating routes",
        ],
        solutions: [
          "Practice availability module (general + custom weekly hours) feeding a shared slot-finding service used by the public scheduler, internal booking, and the VAPI agent alike",
          "VAPI + ElevenLabs (TTS) + Deepgram (STT) voice pipeline where the agent collects patient details, matches or creates the patient by phone number, and calls the same appointment-creation logic as manual bookings — including Google Calendar sync and confirmation email",
          "Voice-to-chart pipeline for periodontal charting: recordings/transcripts are parsed into structured probing depth, recession, plaque, bleeding, mobility, and furcation entries plus an AI-generated summary",
          "Gmail intent classifier that routes messages into appointment review, referral handling, or follow-up queues instead of a raw inbox",
          "Inventory architecture built around products → variants → per-location variant_inventory, with dedicated batch and serial-number tables and cascade-safe delete logic",
          "Linear, validated state machines for shipments (Open → Delivered), purchase/back orders (draft → fulfilled), and supplier returns (draft → completed), with auto-promotion rules and full inventory reversal on order cancellation",
          "Feature-flag-driven access control gating entire route groups and navigation per practice, plus Stripe subscription/prepaid-credit billing with automatic redirect to pricing for unactivated practices",
        ],
        impact: [
          "AI voice agent independently completes the entire appointment lifecycle — booking, rescheduling, and cancellation — cutting after-hours and overflow call pressure on front-desk staff",
          "Periodontal charting time reduced through voice-driven capture that outputs structured, exportable chart history instead of manual entry",
          "Referral and appointment-related emails are triaged automatically, shortening response time and reducing missed referral cases",
          "Full dental-supply inventory lifecycle (products, suppliers, POs, transfers, shipments, returns) run through one traceable system with batch/serial-level compliance history",
          "Electronic dental insurance claim submission via Stedi replaces manual paper-based filing with a tracked digital audit trail",
          "Practice-level feature flags and Stripe billing let the same codebase serve clinics on different plans without forked deployments",
        ],
        techStack: {
          ai: ["Claude AI (chatbot & scribe)", "ElevenLabs (TTS)", "Deepgram (STT)", "VAPI (Voice Agent)"],
          backend: ["Node.js", "Express", "REST APIs", "Real-time/WebSocket events"],
          database: ["Supabase (PostgreSQL)", "Supabase Auth", "Supabase Storage"],
          communication: ["Twilio (Calls & SMS)", "Brevo (Email/SMTP)", "Gmail API"],
          integrations: ["Google Calendar API", "Stripe (Billing)", "Stedi (Insurance Claims)", "Open Dental API (Data Sync)"],
          features: ["Periodontal Charting", "Inventory & Batch/Serial Tracking", "Purchase/Back Orders", "Shipments & Supplier Returns", "Practice Availability Engine", "Embeddable Booking Widget"],
        },
      },
    },
    {
      title: "ForecastIQ",
      subtitle: "Multi-Tenant Shopify App for AI-Powered Inventory Forecasting & Demand Planning",
      tags: ["React", "Vite", "Ant Design", "Node.js", "MongoDB", "Shopify API", "Anthropic Claude", "Pinecone"],
      accent: "#8b5cf6", accentSecondary: "#06b6d4",
      highlights: [
        "Dual-mode multi-tenant platform — Shopify-connected stores or fully standalone inventory management from one codebase",
        "AI demand forecasting & baseline planning powered by Anthropic Claude + Pinecone vector search for context-aware recommendations",
        "Full purchase-to-sale lifecycle: purchase/back orders with cron-driven auto-purchase, sales orders/quotes/invoices, and customer & supplier returns",
        "Inventory operations suite spanning stock counts, transfers, adjustments, and batch/serial tracking across multiple store locations",
        "Customer analytics (CLV, churn, repeat-purchase rate) plus dual AI chatbots for admin insights and store-side support",
        "Dentist-specific tenant type adding sterilization test tracking and controlled substance reporting on top of the shared inventory core",
      ],
      details: {
        overview: "ForecastIQ is a multi-tenant Shopify app — with a standalone mode for sellers without a Shopify store — that unifies inventory forecasting, demand planning, purchasing, sales order management, and multi-location stock tracking behind AI-powered analytics. A 60+ model MongoDB backend mirrors a React + Ant Design frontend, with Claude-based forecasting, vector search, and chatbots layered on top of live Shopify order and inventory data.",
        challenges: [
          "Supporting both Shopify-connected and fully standalone inventory modes from a single multi-tenant codebase without diverging business logic",
          "Keeping local product/order/inventory data in sync with Shopify via REST/GraphQL and webhooks in near real time",
          "Forecasting demand accurately across 60+ interlinked domain models spanning purchasing, sales, and inventory operations",
          "Gating AI token limits, ML training frequency, user slots, and storage per subscription tier without duplicating routes",
          "Coordinating recurring automation — auto-purchase, stock alerts, AI training, expiry checks — via cron without schedule collisions",
          "Extending the platform for a dentist vertical (sterilization tests, controlled substance reporting) without polluting the general retail flow",
        ],
        solutions: [
          "TenantId-scoped multi-tenancy with a user-mode header distinguishing Shopify vs. Standalone requests across all backend models",
          "REST/GraphQL Shopify integration plus webhook-driven sync keeping products, orders, and inventory current between Shopify and MongoDB",
          "Anthropic Claude SDK + Pinecone vector DB combination powering demand forecasting, baseline planning, and contextually aware admin/customer chatbots",
          "Centralized cron scheduler coordinating auto-purchase, alerts, AI training, webhook sync, and expiry checks in one place",
          "Tenant-type flag (general vs. dentist) that conditionally unlocks sterilization/controlled-substance modules on top of the shared inventory core",
          "Mirrored FE/BE domain convention — route module, Mongoose model, service file, and page folder per domain — keeping 15+ domains consistent as the app scales",
        ],
        impact: [
          "One codebase serves both Shopify-embedded merchants and standalone inventory users, avoiding a forked product",
          "Purchase-to-sale operations (POs, back orders, sales orders/quotes/invoices, returns) fully digitized, with cron-driven auto-purchase reducing manual reordering",
          "AI-driven demand forecasting and baseline planning give merchants forward-looking stock guidance instead of reactive restocking",
          "Dual AI chatbots cut manual admin analytics lookups and reduce customer support workload",
          "Subscription-gated AI/ML usage and storage limits support a scalable, tiered SaaS pricing model with free-trial onboarding",
          "Dentist-specific compliance tracking (sterilization tests, controlled substances) extends the platform into a regulated vertical beyond general retail",
        ],
        techStack: {
          frontend: ["React 18", "Vite", "Ant Design", "React Query", "React Router", "Axios", "i18next", "Recharts", "Shopify App Bridge"],
          backend: ["Node.js (ES Modules)", "Express", "MongoDB + Mongoose", "JWT + bcrypt", "node-cron"],
          ai: ["Anthropic Claude SDK", "Pinecone (Vector DB)"],
          integrations: ["Shopify API (REST + GraphQL)", "Shopify Webhooks"],
          storage: ["AWS S3 (Files/PDFs/Images)", "Brevo (Transactional Email)"],
        },
      },
    },
    {
      title: "DC Dial",
      subtitle: "Enterprise Chrome Extension with Microservices Architecture",
      tags: ["Chrome Extension", "Microservices", "Node.js", "AWS SQS", "OpenAI", "React"],
      accent: "#6366f1", accentSecondary: "#a855f7",
      highlights: [
        "Architected 7-microservice backend ensuring scalability and optimal performance",
        "Role-based access control for Admin, User, and Customer roles",
        "Multiple payment gateways for flexible payment processing",
        "AWS SQS for asynchronous messaging and efficient data handling",
        "OpenAI API for intelligent SMS, email, and call automation",
      ],
      details: {
        overview: "Enterprise Chrome extension transforming communication management with intelligent automation for SMS, email, and call workflows on a robust microservices backbone.",
        challenges: [
          "Designing a scalable microservices architecture for enterprise traffic",
          "Secure role-based access across multiple user types with different permissions",
          "Integrating multiple payment gateways while maintaining PCI compliance",
          "Managing asynchronous message processing without data loss",
        ],
        solutions: [
          "7 independent microservices (Auth, User Mgmt, Payments, Comms, Analytics, Notifications, API Gateway)",
          "JWT-based auth with granular permissions for Admin/User/Customer roles",
          "Stripe, PayPal, Razorpay with unified payment layer and automatic failover",
          "AWS SQS handling 50,000+ messages/hour for async processing",
        ],
        impact: [
          "500+ enterprise clients with 99.9% uptime",
          "70% reduction in communication management time",
          "$2M+ processed with zero payment failures",
          "Sub-200ms response across all microservices",
        ],
        techStack: {
          frontend: ["React", "Chrome Extension APIs", "Redux Toolkit"],
          backend: ["Node.js", "Express", "Microservices"],
          ai: ["OpenAI GPT-4", "NLP"],
          messaging: ["AWS SQS", "Redis Pub/Sub", "WebSockets"],
          payments: ["Stripe", "PayPal", "Razorpay"],
          database: ["PostgreSQL", "MongoDB", "Redis"],
        },
      },
    },
    {
      title: "Car Cover Factory",
      subtitle: "Multi-Language E-Commerce Platform — 18 Global Markets",
      tags: ["Node.js", "Redis", "React", "PayPal", "Stripe", "AWS S3"],
      accent: "#f59e0b", accentSecondary: "#ef4444",
      highlights: [
        "19 language versions across 18 international markets (14 EU + 4 global)",
        "Multi-currency system with PayPal, Braintree, and Stripe",
        "Redis caching reducing DB queries by 70%",
        "AWS S3 + CloudFront CDN for global image delivery",
        "Google Ads, Facebook Ads, Bing Ads campaigns with ROI tracking",
      ],
      details: {
        overview: "Global e-commerce platform serving automotive accessories customers across 18 markets with full localization, multi-currency payments, and optimized performance.",
        challenges: [
          "Managing 19 language versions with region-specific SEO",
          "Multi-currency with real-time exchange rates",
          "Fast global image delivery with cost optimization",
          "Coordinating advertising across multiple platforms and regions",
        ],
        solutions: [
          "i18n system supporting 19 languages with auto locale detection and SEO URLs",
          "PayPal, Braintree, Stripe with 15+ currencies and real-time exchange rates",
          "Redis caching reducing DB queries by 70%, improving response by 60%",
          "AWS S3 + CloudFront with WebP format reducing bandwidth by 45%",
        ],
        impact: [
          "300% increase in international sales in year one",
          "Page load: 4.2s → 1.8s globally",
          "50,000+ orders across 18 countries with 99.8% payment success",
          "4.2x ROAS on advertising campaigns",
        ],
        techStack: {
          frontend: ["React", "Next.js", "Redux", "Tailwind", "i18next"],
          backend: ["Node.js", "Express", "REST APIs"],
          database: ["MongoDB", "Redis"],
          payments: ["PayPal", "Braintree", "Stripe"],
          cloud: ["AWS S3", "CloudFront", "EC2"],
        },
      },
    },
    {
      title: "DigiPay",
      subtitle: "Digital Wallet & Payment Services Platform",
      tags: ["Node.js", "MongoDB", "Braintree", "Stripe", "PayPal", "PhonePe", "UPI"],
      accent: "#06b6d4", accentSecondary: "#0284c7",
      highlights: [
        "Full-stack digital wallet system similar to Paytm",
        "4 payment gateways: Braintree, Stripe, PayPal, PhonePe",
        "Secure bank account linking and wallet management",
        "Services: credit card payments, mobile recharge, flight booking, UPI transfers",
        "AES-256 encryption with real-time balance updates",
      ],
      details: {
        overview: "Comprehensive digital wallet platform providing unified financial transactions — wallet management, bill payments, mobile recharges, flight bookings, and instant UPI transfers.",
        challenges: [
          "Secure wallet with transaction integrity and user privacy",
          "Multi-gateway integration with consistent UX across all methods",
          "Real-time balance updates without race conditions",
          "PCI-DSS compliance and bank-level security",
        ],
        solutions: [
          "AES-256 encryption, 2FA, biometric verification for high-value transactions",
          "4 gateways with unified abstraction layer and smart gateway selection",
          "Secure bank linking via micro-deposits + instant UPI handle verification",
          "ACID-compliant transactions with distributed locks and audit trails",
        ],
        impact: [
          "50,000+ users in 6 months with zero security breaches",
          "$5M+ processed with 99.9% success rate",
          "Transaction time: 45s → 8s",
          "30,000+ monthly P2P UPI transfers with instant settlement",
        ],
        techStack: {
          frontend: ["React Native", "React", "Redux"],
          backend: ["Node.js", "Express", "Microservices"],
          database: ["MongoDB", "Redis"],
          payments: ["Braintree", "Stripe", "PayPal", "PhonePe", "UPI"],
          security: ["JWT", "bcrypt", "AES-256", "2FA"],
        },
      },
    },
  ];

  return (
    <>
      <section id="projects" className="py-32 px-6 relative overflow-hidden">
        <Orb color="#ec4899" size={500} top="20%" left="-10%" delay={1} opacity={0.07} />
        <div className="max-w-6xl mx-auto" ref={ref}>
          <SectionLabel>03 — Featured Projects</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <h2 className="text-4xl md:text-5xl font-black">Work I&apos;m <span className="gradient-text">proud of</span></h2>
            <p className="text-slate-500 max-w-xs text-sm">Real projects, real impact, real scale.</p>
          </div>

          <div className="space-y-5">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
              >
                <SpotlightCard
                  className="glass rounded-3xl cursor-pointer hover:border-white/12 transition-all"
                  onClick={() => setSelected(p)}
                >
                  {/* Left gradient border */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${p.accent}, ${p.accentSecondary})`, borderRadius: "12px 0 0 12px" }} />

                  {/* Ghost watermark number */}
                  <div
                    className="absolute right-6 bottom-0 font-black select-none pointer-events-none"
                    style={{ fontSize: 170, lineHeight: 0.9, color: "rgba(255,255,255,0.02)", fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.06em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="p-8 md:p-10 pl-10 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-2/5">
                        <div className="mono text-xs mb-3" style={{ color: p.accent }}>
                          PROJECT {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black mb-2 text-white">{p.title}</h3>
                        <p className="text-slate-400 mb-6 text-sm leading-relaxed">{p.subtitle}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.tags.map((t, j) => (
                            <span key={j} className="text-xs px-3 py-1 rounded-full border border-white/8 text-slate-500 bg-white/2">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:w-3/5">
                        <div className="mono text-xs font-semibold mb-4" style={{ color: p.accent }}>KEY ACHIEVEMENTS</div>
                        <div className="space-y-3">
                          {p.highlights.slice(0, 3).map((h, j) => (
                            <div key={j} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: p.accent }} />
                              <p className="text-slate-400 text-sm leading-relaxed">{h}</p>
                            </div>
                          ))}
                        </div>
                        <button className="mt-6 mono text-xs flex items-center gap-2 hover:gap-3 transition-all" style={{ color: p.accent }}>
                          View full case study →
                        </button>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(3,7,18,0.88)", backdropFilter: "blur(16px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#0a0a18] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${selected.accent}, ${selected.accentSecondary})` }} />
              <div className="sticky top-0 bg-[#0a0a18]/95 backdrop-blur-xl border-b border-white/8 p-8 flex justify-between items-start z-10">
                <div>
                  <div className="mono text-xs mb-2" style={{ color: selected.accent }}>CASE STUDY</div>
                  <h3 className="text-4xl font-black text-white mb-1">{selected.title}</h3>
                  <p className="text-slate-400">{selected.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all flex-shrink-0 ml-4"
                >✕</button>
              </div>

              <div className="p-8 space-y-10">
                {selected.images?.length > 0 && (
                  <div>
                    <div className="mono text-xs mb-4" style={{ color: selected.accent }}>SCREENSHOTS</div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selected.images.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-white/3">
                          <img src={img} alt={`${selected.title} screenshot ${i + 1}`} className="w-full h-48 object-cover pointer-events-none select-none" draggable={false} onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="mono text-xs mb-3" style={{ color: selected.accent }}>OVERVIEW</div>
                  <p className="text-slate-300 leading-relaxed">{selected.details.overview}</p>
                </div>

                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>CHALLENGES</div>
                  <div className="space-y-3">
                    {selected.details.challenges.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-red-500/15 bg-red-500/5">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">◆</span>
                        <p className="text-slate-400 text-sm leading-relaxed">{c}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>SOLUTIONS</div>
                  <div className="space-y-3">
                    {selected.details.solutions.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 + 0.2 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                        <p className="text-slate-400 text-sm leading-relaxed">{s}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>IMPACT & RESULTS</div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selected.details.impact.map((imp, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 + 0.4 }}
                        className="p-4 rounded-xl glass border" style={{ borderColor: `${selected.accent}25` }}>
                        <div className="flex items-start gap-3">
                          <span className="text-lg">📈</span>
                          <p className="text-slate-300 text-sm leading-relaxed">{imp}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>TECH STACK</div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(selected.details.techStack).map(([cat, techs]) => (
                      <div key={cat} className="glass rounded-xl p-4">
                        <div className="text-white text-xs font-semibold capitalize mb-3">{cat}</div>
                        <div className="flex flex-wrap gap-2">
                          {techs.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-400">{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/8 flex justify-end">
                <button onClick={() => setSelected(null)} className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════
   EXPERIENCE
══════════════════════════════════════════════ */
function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const experiences = [
    {
      period: "2024 — Present", role: "Full Stack Developer", company: "Freelance / Contract", type: "Remote",
      desc: "Specialized in backend architecture and AI integration for global clients.",
      achievements: [
        "15+ production apps across e-commerce, AI, and SaaS domains",
        "Backend systems handling 100K+ monthly API requests",
        "AI/ML integrations using LangChain and modern LLM APIs",
        "Mentored junior developers on architecture and best practices",
      ],
    },
    {
      period: "2023 — 2024", role: "Backend Developer", company: "Tech Startup", type: "Full-time",
      desc: "Built core backend infrastructure for an emerging SaaS platform.",
      achievements: [
        "RESTful APIs serving 50K+ daily users",
        "3× faster query execution through DB optimization",
        "Real-time features with WebSockets and Redis Pub/Sub",
        "CI/CD pipelines reducing deployment time by 70%",
      ],
    },
  ];

  return (
    <section id="experience" className="py-32 px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #030712 0%, #060618 100%)" }}>
      <Orb color="#3b82f6" size={450} top="10%" left="-10%" delay={2} opacity={0.07} />
      <div className="max-w-4xl mx-auto" ref={ref}>
        <SectionLabel>04 — Experience</SectionLabel>
        <h2 className="text-4xl md:text-5xl font-black mb-16">My <span className="gradient-text">journey</span></h2>

        <div className="relative">
          <motion.div
            className="absolute left-6 top-0 w-px"
            style={{ background: "linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)", originY: 0 }}
            initial={{ scaleY: 0, height: "100%" }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
          />
          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2 + 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-16"
              >
                <div className="absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-[#060618] bg-violet-500 z-10" />
                <div className="glass rounded-2xl p-7 hover:border-white/15 transition-all">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="mono text-xs text-violet-400">{exp.period}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-500">{exp.type}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{exp.role}</h3>
                  <div className="text-slate-400 font-medium mb-4">{exp.company}</div>
                  <p className="text-slate-500 text-sm mb-5">{exp.desc}</p>
                  <div className="space-y-2.5">
                    {exp.achievements.map((a, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <span className="text-violet-400 mt-1 flex-shrink-0 text-xs">◆</span>
                        <span className="text-slate-400 text-sm">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════ */
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const contacts = [
    { icon: "✉", label: "Email", value: "rushabh1245@gmail.com", href: "mailto:rushabh1245@gmail.com" },
    { icon: "in", label: "LinkedIn", value: "/rushabh-savaliya", href: "https://linkedin.com/in/rushabh-savaliya" },
    { icon: "{}", label: "GitHub", value: "/rushabh-savaliya", href: "https://github.com/russsavaliya" },
  ];

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <Orb color="#8b5cf6" size={600} top="0%" left="30%" delay={0} opacity={0.07} />
      <Orb color="#22c55e" size={400} top="50%" left="60%" delay={3} opacity={0.06} />
      <div className="max-w-4xl mx-auto text-center relative z-10" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <SectionLabel>05 — Contact</SectionLabel>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            Let&apos;s build <span className="gradient-text">something</span>
            <br />great together.
          </h2>
          <p className="text-slate-400 text-lg mb-16 max-w-xl mx-auto">
            Have a project in mind? Need a backend expert or AI integration specialist?
            I&apos;d love to hear from you.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-4 mb-12" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }}>
          {contacts.map((c, i) => (
            <motion.a
              key={i} href={c.href} target="_blank" rel="noreferrer"
              className="glass rounded-2xl p-6 block hover:border-violet-500/30 transition-all group"
              whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mono text-2xl text-violet-400 mb-3 group-hover:scale-110 transition-transform inline-block">{c.icon}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{c.label}</div>
              <div className="text-white text-sm font-medium">{c.value}</div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
          <motion.a
            href="mailto:rushabh1245@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg glow-violet transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          >
            Send a Message <span>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="mono text-lg font-bold gradient-text mb-1">{"<RS />"}</div>
          <p className="text-slate-600 text-xs">Backend Architect · AI Engineer · Full Stack Developer</p>
        </div>
        <div className="flex gap-6">
          {[
            { label: "GitHub", href: "https://github.com/russsavaliya" },
            { label: "LinkedIn", href: "https://linkedin.com/in/rushabh-savaliya" },
            { label: "Email", href: "mailto:rushabh1245@gmail.com" },
          ].map((s) => (
            <motion.a key={s.label} href={s.href} className="text-slate-600 hover:text-slate-300 text-sm transition-colors" whileHover={{ y: -2 }}>
              {s.label}
            </motion.a>
          ))}
        </div>
        <p className="text-slate-700 text-xs">© 2026 Rushabh Savaliya</p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export default function Portfolio() {
  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden" style={{ background: "#030712" }}>
      <style>{fontStyle}</style>
      <GrainOverlay />
      <CursorGlow />
      <Navbar />
      <Hero />
      <About />
      <TechMarquee />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}
