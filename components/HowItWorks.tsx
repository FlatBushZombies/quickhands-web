"use client"

import { Clipboard, Users, CheckCircle, Star, ArrowRight } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how" className="relative py-32 bg-white">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase font-sans">
                How It Works
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-zinc-950 leading-tight">
              A frictionless way<br />to get work <span className="italic text-primary">done</span>.
            </h2>
          </div>
          <p className="font-sans text-sm text-zinc-500 leading-relaxed font-light lg:max-w-xs">
            Hire vetted specialists for your tasks and coordinate details directly, without unnecessary administrative steps.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column (Steps 01 & 03) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <StepCard
              icon={Clipboard}
              title="Tell us what you need"
              description="Share the details of your task through a short questionnaire, and we'll match you with the right local experts."
              step="01"
            />
            <StepCard
              icon={Users}
              title="Choose with confidence"
              description="Compare profiles, reviews, and pricing, then select the professional that meets your exact project requirements."
              step="03"
            />
          </div>

          {/* Center Column (Step 02 - Chat UI Mockup) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1 min-h-[420px] rounded-[24px] border border-zinc-100 bg-zinc-50/50 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              
              {/* Inside Mock: Chat Interface */}
              <div className="flex-1 flex flex-col justify-between bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm/50 relative z-10">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-zinc-50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200 shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" 
                        alt="Farai M." 
                        className="object-cover h-full w-full" 
                      />
                    </div>
                    <div className="font-sans text-left">
                      <p className="text-[11px] font-bold text-zinc-900 leading-none">Farai M.</p>
                      <span className="text-[9px] text-primary font-medium flex items-center gap-0.5 mt-1">
                        <span className="h-1 w-1 rounded-full bg-primary" /> Cabinet Maker
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-400 font-sans font-medium">Job #2409</span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 my-4 space-y-3 overflow-hidden text-[11px] font-sans text-left">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-zinc-50 text-zinc-800 rounded-2xl rounded-tl-sm px-3.5 py-2 border border-zinc-100">
                      Hi Tendai! I reviewed your project details for the custom wardrobe. I can start on Thursday.
                    </div>
                    <span className="text-[8px] text-zinc-400 mt-1 ml-1">10:14 AM</span>
                  </div>
                  <div className="flex flex-col items-end max-w-[85%] ml-auto">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3.5 py-2 font-semibold">
                      Sounds great, Farai. Can we align on dimensions tomorrow morning?
                    </div>
                    <span className="text-[8px] text-zinc-400 mt-1 mr-1">10:16 AM</span>
                  </div>
                </div>

                {/* Chat Input Bar */}
                <div className="flex items-center bg-zinc-50 border border-zinc-100 rounded-full p-1 shadow-sm/30">
                  <div className="w-full text-left bg-transparent px-3 text-[10px] text-zinc-400 font-sans font-light">
                    Type a message...
                  </div>
                  <button className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Step Info Overlay */}
              <div className="mt-4 text-left font-sans">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Step 02</span>
                <h3 className="text-sm font-semibold text-zinc-900 mt-1">Direct Communication</h3>
                <p className="text-[11.5px] text-zinc-500 mt-1 font-light leading-relaxed">
                  Specialists review your task requirements and discuss quotes with you instantly via chat.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Step 04 & Trust Card) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <StepCard
              icon={CheckCircle}
              title="Get it done and review"
              description="Approve the completed job, release payment securely, and leave a public review to guide future clients."
              step="04"
            />
            
            {/* Premium Trust Card */}
            <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-[24px] p-7 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-primary/20 rounded-full blur-[40px] pointer-events-none -z-10" />
              
              <div className="space-y-4 text-left font-sans">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                  <Star className="h-4 w-4 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Trusted by local residents</h3>
                  <p className="text-[12px] text-zinc-400 mt-1.5 leading-relaxed font-light">
                    Providing verified references, active identity validation, and high overall satisfaction scores in the Harare region.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-6 flex items-center justify-between text-[11px] font-sans text-zinc-500">
                <span>100% Secure Platform</span>
                <span className="text-zinc-300 font-semibold">Harare &amp; Beyond</span>
              </div>
            </div>
          </div>

        </div>
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
    <div className="rounded-[24px] border border-zinc-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left flex flex-col justify-between h-full group">
      <div className="space-y-4">
        <div className="flex items-center justify-between font-sans">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
            <Icon className="h-4 w-4 text-zinc-700" strokeWidth={2} />
          </div>
          <span className="font-serif text-sm italic text-zinc-300 select-none">{step}</span>
        </div>
        
        <h3 className="text-sm font-semibold text-zinc-950 font-sans">{title}</h3>
        <p className="text-[12px] leading-relaxed text-zinc-500 font-sans font-light">{description}</p>
      </div>
    </div>
  )
}