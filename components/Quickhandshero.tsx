"use client";

/**
 * QuickHandsHero
 * ─────────────────────────────────────────────────────────────
 * • Pure Tailwind CSS (arbitrary values for one-off shadows/sizes)
 * • All custom keyframes are scoped under the `.qhh` namespace
 *   so they NEVER bleed into the rest of the page
 * • overflow-hidden on the section stops float-cards from
 *   creating a horizontal scrollbar
 * • No global resets — box-sizing + margin only inside .qhh scope
 * • Google Fonts loaded via a <link> tag so it doesn't block
 *   anything outside this component
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { OnboardingModal } from "./OnboardingModal";

/* ── Icons ───────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <circle cx="10" cy="10" r="10" fill="#22C55E" fillOpacity="0.14" />
    <path d="M6 10l3 3 5-5" stroke="#22C55E" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="#22C55E" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Mini chart ──────────────────────────────────────────── */
const MiniChart = () => (
  <svg width="100%" height="48" viewBox="0 0 200 48"
    fill="none" preserveAspectRatio="none">
    <defs>
      <linearGradient id="qhh-chart-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 40 C30 38 50 34 75 24 C100 14 130 8 160 5 C180 3 190 4 200 2"
      stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round"
    />
    <path
      d="M0 40 C30 38 50 34 75 24 C100 14 130 8 160 5 C180 3 190 4 200 2 L200 48 L0 48Z"
      fill="url(#qhh-chart-grad)"
    />
  </svg>
);

/* ── Constants ───────────────────────────────────────────── */
const WORKER_IMAGE    = "/worker-image.jpg";
const WORKER_FALLBACK = "/worker-image.jpg";

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=68&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616b612b283?w=68&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=68&q=80&fit=crop&crop=face",
];

const FEATURES = [
  "Free access to thousands of job opportunities",
  "No subscription or credit fees",
  "Earn extra income on a flexible schedule",
  "Grow your business and client base",
];

/* ══════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════ */
export default function QuickHandsHero() {
  const [imgSrc, setImgSrc] = useState(WORKER_IMAGE);

  return (
    <>
      {/* ── Fonts & scoped keyframes ── */}
      <style>{`
    

        /* Box model reset scoped to component only */
        .qhh *, .qhh *::before, .qhh *::after {
          box-sizing: border-box;
        }

        /* Keyframes — prefixed qhh_ to avoid collisions */
        @keyframes qhh_fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes qhh_fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes qhh_floatA {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-9px); }
        }
        @keyframes qhh_floatB {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes qhh_pulseDot {
          0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94,.55); }
          60%      { box-shadow: 0 0 0 6px rgba(34,197,94,0);   }
        }

        .qhh .qhh-fu1 { opacity:0; animation: qhh_fadeUp .6s ease forwards .05s; }
        .qhh .qhh-fu2 { opacity:0; animation: qhh_fadeUp .7s ease forwards .15s; }
        .qhh .qhh-fu3 { opacity:0; animation: qhh_fadeUp .7s ease forwards .25s; }
        .qhh .qhh-fu4 { opacity:0; animation: qhh_fadeUp .7s ease forwards .35s; }
        .qhh .qhh-fu5 { opacity:0; animation: qhh_fadeUp .7s ease forwards .45s; }
        .qhh .qhh-fu6 { opacity:0; animation: qhh_fadeUp .7s ease forwards .55s; }
        .qhh .qhh-fi  { opacity:0; animation: qhh_fadeIn .9s ease forwards .3s;  }

        .qhh .qhh-float-a { animation: qhh_floatA 4s   ease-in-out infinite;      }
        .qhh .qhh-float-b { animation: qhh_floatB 3.5s ease-in-out infinite .6s;  }
        .qhh .qhh-float-c { animation: qhh_floatA 4.5s ease-in-out infinite 1.1s; }
        .qhh .qhh-dot     { animation: qhh_pulseDot 2s ease-in-out infinite;       }
      `}</style>

      {/*
        ── Root wrapper ──────────────────────────────────────
        • overflow-hidden  → clips floating cards, no h-scroll
        • isolate          → new stacking context, z-index safe
        • w-full           → fills its parent, no more
      */}
      <section
        className="qhh relative w-full overflow-hidden isolate
                   flex items-center
                   min-h-[680px] py-20 px-[6vw]
                   bg-white"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 72% 8%,  rgba(34,197,94,.07)  0%, transparent 55%)," +
            "radial-gradient(ellipse at 8%  82%, rgba(26,107,255,.05) 0%, transparent 50%)," +
            "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "auto, auto, 28px 28px",
        }}
      >
        {/* inner max-width container */}
        <div className="relative z-10 mx-auto w-full max-w-[1280px]
                        grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ══════════ LEFT ══════════ */}
          <div>

            {/* Badge */}
            <div className="qhh-fu1 inline-flex items-center gap-2
                            rounded-full border border-green-200 bg-green-50
                            px-3 py-[6px] mb-7">
              <span className="qhh-dot w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-green-700 text-[13px] font-semibold tracking-wide">
                Now available in your area
              </span>
            </div>

            {/* Headline */}
            <h1 className="qhh-display qhh-fu2
                           text-[clamp(42px,5vw,72px)] font-black
                           text-slate-900 leading-[1.04] tracking-[-2px]
                           m-0 mb-5">
              Be your<br />
              own{" "}
              <span className="relative inline-block text-green-500">
                boss
                {/* underline accent */}
                <span className="absolute bottom-[3px] left-0 right-0 h-[5px]
                                 rounded bg-green-400 opacity-25 pointer-events-none" />
              </span>
            </h1>

            {/* Sub-copy */}
            <p className="qhh-fu3 text-[17px] text-slate-500 leading-relaxed
                          max-w-[460px] m-0 mb-8">
              Whether you're a spreadsheet guru or a skilled carpenter,
              find your next gig on{" "}
              <strong className="text-slate-800 font-semibold">QuickHands</strong>{" "}
              and get paid doing what you love.
            </p>

            {/* Feature list */}
            <ul className="qhh-fu4 list-none m-0 p-0 flex flex-col gap-3 mb-10">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3
                                       text-[15.5px] text-slate-600 font-medium">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA row */}
            <div className="qhh-fu5 flex flex-wrap items-center gap-5">
            <OnboardingModal>
              <a
                href="#"
                className="group inline-flex items-center gap-2.5
                           rounded-full bg-green-500
                           px-8 py-4
                           text-white text-[15.5px] font-bold no-underline
                           shadow-[0_8px_28px_rgba(34,197,94,.35)]
                           transition-all duration-200
                           hover:-translate-y-0.5 hover:bg-green-600
                           hover:shadow-[0_14px_36px_rgba(34,197,94,.4)]"
              >
                Register as a specialist
                <span className="flex h-6 w-6 shrink-0 items-center justify-center
                                 rounded-full bg-white/20
                                 transition-transform duration-200
                                 group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </a>
              </OnboardingModal>
            </div>

            {/* Disclaimer */}
            <div className="qhh-fu6">
              <p className="font-sans mt-6 text-sm text-neutral-600 m-0">
                We'll send you a confirmation code — no spam, no advertising.
              </p>
              <p className="font-sans mt-2 text-sm text-neutral-600 m-0">
                By signing up, you'll be automatically notified when the app launches soon.
              </p>
            </div>
          </div>

          {/* ══════════ RIGHT ══════════ */}
          {/*
            Height is fixed so floating cards don't push
            the section taller than intended.
            On mobile we let it be auto so the photo isn't crushed.
          */}
          <div className="qhh-fi relative h-[500px] lg:h-[560px]">

            {/* Decorative green shape (behind photo, clipped by parent) */}
            <div
              className="absolute top-[-16px] left-[-16px] w-[78%] h-full
                         rounded-[28px] -z-10 opacity-[0.16] pointer-events-none"
              style={{ background: "linear-gradient(135deg,#22C55E 0%,#16a34a 100%)" }}
            />

            {/* ── Photo frame ── */}
            <div className="absolute top-3 left-0 w-[78%] h-full
                            rounded-[28px] overflow-hidden
                            shadow-[0_32px_80px_rgba(15,23,42,.18),0_0_0_1px_rgba(0,0,0,.04)]">
              <img
                src={imgSrc}
                alt="Professional tasker at work"
                onError={() => setImgSrc(WORKER_FALLBACK)}
                className="w-full h-full object-cover object-top block
                           transition-transform duration-[8000ms] hover:scale-105"
              />
            </div>

            {/* ── Payment received card ──────────────────────
                Positioned within the right panel.
                right-0 so it partially overlaps the photo edge.
            ─────────────────────────────────────────────── */}
            <div className="qhh-float-a
                            absolute top-6 right-0
                            w-[220px] bg-white rounded-[18px]
                            px-4 py-3.5
                            shadow-[0_12px_48px_rgba(15,23,42,.13),0_0_0_1px_rgba(0,0,0,.05)]
                            z-10">
              {/* label row */}
              <div className="flex items-center gap-1.5
                              text-[11px] uppercase tracking-wide
                              font-medium text-gray-400 mb-2">
                <span className="w-4 h-4 rounded-full bg-green-500
                                 flex items-center justify-center shrink-0">
                  <CheckSmallIcon />
                </span>
                Payment received
              </div>
              {/* amount row */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[14.5px] font-bold text-gray-900 m-0">
                    Paint chairs
                  </p>
                  <p className="text-[11.5px] text-gray-400 m-0 mt-0.5">2h ago</p>
                </div>
                <span className="text-[22px] font-extrabold text-green-500">$179</span>
              </div>
            </div>

            {/* ── New job alert pill ── */}
            <div className="qhh-float-b
                            absolute top-[45%] right-[-4px]
                            flex items-center gap-2
                            rounded-full bg-green-500
                            px-4 py-2.5
                            text-white text-[13.5px] font-bold
                            shadow-[0_8px_24px_rgba(34,197,94,.45)]
                            z-10 whitespace-nowrap">
              <span className="w-[22px] h-[22px] rounded-full bg-white/20
                               flex items-center justify-center shrink-0">
                <BellIcon />
              </span>
              New job alert!
            </div>

            {/* ── Total earnings card ── */}
            <div className="qhh-float-c
                            absolute bottom-4 right-0
                            w-[200px] bg-white rounded-[18px]
                            px-4 py-3.5
                            shadow-[0_12px_48px_rgba(15,23,42,.13),0_0_0_1px_rgba(0,0,0,.05)]
                            z-10">
              <p className="text-[11px] uppercase tracking-wide
                            font-medium text-gray-400 m-0 mb-1.5">
                Total earnings
              </p>
              <p className="text-[26px] font-extrabold text-slate-900 m-0 leading-none mb-1">
                $13,066
              </p>
              <div className="flex items-center gap-1
                              text-[12px] font-semibold text-green-500 mb-2">
                <TrendUpIcon />
                +20% vs last month
              </div>
              <MiniChart />
            </div>

          </div>{/* /right */}
        </div>{/* /grid */}
      </section>
    </>
  );
}