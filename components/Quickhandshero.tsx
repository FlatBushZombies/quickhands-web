"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingModal } from "./OnboardingModal";
import ProfessionalCounter from "./professionals/ProfessionalsCounter";
import { Eyebrow } from "./quickhands/Eyebrow";
import { Em } from "./quickhands/Em";

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

const HERO_IMAGE =
  "https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg?cs=srgb&dl=pexels-quintingellar-313776.jpg&fm=jpg";
const HERO_FALLBACK = "/worker-image.jpg";

const FEATURES = [
  "Free access to thousands of job opportunities",
  "No subscription or credit fees",
  "Earn extra income on a flexible schedule",
  "Grow your business and client base",
];

export default function QuickHandsHero() {
  const [imgSrc, setImgSrc] = useState(HERO_IMAGE);

  return (
    <section className="relative w-full">
      {/* ══════════ Full-bleed cinematic panel ══════════ */}
      <div className="relative isolate flex min-h-[640px] w-full items-end overflow-hidden">
        <img
          src={imgSrc}
          alt="A carpenter shaping wood in a sun-lit workshop"
          onError={() => setImgSrc(HERO_FALLBACK)}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        {/* Dark, bottom-heavy gradient — keeps the nav legible up top and the
            headline block legible at the bottom, while the middle of the
            photo stays clear. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

        {/* Floating glass stat cluster — reprises the "How We Work" chip
            treatment, anchored clear of the headline block. */}
        <div className="absolute right-6 top-24 z-10 hidden flex-col items-end gap-4 sm:top-28 sm:right-8 md:flex">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.6, ease: "easeInOut" }}
            className="w-[200px] space-y-3 rounded-[22px] border border-white/25 bg-white/15 px-5 py-4 text-left font-sans shadow-[0_10px_30px_-6px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/70">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                <CheckSmallIcon />
              </span>
              Payment received
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold leading-none text-white">Paint chairs</p>
                <p className="mt-1 text-[10px] font-light text-white/60">2h ago</p>
              </div>
              <span className="text-lg font-bold text-white">$179</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.2, ease: "easeInOut", delay: 0.4 }}
            className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/25 bg-primary px-4.5 py-2.5 font-sans text-xs font-semibold text-white shadow-[0_4px_14px_rgba(38,192,141,0.35)] transition-transform active:scale-95"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
              <BellIcon />
            </span>
            New job alert!
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 4.0, ease: "easeInOut", delay: 0.2 }}
            className="w-[190px] space-y-3 rounded-[22px] border border-white/25 bg-white/15 px-5 py-4 text-left font-sans shadow-[0_12px_36px_-6px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">Total earnings</p>
              <p className="mt-1 text-xl font-bold leading-none text-white">$13,066</p>
            </div>
            <div className="flex items-center gap-1 text-[10.5px] font-semibold text-white">
              <TrendUpIcon />
              <span>+20% vs last month</span>
            </div>
            <div className="border-t border-white/20 pt-2">
              <MiniChart />
            </div>
          </motion.div>
        </div>

        {/* Headline block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-start gap-5 px-6 pb-16 pt-40 sm:pb-20"
        >
          <Eyebrow animate={false} pulse tone="dark" className="self-start">
            Now available in your area
          </Eyebrow>

          <h1 className="font-serif text-[42px] font-bold leading-[1.04] tracking-[-0.025em] text-white sm:text-6xl md:text-[68px]">
            Be your own <Em className="font-bold">boss</Em>.
          </h1>

          <p className="max-w-[460px] font-sans text-sm font-light leading-relaxed text-white/80">
            Whether you're a spreadsheet guru or a skilled carpenter, find your next gig on{" "}
            <strong className="font-semibold text-white">QuickHands</strong> and get paid doing what you
            love.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-5">
            <OnboardingModal>
              <button
                type="button"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(38,192,141,0.35)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_6px_20px_rgba(38,192,141,0.45)] active:scale-[0.97]"
              >
                Register as a specialist
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </button>
            </OnboardingModal>
          </div>
        </motion.div>
      </div>

      {/* ══════════ Secondary band — feature list, disclaimer, live counter ══════════ */}
      <div className="relative w-full border-b border-zinc-200 bg-white py-12 sm:py-14">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between">
          <ul className="flex flex-col gap-3 font-sans select-none sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3 md:max-w-md">
            {FEATURES.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-xs font-light text-zinc-500 transition-all duration-200 hover:translate-x-0.5 hover:text-zinc-800 cursor-pointer"
              >
                <CheckIcon />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 font-sans md:max-w-xs md:border-l md:border-zinc-200 md:pl-8">
            <p className="text-[11px] font-light text-zinc-400">
              We'll send you a confirmation code — no spam, no advertising.
            </p>
            <p className="text-[11px] font-light text-zinc-400">
              By signing up, you'll be automatically notified when the app launches soon.
            </p>
            <div className="pt-2">
              <ProfessionalCounter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}