import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight, ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';
import './index.css';

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

// ── DATA ─────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    num: '01', year: '2026', cat: 'ML · Airline',
    title: 'SkyRate',
    sub: 'Airline Passenger Intelligence',
    desc: 'Dual-model ML on 100K+ airline records. Real-time staff alerts before unhappy passengers board.',
    tags: ['XGBoost', 'Streamlit', 'Pandas'],
    accent: '#F37512',
    stat: '91.8% accuracy',
    github: 'https://github.com/KIRAN4003/SkyRate-Airline-Customer-Satisfaction',
    live: 'https://skyrate-airline-customer-satisfaction-xedjrcsbryf7jes98tqqlb.streamlit.app/',
    liveLabel: 'Live on Streamlit',
    preview: '/skyrate-preview.png',
  },
  {
    num: '02', year: '2026', cat: 'ML · Retail',
    title: 'RetailIQ',
    sub: 'E-commerce Customer Intelligence',
    desc: '800K+ UK retail transactions — RFM segmentation, churn prediction, and 3-month revenue forecasting.',
    tags: ['Prophet', 'Power BI', 'SQL'],
    accent: '#FBD5A5',
    stat: '£17M revenue mapped',
    github: 'https://github.com/KIRAN4003/retail-customer-intelligence',
    live: '',
    liveLabel: '',
    preview: '',
  },
  {
    num: '03', year: '2026', cat: 'Statistics',
    title: 'StatProof',
    sub: 'A/B Testing & CRO',
    desc: 'Z-test on 290,584 sessions proving no lift — preventing a $473K premature product launch.',
    tags: ['Scipy', 'Statsmodels', 'Python'],
    accent: '#c0392b',
    stat: '$473K protected',
    github: 'https://github.com/KIRAN4003/ab-testing-conversion-optimization',
    live: '',
    liveLabel: '',
    preview: '',
  },
  {
    num: '04', year: '2026', cat: 'SQL · Healthcare',
    title: 'HospitalDB',
    sub: 'Hospital Operations Analytics',
    desc: '3-table MySQL DB on 55,500 patient records. CTEs, window functions, stored procedures.',
    tags: ['MySQL', 'Tableau', 'SQLAlchemy'],
    accent: '#8B5E3C',
    stat: '$287M revenue insights',
    github: 'https://github.com/KIRAN4003/Hospital-sql-analysis',
    live: 'https://public.tableau.com/app/profile/kiran.u5316/viz/HospitalOperationsAnalytics/HospitalOperationsAnalytics?publish=yes',
    liveLabel: 'View on Tableau',
    preview: '/hospital-preview.png',
  },
];

const GITHUB_REPOS = [
  { name: 'SkyRate-Airline-Customer-Satisfaction', lang: 'Python', desc: 'Dual XGBoost — pre & in-flight satisfaction prediction on 100K records', url: 'https://github.com/KIRAN4003/SkyRate-Airline-Customer-Satisfaction', live: 'https://skyrate-airline-customer-satisfaction-xedjrcsbryf7jes98tqqlb.streamlit.app/' },
  { name: 'retail-customer-intelligence', lang: 'Python', desc: 'RFM segmentation + Prophet revenue forecasting on 800K transactions', url: 'https://github.com/KIRAN4003/retail-customer-intelligence', live: '' },
  { name: 'ab-testing-conversion-optimization', lang: 'Python', desc: 'Z-test on 290K user sessions — statistical CRO analysis', url: 'https://github.com/KIRAN4003/ab-testing-conversion-optimization', live: '' },
  { name: 'Hospital-sql-analysis', lang: 'SQL', desc: 'CTEs, window functions, stored procedures on 55K patient records', url: 'https://github.com/KIRAN4003/Hospital-sql-analysis', live: 'https://public.tableau.com/app/profile/kiran.u5316/viz/HospitalOperationsAnalytics/HospitalOperationsAnalytics?publish=yes' },
  { name: 'ragdemo.ai', lang: 'Python', desc: 'RAG pipeline — combines LLM generation with external data retrieval for accurate responses', url: 'https://github.com/KIRAN4003/ragdemo.ai', live: 'https://ragdemoai-dfvpqvfem9plxkdtgigug8.streamlit.app/' },
  { name: 'ML_Model.ai', lang: 'Python', desc: 'AI-powered Streamlit app — trains ML models on your data + Gemini AI suggestions', url: 'https://github.com/KIRAN4003/ML_Model.ai', live: 'https://mlmodelai-app.streamlit.app/' },
];

const SERVICES = [
  { num: '01', title: 'Data Analysis', desc: 'End-to-end EDA, hypothesis testing, and insight extraction from large datasets.', tags: ['Pandas', 'SQL', 'EDA', 'Statistics'] },
  { num: '02', title: 'Machine Learning', desc: 'Production-grade ML models — classification, regression, forecasting, and NLP.', tags: ['Scikit-learn', 'XGBoost', 'Prophet'] },
  { num: '03', title: 'BI Dashboards', desc: 'Interactive Power BI and Tableau dashboards that translate data into clear decisions.', tags: ['Power BI', 'Tableau', 'DAX'] },
  { num: '04', title: 'Statistical Testing', desc: 'A/B testing, significance analysis, and rigorous experiment design.', tags: ['Scipy', 'Statsmodels', 'Z-test'] },
  { num: '05', title: 'AI & RAG', desc: 'RAG pipelines, LLM integration, and NLP feature engineering for real products.', tags: ['RAG', 'Gemini', 'LLM APIs'] },
];

const STACK = [
  { cat: 'Languages', items: ['Python', 'SQL'] },
  { cat: 'ML & Data', items: ['Scikit-learn', 'XGBoost', 'Prophet', 'Pandas', 'NumPy', 'Scipy'] },
  { cat: 'Viz & BI', items: ['Power BI', 'Tableau', 'Matplotlib', 'Seaborn', 'Streamlit'] },
  { cat: 'Tools', items: ['MySQL', 'SQLAlchemy', 'Git', 'GitHub', 'Jupyter', 'AWS', 'Excel'] },
  { cat: 'AI', items: ['Generative AI', 'RAG', 'NLP', 'NLTK', 'Gemini AI', 'LLM APIs'] },
];

const SKILLS_MAP = [
  { label: 'Python & Pandas', pct: 92 },
  { label: 'Machine Learning', pct: 88 },
  { label: 'SQL & Databases', pct: 85 },
  { label: 'Data Visualisation', pct: 87 },
  { label: 'Statistics & A/B Testing', pct: 83 },
  { label: 'Power BI & Tableau', pct: 80 },
  { label: 'NLP & Generative AI', pct: 75 },
  { label: 'AWS & Cloud', pct: 68 },
];

const NAV = [
  { num: '01', label: 'Home', href: '#home' },
  { num: '02', label: 'About', href: '#about' },
  { num: '03', label: 'Skills', href: '#skills' },
  { num: '04', label: 'Projects', href: '#projects' },
  { num: '05', label: 'GitHub', href: '#github' },
  { num: '06', label: 'Certifications', href: '#certifications' },
  { num: '07', label: 'Contact', href: '#contact' },
];

// ── utils ────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: threshold });
  return { ref, visible };
}

function useCounter(target: number, visible: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let val = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      val += step;
      if (val >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(val));
    }, 16);
    return () => clearInterval(t);
  }, [visible, target, duration]);
  return count;
}

// ── Cursor ───────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const lbl = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const rpos = useRef({ x: -200, y: -200 });
  useEffect(() => {
    const mv = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', mv);
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      rpos.current.x = lerp(rpos.current.x, pos.current.x, 0.11);
      rpos.current.y = lerp(rpos.current.y, pos.current.y, 0.11);
      if (dot.current) { dot.current.style.left = pos.current.x + 'px'; dot.current.style.top = pos.current.y + 'px'; }
      if (ring.current) { ring.current.style.left = rpos.current.x + 'px'; ring.current.style.top = rpos.current.y + 'px'; }
      if (lbl.current) { lbl.current.style.left = rpos.current.x + 'px'; lbl.current.style.top = rpos.current.y + 'px'; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const sh = () => document.body.classList.add('cursor-hover');
    const rh = () => document.body.classList.remove('cursor-hover');
    const sv = () => document.body.classList.add('cursor-view');
    const rv = () => document.body.classList.remove('cursor-view');
    document.querySelectorAll('a,button').forEach(el => { el.addEventListener('mouseenter', sh); el.addEventListener('mouseleave', rh); });
    document.querySelectorAll('[data-cursor="view"]').forEach(el => { el.addEventListener('mouseenter', sv); el.addEventListener('mouseleave', rv); });
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div id="cursor-dot" ref={dot} />
      <div id="cursor-ring" ref={ring} />
      <div id="cursor-label" ref={lbl}>VIEW</div>
    </>
  );
}

// ── Loader ───────────────────────────────────────────────────────────────
function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setPct(p => {
        const next = p + Math.random() * 5 + 2;
        if (next >= 100) { clearInterval(t); setTimeout(onDone, 400); return 100; }
        return next;
      });
    }, 50);
    return () => clearInterval(t);
  }, [onDone]);
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center" style={{ background: '#050505' }}>
      <motion.div className="relative w-12 h-12 mb-8" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        <div className="absolute inset-0 border border-[#F37512]" style={{ transform: 'rotate(45deg)' }} />
        <div className="absolute inset-2 border border-[rgba(251,213,165,0.4)]" style={{ transform: 'rotate(45deg)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#F37512]" style={{ transform: 'rotate(45deg)' }} />
        </div>
      </motion.div>
      <div className="uppercase mb-6" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.4em', color: '#F37512' }}>Loading</div>
      <div className="w-48 h-px bg-[#1a1a1a] overflow-hidden">
        <div className="h-full transition-all duration-100" style={{ width: `${Math.min(pct, 100)}%`, background: 'linear-gradient(90deg,#F37512,#FBD5A5)' }} />
      </div>
      <div className="mt-3" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#2a2a2a' }}>{String(Math.min(Math.floor(pct), 100)).padStart(3, '0')}</div>
    </motion.div>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <>
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.16,1,0.3,1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500 ${scrolled ? 'mx-4 mt-3 rounded-full px-5 py-3' : 'px-6 sm:px-10 py-5 sm:py-7'}`}
        style={scrolled ? { background: 'rgba(26,26,26,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(242,242,236,0.06)' } : {}}>
        <a href="#home" className="flex items-center gap-3">
          <motion.div className="w-7 h-7 border border-[#F37512] flex items-center justify-center" style={{ transform: 'rotate(45deg)' }} whileHover={{ rotate: '90deg' }} transition={{ duration: 0.4 }}>
            <div className="w-2 h-2 bg-[#F37512]" />
          </motion.div>
          <div>
            <div className="font-black text-[#F2F2EC] text-sm leading-none" style={{ fontFamily: 'Fraunces,Georgia,serif' }}>Kiran U</div>
            <div className="uppercase leading-none mt-0.5" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#F37512' }}>Portfolio</div>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-7">
          {NAV.map(n => (
            <a key={n.href} href={n.href} className="group flex items-baseline gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', color: '#F37512', letterSpacing: '0.2em' }}>{n.num}</span>
              <span className="text-[#F2F2EC] text-sm tracking-wide uppercase" style={{ fontFamily: 'Fraunces,Georgia,serif', fontWeight: 300 }}>{n.label}</span>
            </a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">

          <a href="mailto:kirankiranu791@gmail.com"
            className="rounded-full px-5 py-2.5 text-[#050505] font-medium text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Geist,sans-serif', background: 'linear-gradient(135deg,#F37512,#FBD5A5)' }}>
            Hire Me →
          </a>
        </div>
        <button onClick={() => setOpen(v => !v)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#F2F2EC]"
          style={{ background: 'rgba(26,26,26,0.8)', border: '1px solid rgba(242,242,236,0.08)' }}>
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-center px-8" style={{ background: '#050505' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {NAV.map((n, i) => (
              <motion.a key={n.href} href={n.href} onClick={() => setOpen(false)}
                initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                className="flex items-baseline gap-3 py-4 border-b hover:text-[#F37512] transition-colors"
                style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2rem,8vw,3.5rem)', fontWeight: 900, color: '#F2F2EC', borderColor: 'rgba(242,242,236,0.04)' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: '#F37512' }}>{n.num}</span>
                {n.label}
              </motion.a>
            ))}
            <div className="flex gap-3 mt-8">

              <a href="mailto:kirankiranu791@gmail.com" className="rounded-full px-5 py-3 font-medium text-sm uppercase tracking-widest text-[#050505]" style={{ fontFamily: 'Geist,sans-serif', background: 'linear-gradient(135deg,#F37512,#FBD5A5)' }}>Hire Me →</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  const words = ['Turning', 'Raw', 'Data', 'Into'];
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden grid-bg">
      <div className="orb" style={{ width: '700px', height: '700px', top: '-20%', right: '-15%', opacity: 0.07, background: '#F37512', position: 'absolute', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg,rgba(5,5,5,0.92) 45%,rgba(5,5,5,0.25) 100%)' }} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute top-20 sm:top-24 left-6 sm:left-10 right-6 sm:right-10 z-10 flex justify-between">
        <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.25em', color: '#F37512' }}>Kiran U · Portfolio</span>
        <span className="uppercase hidden sm:block" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.3)' }}>2026 · Bangalore</span>
        <span className="uppercase hidden md:block" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.3)' }}>Analysed · Modelled · Shipped</span>
      </motion.div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 max-w-4xl">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="uppercase mb-6" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.3em', color: '#F37512' }}>
          — Data Analyst &amp; Data Scientist
        </motion.p>
        <div style={{ overflow: 'hidden', paddingBottom: '0.2em' }}>
          <h1 className="font-black leading-none tracking-tight" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2.8rem,7.5vw,7rem)', letterSpacing: '-0.03em' }}>
            {words.map((w, i) => (
              <motion.span key={w} className="inline-block mr-[0.18em] text-[#F2F2EC]"
                initial={{ y: '120%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65 + i * 0.08, duration: 0.7, ease: [0.16,1,0.3,1] }}>
                {w}
              </motion.span>
            ))}
          </h1>
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '2rem' }}>
          <motion.h1 className="italic gradient-ember font-black leading-none tracking-tight"
            style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2.8rem,7.5vw,7rem)', letterSpacing: '-0.03em' }}
            initial={{ y: '120%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7, ease: [0.16,1,0.3,1] }}>
            Business Clarity.
          </motion.h1>
        </div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}
          className="text-sm sm:text-base leading-relaxed mb-8 max-w-md"
          style={{ fontFamily: 'Geist,sans-serif', color: 'rgba(242,242,236,0.55)' }}>
          PGP graduate in Data Science & GenAI from Bangalore. I build ML models, statistical models, and BI dashboards that connect raw data to decisions that actually matter.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="flex items-center gap-4 flex-wrap">
          <a href="#projects" className="rounded-full font-medium text-sm uppercase tracking-widest px-8 py-3.5 text-[#050505] hover:scale-105 transition-transform"
            style={{ fontFamily: 'Geist,sans-serif', background: 'linear-gradient(135deg,#F37512,#FBD5A5)' }}>
            View Projects
          </a>
          <a href="#contact" className="rounded-full font-medium text-sm uppercase tracking-widest px-8 py-3.5 border hover:border-[#F37512] hover:text-[#F37512] transition-colors"
            style={{ fontFamily: 'Geist,sans-serif', borderColor: 'rgba(242,242,236,0.2)', color: '#F2F2EC' }}>
            Contact Me
          </a>

        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="flex items-center gap-2 mt-7">
          <motion.div className="w-2 h-2 rounded-full bg-green-400"
            animate={{ scale: [1,1.5,1], opacity: [1,0.4,1] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(242,242,236,0.4)' }}>
            Open to work · Available now
          </span>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-3 border-t" style={{ borderColor: 'rgba(242,242,236,0.05)' }}>
        {[{ val: '04', lbl: 'Live Projects' },{ val: '800K+', lbl: 'Records Analysed' },{ val: '91.8%', lbl: 'Best Accuracy' }].map((s, i) => (
          <div key={s.lbl} className={`flex flex-col items-center py-4 sm:py-5 ${i < 2 ? 'border-r' : ''}`}
            style={{ background: 'rgba(5,5,5,0.65)', backdropFilter: 'blur(12px)', borderColor: 'rgba(242,242,236,0.05)' }}>
            <span className="font-black text-[#F37512] text-lg sm:text-2xl leading-none" style={{ fontFamily: 'Fraunces,Georgia,serif' }}>{s.val}</span>
            <span className="uppercase mt-1" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.3)' }}>{s.lbl}</span>
          </div>
        ))}
      </motion.div>
      <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-20 right-8 z-10 hidden sm:flex" style={{ color: 'rgba(242,242,236,0.2)' }}>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

// ── About (with mini Services inside) ────────────────────────────────────
function About() {
  const { ref, visible } = useReveal(0.05);
  return (
    <section id="about" className="px-5 sm:px-10 py-24 sm:py-32" style={{ background: '#050505' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          className="uppercase mb-12 sm:mb-16"
          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>
          02 / About
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 sm:gap-16">
          {/* Portrait card */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
            className="bracket relative rounded-[28px] sm:rounded-[36px] border overflow-hidden"
            style={{ background: '#0d0d0d', borderColor: 'rgba(242,242,236,0.07)', aspectRatio: '4/5' }}>
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 py-4 border-b" style={{ borderColor: 'rgba(242,242,236,0.05)' }}>
              <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.3)' }}>Profile · 001</span>
              <div className="flex items-center gap-1.5">
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} animate={{ opacity: [1,0.3,1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', color: '#4ade80' }}>Live</span>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="select-none" style={{ lineHeight: 1, fontSize: 'clamp(5rem,18vw,10rem)' }}>
                <span className="font-black text-[#F2F2EC]" style={{ fontFamily: 'Fraunces,Georgia,serif' }}>K</span>
                <span className="font-black italic gradient-ember" style={{ fontFamily: 'Fraunces,Georgia,serif', marginLeft: '-0.06em' }}>U</span>
              </div>
            </div>
            <div className="absolute inset-0 grid-bg opacity-25" />
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t" style={{ borderColor: 'rgba(242,242,236,0.05)' }}>
              <div className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.3)' }}>Based in Bangalore · Open to collaborations</div>
              <div className="uppercase mt-1" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(242,242,236,0.18)' }}>Data Analyst · Data Scientist · 2026</div>
            </div>
          </motion.div>

          {/* Bio + stack */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.16,1,0.3,1] }}
            className="flex flex-col justify-center gap-8">
            <div>
              <h2 className="font-black leading-tight mb-6" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2rem,5vw,3.8rem)', color: '#F2F2EC' }}>
                Designed end-to-end.<br /><span className="italic gradient-ember">Built with data.</span>
              </h2>
              <div className="flex flex-col gap-4" style={{ fontFamily: 'Geist,sans-serif', color: 'rgba(242,242,236,0.5)', fontSize: 'clamp(0.85rem,1.5vw,1rem)', lineHeight: 1.8 }}>
                <p>PGP graduate in Data Science & Generative AI from Great Learning, Bangalore. I don't just build models — I build solutions that make business sense.</p>
                <p>Across 4 projects, I've processed 800K+ data points, achieved 92% model accuracy, built SaaS analytics pipelines, and developed GenAI applications using RAG and Gemini AI — all production-deployed.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {STACK.map(row => (
                <div key={row.cat}>
                  <div className="uppercase mb-2.5" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#F37512' }}>{row.cat}</div>
                  <div className="flex flex-wrap gap-2">
                    {row.items.map(item => (
                      <span key={item} className="rounded-full border px-3 py-1.5 hover:border-[rgba(243,117,18,0.3)] hover:text-[#F37512] transition-colors duration-200 cursor-default uppercase"
                        style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(242,242,236,0.45)', borderColor: 'rgba(242,242,236,0.07)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 mt-16 sm:mt-20 border rounded-[20px] overflow-hidden" style={{ borderColor: 'rgba(242,242,236,0.06)' }}>
          {[{ target: 4, suffix: '', lbl: 'Live Projects' },{ target: 800, suffix: 'K+', lbl: 'Records Analysed' },{ target: 92, suffix: '%', lbl: 'Best ML Accuracy' },{ target: 473, suffix: 'K', lbl: '$Revenue Protected' }].map((s, i) => {
            const r2 = useRef<HTMLDivElement>(null);
            const v2 = useInView(r2, { once: true, amount: 0.4 });
            const c = useCounter(s.target, v2);
            return (
              <div key={s.lbl} ref={r2} className={`flex flex-col items-center py-8 sm:py-10 px-4 ${i < 3 ? 'border-r' : ''}`}
                style={{ background: 'rgba(13,13,13,0.8)', borderColor: 'rgba(242,242,236,0.05)' }}>
                <span className="font-black gradient-ember" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.04em' }}>{c}{s.suffix}</span>
                <div className="uppercase mt-2" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.28)' }}>{s.lbl}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="px-5 sm:px-10 py-20 sm:py-28" style={{ background: '#080808' }}>
      <div className="max-w-6xl mx-auto">
        <p className="uppercase mb-3" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.35em', color: '#F37512' }}>03 / Skills & Expertise</p>
        <h2 className="font-black leading-none mb-14 sm:mb-16" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#F2F2EC' }}>
          My <span className="italic gradient-ember">toolkit.</span>
        </h2>

        {/* 2-column skill bars exactly like photo 1 */}
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-7 mb-16">
          {SKILLS_MAP.map((s, i) => {
            const r = useRef<HTMLDivElement>(null);
            const v = useInView(r, { once: true, amount: 0.3 });
            return (
              <div key={s.label} ref={r}>
                <div className="flex justify-between items-baseline mb-2">
                  <span style={{ fontFamily: 'Geist,sans-serif', fontSize: 'clamp(0.8rem,1.4vw,0.95rem)', color: 'rgba(242,242,236,0.7)' }}>{s.label}</span>
                  <span className="font-black" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.05em', color: '#F37512' }}>{s.pct}%</span>
                </div>
                <div className="h-px w-full" style={{ background: 'rgba(242,242,236,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: v ? `${s.pct}%` : '0%', background: 'linear-gradient(90deg,#F37512,#FBD5A5)', transitionDelay: `${i * 80}ms` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* What I Deliver list */}
        <div>
          <p className="uppercase mb-6" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>What I deliver</p>
          <div className="flex flex-col">
            {SERVICES.map((s, i) => {
              const r2 = useRef<HTMLDivElement>(null);
              const v2 = useInView(r2, { once: true, amount: 0.2 });
              return (
                <motion.div key={s.num} ref={r2}
                  initial={{ opacity: 0, x: -16 }} animate={v2 ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.07, duration: 0.6 }}
                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 py-5 sm:py-6 border-b group cursor-default hover:border-[rgba(243,117,18,0.2)] transition-colors"
                  style={{ borderColor: 'rgba(242,242,236,0.06)' }}>
                  <div className="flex items-baseline gap-5 flex-1">
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.15em', color: '#F37512' }}>{s.num}</span>
                    <div>
                      <h3 className="font-black mb-0.5 group-hover:text-[#F37512] transition-colors"
                        style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(1rem,2vw,1.5rem)', color: '#F2F2EC' }}>{s.title}</h3>
                      <p className="font-light text-sm leading-relaxed max-w-lg"
                        style={{ fontFamily: 'Geist,sans-serif', color: 'rgba(242,242,236,0.38)' }}>{s.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:max-w-[220px] sm:justify-end">
                    {s.tags.map(t => (
                      <span key={t} className="rounded-full border px-2.5 py-1"
                        style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.12em', color: '#F37512', borderColor: 'rgba(243,117,18,0.15)' }}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PatternViz ────────────────────────────────────────────────────────────
function PatternViz({ accent, type }: { accent: string; type: number }) {
  const s = { position: 'absolute' as const, inset: 0 };
  if (type === 0) return (
    <svg style={s} className="opacity-25" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 7 }).flatMap((_, r) => Array.from({ length: 12 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={c*52+8} y={r*30+8} width="36" height="18" rx="3" fill="none" stroke={accent} strokeWidth="0.5" />
      )))}
    </svg>
  );
  if (type === 1) return (
    <svg style={s} className="opacity-20" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={i} x1={i*36} y1="0" x2={i*36-90} y2="300" stroke={accent} strokeWidth="0.6" />
      ))}
    </svg>
  );
  if (type === 2) return (
    <svg style={s} className="opacity-18" xmlns="http://www.w3.org/2000/svg">
      {[18,38,60,85,112,140].map(r => (
        <circle key={r} cx="50%" cy="55%" r={r} fill="none" stroke={accent} strokeWidth="0.7" />
      ))}
    </svg>
  );
  return (
    <svg style={s} className="opacity-18" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 5 }).flatMap((_, r) => Array.from({ length: 7 }).map((_, c) => (
        <polygon key={`${r}-${c}`} points={`${c*84+42},${r*50+8} ${c*84+76},${r*50+30} ${c*84+42},${r*50+50} ${c*84+8},${r*50+30}`} fill="none" stroke={accent} strokeWidth="0.5" />
      )))}
    </svg>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────
function Projects() {
  const { ref, visible } = useReveal(0.05);
  return (
    <section id="projects" className="px-5 sm:px-10 py-24 sm:py-32" style={{ background: '#080808' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-14 sm:mb-20">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
              className="uppercase mb-3" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>
              04 / Projects
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="font-black leading-none" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#F2F2EC' }}>
              Selected<br /><span className="italic gradient-ember">projects.</span>
            </motion.h2>
          </div>
          <motion.a href="https://github.com/KIRAN4003" target="_blank" rel="noreferrer"
            initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 uppercase hover:opacity-60 transition-opacity"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#F37512' }}>
            All on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.a>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {PROJECTS.map((p, i) => {
            const cardRef = useRef<HTMLDivElement>(null);
            const cardVisible = useInView(cardRef, { once: true, amount: 0.1 });
            return (
              <motion.div key={p.num} ref={cardRef}
                data-cursor="view"
                initial={{ opacity: 0, y: 40 }} animate={cardVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16,1,0.3,1] }}
                className="bracket relative rounded-[28px] sm:rounded-[36px] border hover:border-[rgba(243,117,18,0.3)] transition-all duration-500 overflow-hidden group"
                style={{ background: '#0d0d0d', borderColor: 'rgba(242,242,236,0.06)' }}>

                {/* Preview image (if available) — clickable to live link */}
                {p.preview ? (
                  <a href={p.live} target="_blank" rel="noreferrer" className="block relative overflow-hidden cursor-pointer"
                    style={{ height: 'clamp(160px,22vw,240px)' }}
                    title={p.liveLabel}>
                    <img src={p.preview} alt={`${p.title} preview`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(5,5,5,0.6)' }}>
                      <div className="flex items-center gap-2 rounded-full px-5 py-2.5 border border-[#F37512] text-[#F37512]"
                        style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.2em' }}>
                        <ExternalLink className="w-3.5 h-3.5" /> {p.liveLabel}
                      </div>
                    </div>
                    <div className="absolute top-3 left-4" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: `${p.accent}cc` }}>{p.num} / 04</div>
                    <div className="absolute top-3 right-4" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: `${p.accent}cc` }}>{p.year}</div>
                  </a>
                ) : (
                  /* Pattern fallback */
                  <div className="relative overflow-hidden" style={{ height: 'clamp(140px,18vw,200px)', background: `${p.accent}08` }}>
                    <PatternViz accent={p.accent} type={i} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 55%,#0d0d0d)' }} />
                    <div className="absolute top-4 left-5" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: `${p.accent}99` }}>{p.num} / 04</div>
                    <div className="absolute top-4 right-5" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: `${p.accent}99` }}>{p.year}</div>
                  </div>
                )}

                <div className="p-5 sm:p-7">
                  <div className="uppercase mb-2" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: p.accent }}>{p.cat}</div>
                  <h3 className="font-black mb-1 group-hover:text-[#F37512] transition-colors" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(1.3rem,3vw,2rem)', color: '#F2F2EC' }}>{p.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ fontFamily: 'Geist,sans-serif', color: 'rgba(242,242,236,0.42)' }}>{p.desc}</p>
                  <div className="inline-block rounded-full px-3 py-1 text-xs mb-4 border" style={{ fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.1em', borderColor: `${p.accent}35`, color: p.accent, background: `${p.accent}0d` }}>{p.stat}</div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map(t => (
                      <span key={t} className="rounded-full border px-2.5 py-1" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(242,242,236,0.38)', borderColor: 'rgba(242,242,236,0.07)' }}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <a href={p.github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 uppercase hover:opacity-60 transition-opacity"
                      style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.15em', color: p.accent }}>
                      <Github className="w-3.5 h-3.5" /> GitHub <ArrowUpRight className="w-3 h-3" />
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 uppercase hover:opacity-60 transition-opacity"
                        style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(242,242,236,0.45)' }}>
                        <ExternalLink className="w-3.5 h-3.5" /> {p.liveLabel} <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
          className="mt-6 rounded-[28px] border border-dashed p-10 text-center" style={{ borderColor: 'rgba(243,117,18,0.13)' }}>
          <div className="uppercase mb-3" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>More coming</div>
          <div className="font-black text-[#F2F2EC] text-2xl sm:text-3xl mb-5" style={{ fontFamily: 'Fraunces,Georgia,serif' }}>More on the way.</div>
          <a href="https://github.com/KIRAN4003" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 uppercase hover:opacity-60 transition-opacity"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#F37512' }}>
            <Github className="w-4 h-4" /> Follow on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── GitHub ────────────────────────────────────────────────────────────────
function GitHub() {
  const { ref, visible } = useReveal(0.05);
  return (
    <section id="github" className="px-5 sm:px-10 py-24 sm:py-32" style={{ background: '#050505' }}>
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          className="uppercase mb-12" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>
          05 / GitHub
        </motion.p>

        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          className="bracket relative rounded-[24px] border p-6 sm:p-8 mb-4 flex flex-wrap items-center justify-between gap-5"
          style={{ background: '#0d0d0d', borderColor: 'rgba(242,242,236,0.06)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl"
              style={{ background: 'linear-gradient(135deg,#F37512,#FBD5A5)', color: '#050505', fontFamily: 'Fraunces,Georgia,serif' }}>KU</div>
            <div>
              <div className="font-black text-[#F2F2EC] text-lg sm:text-xl" style={{ fontFamily: 'Fraunces,Georgia,serif' }}>KIRAN4003</div>
              <div className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#F37512' }}>github.com/KIRAN4003</div>
            </div>
          </div>
          <a href="https://github.com/KIRAN4003" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 rounded-full border px-5 py-2.5 uppercase hover:border-[#F37512] hover:text-[#F37512] transition-colors"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#F2F2EC', borderColor: 'rgba(242,242,236,0.1)' }}>
            <Github className="w-3.5 h-3.5" /> View Profile
          </a>
        </motion.div>

        {/* Repo list */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 0.15 }}
          className="rounded-[24px] border overflow-hidden" style={{ background: '#0d0d0d', borderColor: 'rgba(242,242,236,0.06)' }}>
          {GITHUB_REPOS.map((r, i) => (
            <div key={r.name} className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 sm:py-6 group hover:bg-[rgba(243,117,18,0.03)] transition-colors"
              style={{ borderBottom: i < GITHUB_REPOS.length - 1 ? '1px solid rgba(242,242,236,0.04)' : 'none' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="text-sm sm:text-base text-[#F2F2EC] group-hover:text-[#F37512] transition-colors truncate" style={{ fontFamily: 'Geist,sans-serif', fontWeight: 500 }}>{r.name}</span>
                  <span className="shrink-0 rounded-full border px-2.5 py-1 uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', color: '#F37512', borderColor: 'rgba(243,117,18,0.2)' }}>{r.lang}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ fontFamily: 'Geist,sans-serif', color: 'rgba(242,242,236,0.3)' }}>{r.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {r.live && (
                  <a href={r.live} target="_blank" rel="noreferrer"
                    className="hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1.5 uppercase hover:border-[#F37512] hover:text-[#F37512] transition-colors"
                    style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(242,242,236,0.4)', borderColor: 'rgba(242,242,236,0.06)' }}>
                    <ExternalLink className="w-3 h-3" /> Live
                  </a>
                )}
                <a href={r.url} target="_blank" rel="noreferrer">
                  <ArrowUpRight className="w-4 h-4 text-[#F37512] opacity-25 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="text-center mt-8">
          <a href="https://github.com/KIRAN4003" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-8 py-3 uppercase hover:border-[#F37512] hover:text-[#F37512] transition-colors"
            style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#F2F2EC', borderColor: 'rgba(242,242,236,0.1)' }}>
            <Github className="w-4 h-4" /> All Repositories
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── Certifications ────────────────────────────────────────────────────────
function Certifications() {
  const { ref, visible } = useReveal(0.05);
  return (
    <section id="certifications" className="px-5 sm:px-10 py-24 sm:py-32" style={{ background: '#050505' }}>
      <div ref={ref} className="max-w-4xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          className="uppercase mb-4" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>
          06 / Certifications
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          className="font-black leading-none mb-14 sm:mb-20" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#F2F2EC' }}>
          My <span className="italic gradient-ember">Credentials.</span>
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7, ease: [0.16,1,0.3,1] }}
          className="bracket relative rounded-[28px] sm:rounded-[36px] border overflow-hidden"
          style={{ background: '#0d0d0d', borderColor: 'rgba(242,242,236,0.07)' }}>
          {/* Featured badge */}
          <div className="absolute top-5 left-5 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: 'linear-gradient(135deg,#F37512,#FBD5A5)' }}>
            <span className="text-[#050505]" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700 }}>★ FEATURED</span>
          </div>

          {/* Certificate image */}
          <div className="relative overflow-hidden" style={{ maxHeight: '420px' }}>
            <img
              src="/certificate.png"
              alt="PGP Certificate — Great Lakes Executive Learning"
              className="w-full object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
              style={{ display: 'block' }}
            />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 70%, #0d0d0d 100%)' }} />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            {/* Provider + year */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <motion.div className="w-2 h-2 rounded-full" style={{ background: '#F37512' }}
                  animate={{ opacity: [1,0.3,1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#F37512' }}>Great Lakes Executive Learning</span>
              </div>
              <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.3)' }}>2025 – 2026</span>
            </div>

            {/* Title */}
            <h3 className="font-black mb-3" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(1.3rem,3vw,2.2rem)', color: '#F2F2EC', lineHeight: 1.15 }}>
              PGP — Data Science &<br />Generative AI
            </h3>

            {/* Description */}
            <p className="mb-5 leading-relaxed" style={{ fontFamily: 'Geist,sans-serif', fontSize: 'clamp(0.8rem,1.4vw,0.95rem)', color: 'rgba(242,242,236,0.45)' }}>
              ML pipelines, deep learning, NLP, GenAI, RAG systems and production deployment. Specialisation in Generative AI.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Data Science', 'Generative AI', 'RAG', 'NLP', 'ML Pipelines', 'Deep Learning'].map(t => (
                <span key={t} className="rounded-full border px-3 py-1.5 uppercase"
                  style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.12em', color: '#F37512', borderColor: 'rgba(243,117,18,0.2)' }}>{t}</span>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-5 border-t" style={{ borderColor: 'rgba(242,242,236,0.06)' }}>
              <span className="rounded-full px-4 py-1.5 border uppercase"
                style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(242,242,236,0.4)', borderColor: 'rgba(242,242,236,0.08)' }}>
                Postgraduate
              </span>
              <a href="https://www.mygreatlearning.com/certificate/SQTQREOQ" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 font-black hover:text-[#FBD5A5] transition-colors"
                style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: '1.1rem', color: '#F37512' }}>
                Open <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────
function Contact() {
  const { ref, visible } = useReveal(0.05);
  return (
    <section id="contact" className="relative px-5 sm:px-10 py-24 sm:py-32 overflow-hidden grid-bg" style={{ background: '#080808' }}>
      <div className="orb" style={{ width: '500px', height: '500px', top: '-20%', right: '-15%', opacity: 0.05, background: '#F37512', position: 'absolute', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          className="uppercase mb-12 sm:mb-16" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#F37512' }}>
          07 / Contact
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-start">
          {/* Left: headline + direct email big */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <h2 className="font-black leading-tight mb-6" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(2.2rem,5.5vw,4.5rem)', color: '#F2F2EC' }}>
              Let's build<br /><span className="italic gradient-ember">something rare.</span>
            </h2>
            <div className="uppercase mb-3" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#F37512' }}>Direct email</div>
            <a href="mailto:kirankiranu791@gmail.com"
              className="font-black text-[#F2F2EC] hover:text-[#F37512] transition-colors leading-tight block mb-8"
              style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(1rem,2.5vw,1.8rem)', wordBreak: 'break-all' }}>
              kirankiranu791@gmail.com
            </a>
            <a href="mailto:kirankiranu791@gmail.com"
              className="inline-flex items-center gap-2 rounded-full font-medium text-sm uppercase tracking-widest px-8 py-4 text-[#050505] hover:scale-[1.03] transition-transform"
              style={{ fontFamily: 'Geist,sans-serif', background: 'linear-gradient(135deg,#F37512,#FBD5A5)' }}>
              <Mail className="w-4 h-4" /> Send Email
            </a>
          </motion.div>

          {/* Right: links + status */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-4">
            {[
              { icon: <Github className="w-4 h-4" />, lbl: 'GitHub', handle: '@KIRAN4003', href: 'https://github.com/KIRAN4003' },
              { icon: <Linkedin className="w-4 h-4" />, lbl: 'LinkedIn', handle: 'kiran-u-471818325', href: 'https://www.linkedin.com/in/kiran-u-471818325/' },
              { icon: <Mail className="w-4 h-4" />, lbl: 'Email', handle: 'kirankiranu791@gmail.com', href: 'mailto:kirankiranu791@gmail.com' },
            ].map(s => (
              <a key={s.lbl} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="flex items-center justify-between gap-4 p-4 rounded-[16px] border hover:border-[rgba(243,117,18,0.2)] hover:bg-[rgba(243,117,18,0.03)] transition-all group"
                style={{ borderColor: 'rgba(242,242,236,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="text-[#F37512]">{s.icon}</div>
                  <div>
                    <div className="uppercase mb-0.5" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#F37512' }}>{s.lbl}</div>
                    <div className="text-sm opacity-55 group-hover:opacity-100 transition-opacity truncate max-w-[200px]" style={{ fontFamily: 'Geist,sans-serif', color: '#F2F2EC' }}>{s.handle}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#F37512] opacity-25 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
            <div className="rounded-[16px] border p-5 mt-2" style={{ background: 'rgba(13,13,13,0.6)', borderColor: 'rgba(242,242,236,0.06)' }}>
              {[
                { lbl: 'Status', val: 'Open to work' },
                { lbl: 'Location', val: 'Bangalore, India' },
                { lbl: 'Role', val: 'Data Analyst · Data Scientist · AI' },
                { lbl: 'Available', val: 'Immediately' },
              ].map(item => (
                <div key={item.lbl} className="flex justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: 'rgba(242,242,236,0.04)' }}>
                  <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#F37512' }}>{item.lbl}</span>
                  <span className="text-xs opacity-50" style={{ fontFamily: 'Geist,sans-serif', color: '#F2F2EC' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  const MARQUEE = "Open to collaborations · Let's build something incredible · Data · ML · AI · Bangalore · ";
  const txt = MARQUEE.repeat(5);
  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(242,242,236,0.04)' }}>
      <div className="py-10 sm:py-14 overflow-hidden border-b" style={{ borderColor: 'rgba(242,242,236,0.04)' }}>
        <div className="marquee-track flex whitespace-nowrap">
          {txt.split('').map((ch, i) => (
            <span key={i} className="font-black" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(1.5rem,4vw,3rem)', color: i % 3 === 0 ? '#F2F2EC' : i % 3 === 1 ? 'transparent' : '#F37512', WebkitTextStroke: i % 3 === 1 ? '1px rgba(243,117,18,0.25)' : 'none' }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>
      </div>
      <div className="py-12 sm:py-20 px-5 sm:px-10 overflow-hidden">
        <div className="font-black text-center leading-none select-none" style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(4rem,16vw,16rem)', letterSpacing: '-0.04em' }}>
          <span style={{ color: 'rgba(242,242,236,0.05)' }}>Kiran</span>
          <span className="italic gradient-ember mx-3 sm:mx-5"> U</span>
        </div>
      </div>
      <div className="px-5 sm:px-10 py-5 flex flex-wrap items-center justify-between gap-3 border-t" style={{ borderColor: 'rgba(242,242,236,0.04)' }}>
        <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.2)' }}>© 2026 Kiran U · All rights reserved</span>
        <div className="flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F37512' }} animate={{ opacity: [1,0.3,1] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="uppercase" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.2)' }}>Built with care</span>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="uppercase hover:text-[#F37512] transition-colors" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(242,242,236,0.2)' }}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

// ── Scroll Progress ────────────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setPct(max > 0 ? (window.scrollY / max) * 100 : 0); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return <div id="scroll-progress" style={{ height: `${pct}%` }} />;
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);
  return (
    <>
      <AnimatePresence>{!loaded && <Loader onDone={done} />}</AnimatePresence>
      {loaded && (
        <>
          <Cursor />
          <ScrollProgress />
          <Nav />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <GitHub />
            <Certifications />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
