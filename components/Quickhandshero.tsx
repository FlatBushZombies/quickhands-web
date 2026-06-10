"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingModal } from "./OnboardingModal";
import ProfessionalCounter from "./professionals/ProfessionalsCounter";

/* ── Icons ───────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <circle cx="10" cy="10" r="10" fill="#26C08D" fillOpacity="0.1" />
    <path d="M6 10l3 3 5-5" stroke="#26C08D" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="#26C08D" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor">
    <path d="M2 5l2.5 2.5L8 2.5" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Mini chart ──────────────────────────────────────────── */
const MiniChart = () => (
  <svg width="100%" height="32" viewBox="0 0 200 32"
    fill="none" preserveAspectRatio="none">
    <defs>
      <linearGradient id="qhh-chart-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#26C08D" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#26C08D" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 26 C30 24 50 20 75 14 C100 8 130 5 160 3 C180 2 190 3 200 1"
      stroke="#26C08D" strokeWidth="2" fill="none" strokeLinecap="round"
    />
    <path
      d="M0 26 C30 24 50 20 75 14 C100 8 130 5 160 3 C180 2 190 3 200 1 L200 32 L0 32Z"
      fill="url(#qhh-chart-grad)"
    />
  </svg>
);

const WORKER_IMAGE    = "/worker-image.jpg";
const WORKER_FALLBACK = "/worker-image.jpg";

const FEATURES = [
  "Free access to thousands of job opportunities",
  "No subscription or credit fees",
  "Earn extra income on a flexible schedule",
  "Grow your business and client base",
];

export default function QuickHandsHero() {
  const [imgSrc, setImgSrc] = useState(WORKER_IMAGE);

  return (
    <section
      className="relative w-full overflow-hidden isolate flex items-center min-h-[680px] py-32 px-6 bg-white"
    >
      {/* Background ambient grids and glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#1FA777]/3 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a1a02_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-25" />

      {/* Grid container */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ══════════ LEFT ══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left flex flex-col gap-6"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-3.5 py-1 self-start select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
            <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
              Now available in your area
            </span>
          </div>

          {/* Headline - Signifier */}
          <h1 className="font-serif text-[42px] sm:text-5xl md:text-[68px] tracking-[-0.025em] leading-[1.06] text-zinc-950 font-normal">
            Be your own <span className="italic text-primary font-normal">boss</span>.
          </h1>

          {/* Sub-copy - Sohne */}
          <p className="font-sans text-sm text-zinc-500 font-light leading-relaxed max-w-[460px]">
            Whether you're a spreadsheet guru or a skilled carpenter, find your next gig on <strong className="text-zinc-900 font-semibold">QuickHands</strong> and get paid doing what you love.
          </p>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 font-sans select-none">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                <CheckIcon />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA registration */}
          <div className="flex flex-wrap items-center gap-5 mt-2">
            <OnboardingModal>
              <button
                type="button"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3 text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Register as a specialist
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </button>
            </OnboardingModal>
          </div>

          {/* Disclaimer & Counter */}
          <div className="space-y-2.5 font-sans mt-4 border-t border-zinc-50 pt-6">
            <p className="text-[11px] text-zinc-400 font-light">
              We'll send you a confirmation code — no spam, no advertising.
            </p>
            <p className="text-[11px] text-zinc-400 font-light">
              By signing up, you'll be automatically notified when the app launches soon.
            </p>
            <div className="pt-2">
              <ProfessionalCounter />
            </div>
          </div>
        </motion.div>

        {/* ══════════ RIGHT ══════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative h-[480px] lg:h-[540px] w-full"
        >
          {/* Decorative backdrop shape */}
          <div
            className="absolute top-[-12px] left-[-12px] w-[80%] h-full rounded-[32px] opacity-[0.06] pointer-events-none"
            style={{ background: "linear-gradient(135deg,#26C08D 0%,#1FA777 100%)" }}
          />

          {/* Core photo frame */}
          <div className="absolute top-3 left-0 w-[80%] h-full rounded-[32px] overflow-hidden border border-zinc-100 shadow-md">
            <img
              src={imgSrc}
              alt="Professional tasker at work"
              onError={() => setImgSrc(WORKER_FALLBACK)}
              className="w-full h-full object-cover object-top block transition-transform duration-[8000ms] hover:scale-105"
            />
          </div>

          {/* Floating Card A: Payment received */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.6, ease: "easeInOut" }}
            className="absolute top-6 right-0 w-[210px] bg-white border border-zinc-100 rounded-[24px] px-5 py-4 shadow-sm z-10 text-left font-sans space-y-3"
          >
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-emerald-50 text-primary flex items-center justify-center shrink-0">
                <CheckSmallIcon />
              </span>
              Payment received
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-zinc-900 leading-none">Paint chairs</p>
                <p className="text-[10px] text-zinc-400 mt-1 font-light">2h ago</p>
              </div>
              <span className="text-lg font-bold text-primary">$179</span>
            </div>
          </motion.div>

          {/* Floating Card B: New job alert pill */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.2, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-[42%] right-[-10px] flex items-center gap-2.5 rounded-full bg-primary px-4.5 py-2.5 text-white text-xs font-semibold shadow-sm z-10 whitespace-nowrap cursor-pointer font-sans"
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <BellIcon />
            </span>
            New job alert!
          </motion.div>

          {/* Floating Card C: Total earnings with mini chart */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 4.0, ease: "easeInOut", delay: 0.2 }}
            className="absolute bottom-4 right-0 w-[200px] bg-white border border-zinc-100 rounded-[24px] px-5 py-4 shadow-sm z-10 text-left font-sans space-y-3.5"
          >
            <div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Total earnings</p>
              <p className="text-2xl font-bold text-zinc-900 mt-1 leading-none">$13,066</p>
            </div>
            <div className="flex items-center gap-1 text-[10.5px] font-semibold text-primary">
              <TrendUpIcon />
              <span>+20% vs last month</span>
            </div>
            <div className="pt-2 border-t border-zinc-50">
              <MiniChart />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}