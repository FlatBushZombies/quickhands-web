"use client";

/**
 * HowItWorks — QuickHands
 * ─────────────────────────────────────────────────────────────
 * Airtasker-style sticky left nav + large right photo panel.
 * Every image is a real Unsplash photo, step-relevant,
 * featuring Black people.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";
import {
  ClipboardList,
  Search,
  MessageSquare,
  CreditCard,
  Star,
  type LucideIcon,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  stat: string;
}

const steps: Step[] = [
  {
    icon: ClipboardList,
    title: "Clients post tasks",
    description:
      "Clients describe their task in detail and suggest a budget.",
    image: "/illustrations/tasks.jpg",
    stat: "Tasks posted daily",
  },
  {
    icon: Search,
    title: "Choose the orders that suit you",
    description:
      "Browse available tasks and select the ones that match your skills and schedule.",
    image: "/orders.jpg",
    stat: "Skills matched in seconds",
  },
  {
    icon: MessageSquare,
    title: "Send your offer",
    description:
      "Respond to the task and discuss pricing and details privately with the client.",
    image: "/offers.jpg",
    stat: "",
  },
  {
    icon: CreditCard,
    title: "Complete the work and get paid",
    description:
      "Finish the task and receive your payment securely within the app.",
    image: "/factory-worker.jpg",
    stat: "Payments processed in < 24 hrs",
  },
  {
    icon: Star,
    title: "Build your reputation",
    description:
      "Earn reviews, grow your profile, and attract even more clients.",
    image: "/rep.jpg",
    stat: "",
  },
];

const AUTO_INTERVAL = 4500;

export default function HowItWorks() {
  const [active, setActive] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | undefined>(undefined);
  const startRef = useRef<number>(0);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(rafRef.current ?? 0);
    setProgress(0);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      setProgress(Math.min((elapsed / AUTO_INTERVAL) * 100, 100));
      if (elapsed < AUTO_INTERVAL) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    intervalRef.current = setInterval(() => {
      setActive((a) => (a + 1) % steps.length);
    }, AUTO_INTERVAL);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(rafRef.current ?? 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active]);

  const handleSelect = (i: number) => {
    setActive(i);
    setPaused(false);
  };

  const current = steps[active];
  const Icon = current.icon;

  return (
    <>
      <style>{`
        @keyframes qhiw_fadeSlide {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qhiw_imgFade {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        #how.qhiw *, #how.qhiw *::before, #how.qhiw *::after {
          box-sizing: border-box;
        }
        .qhiw-content-enter { animation: qhiw_fadeSlide .4s ease forwards; }
        .qhiw-img-enter     { animation: qhiw_imgFade  .55s ease forwards; }
      `}</style>

      <section
        id="how"
        className="qhiw relative overflow-hidden bg-neutral-900 text-white py-24"
      >
        {/* dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* ambient glows */}
        <div className="pointer-events-none absolute -top-60 right-0 w-[700px] h-[700px] rounded-full bg-green-500 opacity-[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-60 left-0 w-[600px] h-[600px] rounded-full bg-green-500 opacity-[0.04] blur-[100px]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 mb-5 text-green-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Simple Process
            </span>
            <h2 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              How It{" "}
              <span className="relative inline-block text-green-400">
                Works
                <span className="absolute bottom-1 left-0 right-0 h-[3px] rounded bg-green-400 opacity-30 pointer-events-none" />
              </span>
            </h2>
            <p className="font-sans text-lg text-neutral-400">
              Get started in minutes with our simple, transparent process
            </p>
          </div>

          {/* ══ Two-column layout ══ */}
          <div
            className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >

            {/* ── LEFT: step nav ── */}
            <div className="w-full lg:w-[38%] lg:sticky lg:top-24 flex flex-col gap-2">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i === active;
                return (
                  <button
                    key={step.title}
                    onClick={() => handleSelect(i)}
                    className={`group relative w-full text-left rounded-2xl px-5 py-4 border transition-all duration-300 cursor-pointer
                      ${isActive
                        ? "bg-neutral-800 border-green-500/40 shadow-[0_0_0_1px_rgba(34,197,94,.15),0_8px_32px_rgba(0,0,0,.4)]"
                        : "bg-neutral-800/30 border-neutral-700/40 hover:bg-neutral-800/60 hover:border-neutral-600/60"
                      }`}
                  >
                    <div className="flex items-center gap-4">

                      {/* Icon + number badge */}
                      <div className="relative shrink-0">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300
                          ${isActive
                            ? "bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,.5)]"
                            : "bg-neutral-700/60 group-hover:bg-neutral-700"
                          }`}>
                          <StepIcon className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`} />
                        </div>
                        <div className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black font-mono border transition-all duration-300
                          ${isActive
                            ? "bg-green-500 border-neutral-900 text-white"
                            : "bg-neutral-700 border-neutral-800 text-neutral-400"
                          }`}>
                          {i + 1}
                        </div>
                      </div>

                      {/* Title + preview */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-sans font-semibold text-[15px] leading-snug transition-colors duration-200 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}>
                          {step.title}
                        </p>
                        {isActive && (
                          <p className="qhiw-content-enter font-sans text-[13px] text-neutral-400 mt-1 leading-snug line-clamp-2">
                            {step.description}
                          </p>
                        )}
                      </div>

                      {/* Chevron */}
                      <svg
                        className={`shrink-0 h-4 w-4 transition-all duration-300 ${isActive ? "text-green-400 opacity-100" : "text-neutral-600 opacity-0 group-hover:opacity-60"}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>

                    {/* Progress bar */}
                    {isActive && !paused && (
                      <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-neutral-700 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${progress}%`, transition: "none" }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}

              <p className="font-sans text-center text-xs text-neutral-600 mt-2 tracking-wide">
                Step <span className="text-green-500 font-bold">{active + 1}</span> of {steps.length}
              </p>
            </div>

            {/* ── RIGHT: photo + content ── */}
            <div className="w-full lg:w-[62%]">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,.6)] border border-white/5 bg-neutral-800">

                {/* Photo */}
                <div className="relative h-[300px] sm:h-[380px] lg:h-[440px] overflow-hidden">
                  <img
                    key={active}
                    src={current.image}
                    alt={current.title}
                    className="qhiw-img-enter w-full h-full object-cover object-center block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=85&fit=crop";
                    }}
                  />
                  {/* dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent pointer-events-none" />

                  {/* Step badge */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 bg-neutral-900/70 backdrop-blur-md rounded-full pl-2 pr-4 py-2 border border-white/10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white text-sm font-black font-mono shadow-[0_2px_12px_rgba(34,197,94,.5)]">
                      {active + 1}
                    </div>
                    <span className="text-white text-xs font-semibold tracking-wide">
                      Step {active + 1} of {steps.length}
                    </span>
                  </div>

                  {/* Stat chip — only render if stat is non-empty */}
                  {current.stat && (
                    <div className="absolute top-5 right-5 bg-green-500/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-[0_4px_16px_rgba(34,197,94,.4)]">
                      <p className="font-sans text-white text-[12px] font-bold tracking-wide">
                        {current.stat}
                      </p>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div key={`text-${active}`} className="qhiw-content-enter px-7 py-7">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/15 border border-green-500/25">
                      <Icon className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="font-sans text-2xl lg:text-3xl font-bold text-white leading-tight mt-1.5">
                      {current.title}
                    </h3>
                  </div>

                  <p className="font-sans text-[16px] leading-relaxed text-neutral-300 mb-6">
                    {current.description}
                  </p>

                  {/* Dot nav */}
                  <div className="flex items-center gap-2">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={`transition-all duration-300 rounded-full cursor-pointer border-0 ${i === active ? "w-7 h-2.5 bg-green-500" : "w-2.5 h-2.5 bg-neutral-600 hover:bg-neutral-400"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>{/* /two-col */}

          {/* ── CTA strip ── */}
          <div className="mt-16 rounded-2xl border border-neutral-700/50 bg-neutral-800/40 backdrop-blur-sm px-8 py-10 text-center shadow-[0_8px_40px_rgba(0,0,0,.3)]">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-green-400 mb-2">
              Ready to get started?
            </p>
            <h3 className="font-sans text-2xl lg:text-3xl font-bold text-white mb-6">
              Join thousands of specialists and start earning.
            </h3>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-full bg-green-500 px-8 py-4 text-white text-[15px] font-bold no-underline shadow-[0_8px_28px_rgba(34,197,94,.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-[0_14px_36px_rgba(34,197,94,.4)]"
            >
              Get Started — It's Free
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

        </div>
      </section>
    </>
  );
}