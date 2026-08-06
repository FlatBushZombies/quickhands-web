"use client"

import { Clipboard, Users, CheckCircle, Star, ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="how" className="relative py-32 bg-white overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/[0.01] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle dotted pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a1a01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-20" />

      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
                How It Works
              </span>
            </div>
            <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-950 leading-tight">
              A frictionless way<br />to get work <span className="italic text-primary">done</span>.
            </h2>
          </div>
          <p className="font-sans text-sm text-zinc-500 leading-relaxed font-light lg:max-w-xs">
            Hire vetted specialists for your tasks and coordinate details directly, without unnecessary administrative steps.
          </p>
        </div>

        {/* Sequential Bento Grid — reads 01 → 02 → 03 → 04 on every breakpoint */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
        >

          {/* Step 01 */}
          <motion.div
            variants={stepVariants}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="lg:col-span-4"
          >
            <StepCard
              icon={Clipboard}
              title="Tell us what you need"
              description="Share the details of your task through a short questionnaire, and we'll match you with the right local experts."
              step="01"
            />
          </motion.div>

          {/* Step 02 — Chat UI Mockup (center anchor, spans both rows) */}
          <motion.div
            variants={stepVariants}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="lg:col-span-4 lg:row-span-2 flex flex-col"
          >
            <div className="flex-1 min-h-[420px] rounded-[24px] border border-zinc-200 bg-[var(--primary-light)] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-300">

              {/* Inside Mock: Chat Interface */}
              <div className="flex-1 flex flex-col justify-between bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm relative z-10 transition-colors duration-300 group-hover:border-zinc-300">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-zinc-150 overflow-hidden relative border border-zinc-200 shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" 
                        alt="Farai M." 
                        className="object-cover h-full w-full" 
                      />
                    </div>
                    <div className="font-sans text-left">
                      <p className="text-[11px] font-bold text-zinc-900 leading-none">Farai M.</p>
                      <span className="text-[9px] text-primary font-medium flex items-center gap-0.5 mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Cabinet Maker
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-400 font-sans font-medium">Job #2409</span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 my-4 space-y-3.5 overflow-hidden text-[11px] font-sans text-left">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-zinc-50 text-zinc-800 rounded-2xl rounded-tl-sm px-3.5 py-2 border border-zinc-200">
                      Hi Tendai! I reviewed your project details for the custom wardrobe. I can start on Thursday.
                    </div>
                    <span className="text-[8px] text-zinc-400 mt-1 ml-1.5 font-light">10:14 AM</span>
                  </div>
                  <div className="flex flex-col items-end max-w-[85%] ml-auto">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3.5 py-2 font-semibold shadow-[0_3px_10px_rgba(38,192,141,0.2)]">
                      Sounds great, Farai. Can we align on dimensions tomorrow morning?
                    </div>
                    <span className="text-[8px] text-zinc-400 mt-1 mr-1.5 font-light">10:16 AM</span>
                  </div>
                </div>

                {/* Chat Input Bar */}
                <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-full p-1.5 shadow-sm">
                  <div className="w-full text-left bg-transparent px-3 text-[10px] text-zinc-400 font-sans font-light">
                    Type a message...
                  </div>
                  <button className="h-6.5 w-6.5 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(38,192,141,0.25)] hover:bg-primary-hover active:scale-95 transition-all">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Step Info Overlay */}
              <div className="mt-4 text-left font-sans">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Step 02</span>
                <h3 className="text-sm font-bold text-zinc-900 mt-1">Direct Communication</h3>
                <p className="text-[11.5px] text-zinc-500 mt-1 font-light leading-relaxed">
                  Specialists review your task requirements and discuss quotes with you instantly via chat.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div
            variants={stepVariants}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="lg:col-span-4"
          >
            <StepCard
              icon={Users}
              title="Choose with confidence"
              description="Compare profiles, reviews, and pricing, then select the professional that meets your exact project requirements."
              step="03"
            />
          </motion.div>

          {/* Step 04 */}
          <motion.div
            variants={stepVariants}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="lg:col-span-4"
          >
            <StepCard
              icon={CheckCircle}
              title="Get it done and review"
              description="Approve the completed job, release payment securely, and leave a public review to guide future clients."
              step="04"
            />
          </motion.div>

          {/* Premium Trust Card */}
          <motion.div
            variants={stepVariants}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="lg:col-span-4 flex flex-col"
          >
            <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-[24px] p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-zinc-800 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_center,rgba(38,192,141,0.15)_0%,rgba(38,192,141,0.01)_70%,transparent_100%)] rounded-full blur-[40px] pointer-events-none -z-10" />

              <div className="space-y-4 text-left font-sans">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 transition-transform duration-300 group-hover:scale-105">
                  <Star className="h-4 w-4 text-primary fill-primary/10" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Trusted by local residents</h3>
                  <p className="text-[12px] text-zinc-455 mt-1.5 leading-relaxed font-light text-zinc-400">
                    Providing verified references, active identity validation, and high overall satisfaction scores in the Harare region.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-6 flex items-center justify-between text-[11px] font-sans text-zinc-500">
                <span>100% Secure Platform</span>
                <span className="text-zinc-300 font-semibold">Harare &amp; Beyond</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}

interface StepCardProps {
  icon: any
  title: string
  description: string
  step: string
}

function StepCard({ icon: Icon, title, description, step }: StepCardProps) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] hover:border-primary/30 hover:shadow-md text-left flex flex-col justify-between h-full group cursor-pointer">
      <div className="space-y-4">
        <div className="flex items-center justify-between font-sans">
          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 transition-all duration-300 group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary text-zinc-700">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="font-serif text-sm italic text-zinc-300 select-none group-hover:text-primary/40 transition-colors">{step}</span>
        </div>

        <h3 className="text-sm font-bold text-zinc-950 font-sans">{title}</h3>
        <p className="text-[12px] leading-relaxed text-zinc-500 font-sans font-light">{description}</p>
      </div>
    </div>
  )
}