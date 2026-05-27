import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";

/* ─── FONTS ─── */
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
  ::-webkit-scrollbar-track { background: #0a0a16; }
  ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 2px; }

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
  .glow-violet { box-shadow: 0 0 40px rgba(139,92,246,0.25); }
  .glow-cyan { box-shadow: 0 0 40px rgba(6,182,212,0.25); }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .float-anim { animation: float 6s ease-in-out infinite; }
  .float-anim-slow { animation: float 9s ease-in-out infinite; }

  .card-tilt {
    transition: transform 0.3s ease;
    transform-style: preserve-3d;
  }
  .card-tilt:hover { transform: perspective(1000px) rotateX(-3deg) rotateY(3deg) scale(1.02); }
`;

/* ─── TYPEWRITER HOOK ─── */
function useTypewriter(words, delay = 120) {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const word = words[idx];
    let timeout;
    if (!deleting && charIdx <= word.length) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, delay);
    } else if (!deleting && charIdx > word.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIdx));
        setCharIdx((c) => c - 1);
      }, delay / 2);
    } else {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
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
    const steps = 50;
    const inc = to / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 40);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
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
      className="fixed pointer-events-none z-0"
      style={{ width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
      animate={{ left: pos.x - 250, top: pos.y - 250 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    />
  );
}

/* ─── ORB ─── */
function Orb({ color, size, top, left, delay = 0, opacity = 0.12 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left,
        background: color, filter: "blur(80px)", opacity }}
      animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
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
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#0a0a16]/80 backdrop-blur-2xl border-b border-white/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <motion.a
          href="#"
          className="mono text-xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          {"<RS />"}
        </motion.a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <motion.a
              key={l}
              href={`#${l.toLowerCase()}`}
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Hire Me
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a16]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 space-y-3"
          >
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="block text-slate-300 hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                {l}
              </a>
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

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Orbs */}
      <Orb color="#8b5cf6" size={600} top="-10%" left="-10%" delay={0} />
      <Orb color="#06b6d4" size={500} top="50%" left="60%" delay={3} />
      <Orb color="#f472b6" size={300} top="20%" left="70%" delay={5} opacity={0.08} />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="mono text-xs text-slate-400 tracking-wide">Available for freelance work</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="gradient-text">Rushabh</span>
          <br />
          <span className="text-white">Savaliya</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          className="h-10 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="mono text-lg md:text-2xl text-cyan-400 font-medium">
            {role}
            <span className="animate-pulse ml-0.5">|</span>
          </span>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Building <span className="text-violet-400 font-semibold">intelligent backend systems</span> and
          {" "}<span className="text-cyan-400 font-semibold">AI-powered applications</span> that scale
          seamlessly and deliver real business impact.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            className="group relative px-8 py-4 rounded-2xl bg-violet-600 text-white font-semibold text-lg overflow-hidden"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">View Projects <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </motion.button>
          <motion.a
            href="mailto:rushabh1245@gmail.com"
            className="px-8 py-4 rounded-2xl glass text-slate-200 font-semibold text-lg hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
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

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <Orb color="#7c3aed" size={400} top="0" left="80%" delay={2} opacity={0.08} />

      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>01 — About Me</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black mb-16">
              I craft{" "}
              <span className="shimmer-text">digital systems</span>
              <br />
              that last.
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
                  className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-violet-500/20 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-white text-sm">{item.title}</div>
                    <div className="text-slate-500 text-sm">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 text-center relative overflow-hidden group hover:border-violet-500/30 transition-all"
              >
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
   SKILLS
══════════════════════════════════════════════ */
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const categories = [
    {
      label: "Backend & APIs",
      color: "violet",
      skills: ["Node.js", "Express.js", "REST APIs", "GraphQL", "Microservices", "JWT Auth", "WebSockets"],
    },
    {
      label: "Databases",
      color: "cyan",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Pinecone Vector DB"],
    },
    {
      label: "AI & Machine Learning",
      color: "pink",
      skills: ["LangChain", "Anthropic Claude", "OpenAI GPT-4", "Vector Search", "RAG Systems"],
    },
    {
      label: "Frontend",
      color: "emerald",
      skills: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Redux"],
    },
    {
      label: "Integrations & Tools",
      color: "amber",
      skills: ["Shopify API", "Stripe", "PayPal", "Braintree", "AWS S3", "AWS SQS", "Socket.io"],
    },
  ];

  const colorMap = {
    violet: { tag: "bg-violet-500/10 border-violet-500/30 text-violet-300", dot: "bg-violet-400" },
    cyan: { tag: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300", dot: "bg-cyan-400" },
    pink: { tag: "bg-pink-500/10 border-pink-500/30 text-pink-300", dot: "bg-pink-400" },
    emerald: { tag: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300", dot: "bg-emerald-400" },
    amber: { tag: "bg-amber-500/10 border-amber-500/30 text-amber-300", dot: "bg-amber-400" },
    blue: { tag: "bg-blue-500/10 border-blue-500/30 text-blue-300", dot: "bg-blue-400" },
  };

  return (
    <section id="skills" className="py-32 px-6 relative" style={{ background: "linear-gradient(180deg, #030712 0%, #060618 100%)" }}>
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionLabel>02 — Technical Arsenal</SectionLabel>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2 className="text-4xl md:text-5xl font-black">
            Tools I <span className="gradient-text">master</span>
          </h2>
          <p className="text-slate-500 max-w-xs">Technologies I leverage to architect powerful, scalable solutions.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const styles = colorMap[cat.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-2xl p-6 group hover:border-white/15 transition-all card-tilt"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                  <span className="font-semibold text-white text-sm">{cat.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, j) => (
                    <motion.span
                      key={j}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${styles.tag} cursor-default`}
                      whileHover={{ scale: 1.06 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
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
      title: "ForecastIQ",
      subtitle: "AI-Driven E-Commerce Intelligence Platform",
      tags: ["Node.js", "LangChain", "Anthropic", "Pinecone", "React", "Shopify API"],
      accent: "#8b5cf6",
      accentSecondary: "#06b6d4",
      size: "large",
      highlights: [
        "Built AI-powered forecasting system predicting product demand 1-2 months ahead",
        "Integrated real-time Shopify webhooks for order & inventory tracking",
        "Dual AI chatbots: Admin analytics assistant & Customer support automation",
        "Vector search using Pinecone for contextual AI understanding",
        "Reduced manual support workload by 60% through intelligent automation",
      ],
      details: {
        overview: "ForecastIQ is a comprehensive AI-driven e-commerce intelligence platform designed to revolutionize inventory management and customer support through advanced ML and NLP.",
        challenges: [
          "Accurately forecasting demand across varying seasonal trends and market conditions",
          "Processing large volumes of real-time e-commerce data from multiple sources",
          "Creating contextually aware AI chatbots that understand business-specific terminology",
          "Ensuring seamless Shopify integration without disrupting live operations",
        ],
        solutions: [
          "LangChain + Claude AI for intelligent demand forecasting using historical data and seasonal patterns",
          "Real-time data pipeline via Shopify webhooks for instant order and inventory capture",
          "Pinecone vector database for semantic search and contextual AI recommendations",
          "Dual-purpose chatbot: admin analytics insights + customer support automation",
        ],
        impact: [
          "85% accuracy in demand forecasting, reducing overstock by 40%",
          "10,000+ real-time events processed daily with <2s latency",
          "60% of support queries resolved without human intervention",
          "25% revenue increase from admin analytics insights",
        ],
        techStack: {
          frontend: ["React", "Redux", "Tailwind CSS", "Chart.js"],
          backend: ["Node.js", "Express", "LangChain", "Anthropic Claude API"],
          database: ["Pinecone Vector DB", "MongoDB"],
          integrations: ["Shopify API", "Webhooks"],
          deployment: ["AWS EC2", "Docker", "Nginx"],
        },
      },
    },
    {
      title: "DC Dial",
      subtitle: "Enterprise Chrome Extension with Microservices Architecture",
      tags: ["Chrome Extension", "Microservices", "Node.js", "AWS SQS", "OpenAI", "React"],
      accent: "#6366f1",
      accentSecondary: "#a855f7",
      size: "medium",
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
      accent: "#f59e0b",
      accentSecondary: "#ef4444",
      size: "medium",
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
      title: "Dental AI",
      subtitle: "AI-Powered SaaS Platform for Dental Practice Automation",
      tags: ["Node.js", "Supabase", "ElevenLabs", "Deepgram", "Vapi", "Twilio", "Brevo", "Google Calendar"],
      accent: "#10b981",
      accentSecondary: "#06b6d4",
      size: "large",
      highlights: [
        "AI reads incoming emails and auto-detects appointment requests using NLP",
        "Automatically books appointments synced to Google Calendar and in-app calendar",
        "AI voice agent calls patients via Vapi — discusses issues, books appointments autonomously",
        "ElevenLabs + Deepgram for human-like voice AI; Twilio for calls & SMS; Brevo for emails",
        "Full inventory management with product variants, batch/serial numbers, expiry-based auto-removal",
        "Order, shipment & supplier management — almost entirely AI-driven workflows",
      ],
      details: {
        overview: "Dental AI is a comprehensive SaaS platform that transforms dental practice management through end-to-end AI automation. From reading emails and booking appointments to making patient calls and managing inventory — the platform replaces manual tasks with intelligent, autonomous AI workflows powered by the latest voice and language models.",
        challenges: [
          "Accurately classifying emails as appointment requests vs. general queries using AI",
          "Seamlessly syncing appointments across Google Calendar and internal app in real time",
          "Building a voice AI agent that sounds natural and can handle patient conversations autonomously",
          "Managing complex inventory with variants, batches, serial numbers, and auto-expiry logic",
          "Orchestrating multiple AI services (voice, transcription, email, SMS) into one cohesive workflow",
        ],
        solutions: [
          "NLP email parser using LLM to classify intent, extract date/time/doctor preferences from raw email text",
          "Google Calendar API + internal Supabase DB sync ensuring appointments are reflected everywhere instantly",
          "Vapi-powered voice AI with ElevenLabs for natural speech synthesis and Deepgram for real-time transcription — AI calls patients, understands responses, and books autonomously",
          "Twilio integration for outbound/inbound SMS and calls; Brevo for templated email confirmations",
          "Inventory system with product variants, batch & serial number tracking, expiry-date-based auto-removal, low-stock alerts",
          "Order & shipment management linked to supplier records — AI handles reorder suggestions and status updates",
        ],
        impact: [
          "90%+ of appointment booking tasks automated end-to-end without staff intervention",
          "AI voice agent handles patient calls with human-like quality using ElevenLabs + Deepgram",
          "Zero missed appointments from email — AI parses and acts on every incoming message",
          "Inventory accuracy improved with auto-expiry, batch tracking, and smart reorder triggers",
          "Practices report saving 15+ staff-hours per week through AI-driven workflow automation",
          "Multi-channel patient communication: voice call, SMS, and email — all AI-orchestrated",
        ],
        techStack: {
          ai: ["ElevenLabs (TTS)", "Deepgram (STT)", "Vapi (Voice Agent)", "LLM (Intent Parsing)"],
          backend: ["Node.js", "Express", "REST APIs"],
          database: ["Supabase (PostgreSQL)"],
          communication: ["Twilio (Calls & SMS)", "Brevo (Email)"],
          integrations: ["Google Calendar API", "Gmail API"],
          features: ["Inventory Mgmt", "Batch/Serial Numbers", "Auto-Expiry", "Order & Shipment", "Supplier Mgmt"],
        },
      },
    },
    {
      title: "DigiPay",
      subtitle: "Digital Wallet & Payment Services Platform",
      tags: ["Node.js", "MongoDB", "Braintree", "Stripe", "PayPal", "PhonePe", "UPI"],
      accent: "#06b6d4",
      accentSecondary: "#0284c7",
      size: "large",
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
        <Orb color="#6366f1" size={500} top="20%" left="-10%" delay={1} opacity={0.07} />
        <div className="max-w-6xl mx-auto" ref={ref}>
          <SectionLabel>03 — Featured Projects</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <h2 className="text-4xl md:text-5xl font-black">
              Work I&apos;m <span className="gradient-text">proud of</span>
            </h2>
            <p className="text-slate-500 max-w-xs">Real projects, real impact, real scale.</p>
          </div>

          <div className="space-y-6">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl overflow-hidden group cursor-pointer hover:border-white/15 transition-all"
                onClick={() => setSelected(p)}
                whileHover={{ y: -3 }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accentSecondary})` }}
                />

                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left */}
                    <div className="md:w-2/5">
                      <div className="mono text-xs mb-3" style={{ color: p.accent }}>
                        PROJECT {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black mb-2 text-white">{p.title}</h3>
                      <p className="text-slate-400 mb-6 text-sm leading-relaxed">{p.subtitle}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((t, j) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-lg border border-white/10 text-slate-400 bg-white/3">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="md:w-3/5">
                      <div className="text-xs font-semibold mb-4" style={{ color: p.accent }}>
                        KEY ACHIEVEMENTS
                      </div>
                      <div className="space-y-3">
                        {p.highlights.slice(0, 3).map((h, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: p.accent }} />
                            <p className="text-slate-400 text-sm leading-relaxed">{h}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        className="mt-6 mono text-xs flex items-center gap-2 transition-all group-hover:gap-3"
                        style={{ color: p.accent }}
                      >
                        View full case study →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(3,7,18,0.85)", backdropFilter: "blur(16px)" }}
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
              {/* Modal header accent */}
              <div className="h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${selected.accent}, ${selected.accentSecondary})` }} />

              {/* Header */}
              <div className="sticky top-0 bg-[#0a0a18]/95 backdrop-blur-xl border-b border-white/8 p-8 flex justify-between items-start z-10">
                <div>
                  <div className="mono text-xs mb-2" style={{ color: selected.accent }}>CASE STUDY</div>
                  <h3 className="text-4xl font-black text-white mb-1">{selected.title}</h3>
                  <p className="text-slate-400">{selected.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all flex-shrink-0 ml-4"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 space-y-10">
                {/* Overview */}
                <div>
                  <div className="mono text-xs mb-3" style={{ color: selected.accent }}>OVERVIEW</div>
                  <p className="text-slate-300 leading-relaxed">{selected.details.overview}</p>
                </div>

                {/* Challenges */}
                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>CHALLENGES</div>
                  <div className="space-y-3">
                    {selected.details.challenges.map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-red-500/15 bg-red-500/5"
                      >
                        <span className="text-red-400 mt-0.5 flex-shrink-0">◆</span>
                        <p className="text-slate-400 text-sm leading-relaxed">{c}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>SOLUTIONS</div>
                  <div className="space-y-3">
                    {selected.details.solutions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 + 0.2 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5"
                      >
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                        <p className="text-slate-400 text-sm leading-relaxed">{s}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>IMPACT & RESULTS</div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selected.details.impact.map((imp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07 + 0.4 }}
                        className="p-4 rounded-xl glass border"
                        style={{ borderColor: `${selected.accent}25` }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">📈</span>
                          <p className="text-slate-300 text-sm leading-relaxed">{imp}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tech stack */}
                <div>
                  <div className="mono text-xs mb-4" style={{ color: selected.accent }}>TECH STACK</div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(selected.details.techStack).map(([cat, techs]) => (
                      <div key={cat} className="glass rounded-xl p-4">
                        <div className="text-white text-xs font-semibold capitalize mb-3">{cat}</div>
                        <div className="flex flex-wrap gap-2">
                          {techs.map((t) => (
                            <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-400">{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/8 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm"
                >
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
      period: "2024 — Present",
      role: "Full Stack Developer",
      company: "Freelance / Contract",
      type: "Remote",
      desc: "Specialized in backend architecture and AI integration for global clients.",
      achievements: [
        "15+ production apps across e-commerce, AI, and SaaS domains",
        "Backend systems handling 100K+ monthly API requests",
        "AI/ML integrations using LangChain and modern LLM APIs",
        "Mentored junior developers on architecture and best practices",
      ],
    },
    {
      period: "2023 — 2024",
      role: "Backend Developer",
      company: "Tech Startup",
      type: "Full-time",
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
    <section id="experience" className="py-32 px-6 relative" style={{ background: "linear-gradient(180deg, #030712 0%, #060618 100%)" }}>
      <div className="max-w-4xl mx-auto" ref={ref}>
        <SectionLabel>04 — Experience</SectionLabel>
        <h2 className="text-4xl md:text-5xl font-black mb-16">
          My <span className="gradient-text">journey</span>
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-6 top-0 w-px"
            style={{ background: "linear-gradient(180deg, #8b5cf6 0%, #06b6d4 100%)", originY: 0 }}
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
                {/* Dot */}
                <div className="absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-[#0a0a16] bg-violet-500 z-10" />

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
    { icon: "{}", label: "GitHub", value: "/rushabh-savaliya", href: "https://github.com/rushabh-savaliya" },
  ];

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <Orb color="#8b5cf6" size={600} top="0%" left="30%" delay={0} opacity={0.07} />
      <Orb color="#06b6d4" size={400} top="50%" left="60%" delay={3} opacity={0.06} />

      <div className="max-w-4xl mx-auto text-center relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel>05 — Contact</SectionLabel>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            Let&apos;s build{" "}
            <span className="gradient-text">something</span>
            <br />
            great together.
          </h2>
          <p className="text-slate-400 text-lg mb-16 max-w-xl mx-auto">
            Have a project in mind? Need a backend expert or AI integration specialist?
            I&apos;d love to hear from you.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {contacts.map((c, i) => (
            <motion.a
              key={i}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-2xl p-6 block hover:border-violet-500/30 transition-all group"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mono text-2xl text-violet-400 mb-3 group-hover:scale-110 transition-transform inline-block">{c.icon}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{c.label}</div>
              <div className="text-white text-sm font-medium">{c.value}</div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="mailto:rushabh1245@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-violet-600 text-white font-bold text-lg hover:bg-violet-500 transition-all glow-violet"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
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
            { label: "GitHub", href: "https://github.com/rushabh-savaliya" },
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
    <div
      className="min-h-screen text-slate-100 overflow-x-hidden"
      style={{ background: "#030712" }}
    >
      <style>{fontStyle}</style>
      <CursorGlow />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}
