import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          font-family: 'Space Mono', monospace;
        }
        
        h1, h2, h3, h4 {
          font-family: 'Syne', sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glow-effect {
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
        }
        
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.h1
          className="text-2xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          &lt;RS /&gt;
        </motion.h1>
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-[#00ff88] transition-colors relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff88] group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden grid-pattern noise-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88] rounded-full blur-[120px] opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7b2ff7] rounded-full blur-[120px] opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="text-[#00ff88] text-sm font-semibold tracking-widest uppercase">
            Backend Architect | AI Engineer
          </span>
        </motion.div>

        <motion.h1
          className="text-7xl md:text-8xl font-black mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="gradient-text">Rushabh</span>
          <br />
          <span className="text-white">Savaliya</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Crafting <span className="text-[#00ff88] font-semibold">powerful backend systems</span> and
          <span className="text-[#00d4ff] font-semibold"> AI-driven solutions</span> that scale
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.button
            className="bg-[#00ff88] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#00ff88]/90 transition-all glow-effect"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
          >
            View Projects →
          </motion.button>
          <motion.button
            className="border-2 border-[#00ff88] text-[#00ff88] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#00ff88]/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Resume
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-16 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓ Scroll to explore
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12"
        >
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              I'm a <span className="text-[#00ff88] font-semibold">Full-Stack Developer</span> with
              <span className="text-[#00ff88] font-semibold"> 3 years of experience</span>, specializing in
              backend architecture and AI integration. My superpower? Building robust, scalable server-side
              systems that handle complex business logic with elegance.
            </p>
            <p>
              While I navigate the full stack comfortably, my passion ignites when working on
              <span className="text-[#00d4ff] font-semibold"> backend challenges</span> — designing efficient
              APIs, optimizing database queries, implementing intelligent caching strategies, and ensuring
              applications perform flawlessly under pressure.
            </p>
          </div>

          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              Throughout my journey, I've architected and shipped:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-[#00ff88] mr-3 text-2xl">•</span>
                <span>Full-featured <span className="font-semibold">e-commerce platforms</span> with advanced inventory and order management</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00ff88] mr-3 text-2xl">•</span>
                <span><span className="font-semibold">AI-powered chatbots</span> leveraging LangChain and Claude for intelligent automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00ff88] mr-3 text-2xl">•</span>
                <span><span className="font-semibold">Chrome extensions</span> that enhance productivity and user experience</span>
              </li>
            </ul>
            <p className="text-[#00ff88] font-semibold">
              My mission: Transform complex requirements into elegant, maintainable code that businesses depend on.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-16"
        >
          {[
            { number: "3+", label: "Years Experience" },
            { number: "10+", label: "Projects Delivered" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black gradient-text mb-2">{stat.number}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Skills() {
  const skillCategories = [
    {
      title: "Backend & APIs",
      icon: "⚙️",
      skills: ["Node.js", "Express.js", "RESTful APIs", "GraphQL", "Microservices", "JWT Auth"]
    },
    {
      title: "Databases",
      icon: "🗄️",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Pinecone Vector DB"]
    },
    {
      title: "AI & ML",
      icon: "🤖",
      skills: ["LangChain", "Anthropic Claude", "OpenAI", "Vector Search"]
    },
    {
      title: "Frontend",
      icon: "🎨",
      skills: ["React.js", "JavaScript"]
    },
    {
      title: "Real-time & Tools",
      icon: "⚡",
      skills: ["Socket.io", "WebSockets", "Webhooks", "Shopify API", "Stripe"]
    },
    // {
    //   title: "DevOps & Cloud",
    //   icon: "☁️",
    //   skills: ["Git/GitHub", "Docker", "AWS/Vercel", "CI/CD", "Linux"]
    // }
  ];

  return (
    <section id="skills" className="py-32 px-6 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Technical Arsenal</span>
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-6" />
          <p className="text-gray-400 text-xl">
            Technologies I leverage to build powerful solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 card-hover group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#00ff88]">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00ff88]/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: "ForecastIQ",
      subtitle: "AI-Driven E-Commerce Intelligence Platform",
      tags: ["Node.js", "LangChain", "Anthropic", "Pinecone", "React", "Shopify API"],
      highlights: [
        "Built AI-powered forecasting system predicting product demand 1-2 months ahead",
        "Integrated real-time Shopify webhooks for order & inventory tracking",
        "Developed dual AI chatbots: Admin analytics assistant & Customer support automation",
        "Implemented vector search using Pinecone for contextual AI understanding",
        "Reduced manual support workload by 60% through intelligent automation"
      ],
      gradient: "from-[#00ff88] to-[#00d4ff]"
    },
    {
      title: "DC Dial",
      subtitle: "Enterprise Chrome Extension with Microservices Architecture",
      tags: ["Chrome Extension", "Microservices", "Node.js", "AWS SQS", "OpenAI", "Payment Gateway", "React"],
      highlights: [
        "Architected 7-microservice backend system ensuring scalability and optimal performance",
        "Built role-based access control for Admin, User, and Customer with distinct permissions",
        "Integrated multiple payment gateways enabling flexible payment processing workflows",
        "Leveraged AWS SQS and Query Service for asynchronous messaging and efficient data handling",
        "Implemented OpenAI API for intelligent automation in SMS, email, and call management"
      ],
      gradient: "from-[#667eea] to-[#764ba2]"
    },
    {
      title: "Car Cover Factory",
      subtitle: "Multi-Language E-Commerce Platform with Global Reach",
      tags: ["Node.js", "Express", "Redis", "React", "PayPal", "Stripe", "AWS S3", "Google Ads"],
      highlights: [
        "Managed 19 language versions across 18 international markets (14 EU + 4 global sites)",
        "Implemented multi-currency payment system integrating PayPal, Braintree, and Stripe",
        "Optimized data retrieval with Redis caching, significantly enhancing client-side performance",
        "Orchestrated cloud infrastructure with Amazon S3 for seamless image delivery and storage",
        "Executed digital advertising campaigns across Google Ads, Facebook Ads, and Bing Ads with ROI tracking"
      ],
      gradient: "from-[#ff6b35] to-[#f7931e]"
    },
    {
      title: "DigiPay",
      subtitle: "Comprehensive Digital Wallet & Payment Services Platform",
      tags: ["Node.js", "Express", "MongoDB", "Braintree", "Stripe", "PayPal", "PhonePe", "UPI"],
      highlights: [
        "Built full-stack digital wallet system similar to Paytm with multi-service capabilities",
        "Integrated 4 payment gateways (Braintree, Stripe, PayPal, PhonePe) for seamless transactions",
        "Implemented secure bank account linking and wallet management system",
        "Developed multiple service modules: credit card payments, mobile recharge, flight booking, and UPI transfers",
        "Designed secure transaction processing with encryption and real-time balance updates"
      ],
      gradient: "from-[#00d4ff] to-[#0066ff]"
    }
  ];

  return (
    <section id="projects" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-6" />
          <p className="text-gray-400 text-xl">
            Showcase of impactful solutions I've architected
          </p>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border border-gray-800 rounded-3xl overflow-hidden card-hover"
            >
              <div className="p-8 md:p-12">
                <div className={`inline-block bg-gradient-to-r ${project.gradient} p-0.5 rounded-xl mb-6`}>
                  <div className="bg-[#0a0a0a] px-4 py-2 rounded-xl">
                    <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${project.gradient}`}>
                      PROJECT {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <h3 className="text-4xl font-black mb-3">{project.title}</h3>
                <p className="text-xl text-gray-400 mb-6">{project.subtitle}</p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-[#00ff88] mb-4">Key Achievements:</h4>
                  {project.highlights.map((highlight, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} group-hover:scale-150 transition-transform`} />
                      <p className="text-gray-300 leading-relaxed">{highlight}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  <button className="bg-[#00ff88]/10 border border-[#00ff88] text-[#00ff88] px-6 py-3 rounded-lg font-semibold hover:bg-[#00ff88]/20 transition-all">
                    View Details →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const experiences = [
    {
      period: "2024 - Present",
      role: "Full Stack Developer",
      company: "Freelance / Contract Work",
      description: "Specialized in backend development and AI integration for various clients",
      achievements: [
        "Delivered 15+ production-ready applications across e-commerce, AI, and SaaS domains",
        "Architected scalable backend systems handling 100K+ monthly API requests",
        "Integrated AI/ML capabilities using LangChain and modern LLM APIs",
        "Mentored junior developers on best practices and system design"
      ]
    },
    {
      period: "2023 - 2024",
      role: "Backend Developer",
      company: "Tech Startup",
      description: "Built core backend infrastructure for emerging SaaS platform",
      achievements: [
        "Designed and implemented RESTful APIs serving 50K+ daily users",
        "Optimized database performance resulting in 3x faster query execution",
        "Implemented real-time features using WebSockets and Redis",
        "Established CI/CD pipelines reducing deployment time by 70%"
      ]
    }
  ];

  return (
    <section id="experience" className="py-32 px-6 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-6" />
          <p className="text-gray-400 text-xl">
            3 years of building impactful solutions
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#00ff88] to-[#7b2ff7]" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className={`relative mb-16 md:mb-24 ${i % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'}`}
            >
              <div className={`md:w-1/2 ${i % 2 === 0 ? '' : 'md:ml-auto'}`}>
                {/* Timeline dot */}
                <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#00ff88] rounded-full border-4 border-[#0a0a0a] z-10" />

                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 card-hover">
                  <div className="text-[#00ff88] font-bold text-sm mb-2">{exp.period}</div>
                  <h3 className="text-2xl font-black mb-2">{exp.role}</h3>
                  <div className="text-gray-400 font-semibold mb-4">{exp.company}</div>
                  <p className="text-gray-300 mb-6">{exp.description}</p>

                  <div className="space-y-3">
                    {exp.achievements.map((achievement, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <span className="text-[#00ff88] text-xl">→</span>
                        <span className="text-gray-300 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Let's Build Something</span>
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-12" />

          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Have a project in mind? Looking for a backend expert or AI integration specialist?
            <br />
            <span className="text-[#00ff88] font-semibold">Let's connect and create something amazing.</span>
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: "✉️", label: "Email", value: "rushabh1245@gmail.com", link: "mailto:rushabh1245@gmail.com" },
              { icon: "💼", label: "LinkedIn", value: "/rushabh-savaliya", link: "https://linkedin.com/in/rushabh-savaliya" },
              { icon: "💻", label: "GitHub", value: "/rushabh-savaliya", link: "https://github.com/rushabh-savaliya" }
            ].map((contact, i) => (
              <motion.a
                key={i}
                href={contact.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 card-hover block"
              >
                <div className="text-4xl mb-3">{contact.icon}</div>
                <div className="text-gray-400 text-sm mb-2">{contact.label}</div>
                <div className="text-[#00ff88] font-semibold">{contact.value}</div>
              </motion.a>
            ))}
          </div>

          <motion.button
            className="bg-[#00ff88] text-black px-12 py-5 rounded-xl font-bold text-xl hover:bg-[#00ff88]/90 transition-all glow-effect inline-flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch →
          </motion.button>
        </motion.div>
      </div>

      {/* Background gradient effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-[#00ff88] rounded-full blur-[200px] opacity-5" />
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#050505] border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold gradient-text mb-2">&lt;RS /&gt;</div>
            <p className="text-gray-400 text-sm">
              Crafting powerful backend systems & AI solutions
            </p>
          </div>

          <div className="flex gap-6">
            {['GitHub', 'LinkedIn', 'Email'].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                className="text-gray-400 hover:text-[#00ff88] transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2026 Rushabh Savaliya. Built with React, Tailwind & Framer Motion.</p>
          <p className="mt-2">Designed for impact. Coded with passion.</p>
        </div>
      </div>
    </footer>
  );
}