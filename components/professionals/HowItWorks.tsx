"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  MessageSquare,
  CreditCard,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "@/components/quickhands/Eyebrow";
import { Em } from "@/components/quickhands/Em";

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
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number>(0);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, active]);

  const handleSelect = (i: number) => {
    setActive(i);
    setPaused(false);
  };

  const current = steps[active];
  const Icon = current.icon;

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-zinc-950 text-white py-32"
    >
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />
      
      {/* Soft dark ambient glows */}
      <div className="pointer-events-none absolute -top-40 right-0 w-[550px] h-[550px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute -bottom-40 left-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px] -z-10" />

      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6">

        {/* ── Section Header ── */}
        <div className="max-w-xl mb-20 text-left font-sans">
          <Eyebrow tone="dark" animate={false} pulse className="mb-4">
            Simple Process
          </Eyebrow>
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-4 leading-tight">
            How It <Em>Works</Em>.
          </h2>
          <p className="font-body text-[15px] text-zinc-400 font-normal leading-relaxed">
            Get started in minutes with our simple, transparent onboarding process for specialists.
          </p>
        </div>

        {/* Two-Column Grid Stepper */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* LEFT COLUMN: Step toggles */}
          <div className="lg:col-span-5 flex flex-col gap-3 font-sans w-full lg:sticky lg:top-28">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = i === active;
              return (
                <button
                  key={step.title}
                  onClick={() => handleSelect(i)}
                  className={`group relative w-full text-left rounded-[24px] px-6 py-4.5 border transition-all duration-300 cursor-pointer focus:outline-none
                    ${isActive
                      ? "bg-zinc-900 border-zinc-800 border-l-2 border-l-primary shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                      : "bg-transparent border-transparent hover:bg-zinc-900/30 hover:border-zinc-900/80"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div className="relative shrink-0 select-none">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 border
                        ${isActive
                          ? "bg-primary border-primary shadow-[0_4px_16px_rgba(20,168,0,0.25)] text-white"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-zinc-300 group-hover:bg-zinc-850"
                        }`}>
                        <StepIcon className="h-4.5 w-4.5" />
                      </div>
                      <div className={`absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-bold border transition-all duration-300 font-sans
                        ${isActive
                          ? "bg-primary border-zinc-900 text-white"
                          : "bg-zinc-850 border-zinc-900 text-zinc-500 group-hover:text-zinc-400"
                        }`}>
                        {i + 1}
                      </div>
                    </div>

                    {/* Step Title + Preview Description */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`}>
                        {step.title}
                      </p>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-[11.5px] text-zinc-400 mt-1 leading-relaxed font-light"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </div>

                    {/* Chevron Indicator */}
                    <svg
                      className={`shrink-0 h-4.5 w-4.5 transition-all duration-300 ${isActive ? "text-primary opacity-100" : "text-zinc-700 opacity-0 group-hover:opacity-70"}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>

                  {/* Tiny Progress Tracker Bar */}
                  {isActive && !paused && (
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${progress}%`, transition: "none" }}
                      />
                    </div>
                  )}
                </button>
              );
            })}

            <p className="text-center text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest select-none">
              Step <span className="text-primary font-bold">{active + 1}</span> of {steps.length}
            </p>
          </div>

          {/* RIGHT COLUMN: Photo + detail card */}
          <div className="lg:col-span-7 w-full">
            <div className="relative rounded-[24px] overflow-hidden border border-zinc-850 bg-zinc-900/40 backdrop-blur-sm shadow-xl hover:border-zinc-800 transition-colors duration-350">
              
              {/* Image Frame */}
              <div className="relative h-[280px] sm:h-[350px] lg:h-[400px] overflow-hidden select-none">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover object-center block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=85&fit=crop";
                    }}
                  />
                </AnimatePresence>

                {/* Subdued Dark Editorial Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />

                {/* Custom Step badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md rounded-full pl-2 pr-3.5 py-1.5 border border-zinc-900/80">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold font-sans">
                    {active + 1}
                  </div>
                  <span className="text-white text-[10.5px] font-semibold tracking-wide font-sans">
                    Step {active + 1} of {steps.length}
                  </span>
                </div>

                {/* Stat tag if exists */}
                {current.stat && (
                  <div className="absolute top-5 right-5 bg-primary/95 backdrop-blur-sm rounded-full px-3.5 py-1.5 shadow-[0_4px_16px_rgba(20,168,0,0.25)] border border-primary/20">
                    <p className="text-white text-[10.5px] font-semibold tracking-wide font-sans">
                      {current.stat}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Text */}
              <div className="p-7 font-sans text-left space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-primary shadow-[0_4px_12px_rgba(20,168,0,0.1)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl font-bold text-white mt-2 leading-tight">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="font-body text-[15px] leading-relaxed text-zinc-400 font-normal">
                  {current.description}
                </p>

                {/* Bottom Navigation Dots */}
                <div className="flex items-center gap-2 pt-2 select-none">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`transition-all duration-300 rounded-full cursor-pointer border-0 ${i === active ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-zinc-800 hover:bg-zinc-700"}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* CTA callout band */}
        <div className="mt-20 rounded-[24px] border border-zinc-850 bg-zinc-900/20 backdrop-blur-sm px-6 py-12 text-center shadow-lg font-sans flex flex-col items-center justify-center gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Ready to get started?
            </p>
            <h3 className="font-heading text-2xl md:text-4xl font-bold text-white">
              Join thousands of specialists and start earning.
            </h3>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(20,168,0,0.25)] hover:shadow-[0_6px_20px_rgba(20,168,0,0.35)] hover:bg-primary-hover active:scale-[0.97] transition-all duration-200 select-none cursor-pointer"
          >
            Get Started — It's Free
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}