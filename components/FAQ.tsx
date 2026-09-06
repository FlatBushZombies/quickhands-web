"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "./ui/button"
import { OnboardingModal } from "./OnboardingModal"
import { MessageCircle, ArrowRight } from "lucide-react"

const faqs = [
  {
    question: "How can I make money on Quickhands?",
    answer:
      "Choose a task posted on the platform, send your proposal to the client, and if selected, complete the task and get paid securely through our platform.",
  },
  {
    question: "Why do specialists pay to use the platform?",
    answer:
      "Fees help provide a steady flow of high-quality orders. They also support platform development, advertising, and dedicated specialist support to ensure you have the best experience.",
  },
  {
    question: "What if I pay for a response but the job isn't right for me?",
    answer:
      "Choose tasks carefully by reviewing the description, budget, and complexity. If a client doesn't open your message within 5 days, the response fee is automatically refunded to your account.",
  },
  {
    question: "How do payments work?",
    answer:
      "You pay a small fee for the opportunity to contact a client. The amount is charged instantly from your balance or linked card, giving you immediate access to respond to orders.",
  },
  {
    question: "Who pays me for the work?",
    answer:
      "Clients pay when they choose to work with you. Funds are released to you after the job is completed through our secure platform payment system.",
  },
  {
    question: "Will clients choose me if I don't have reviews yet?",
    answer:
      "Absolutely. Clients consider many factors, including a well-completed profile, work samples, clear communication, and fair pricing. Many professionals get their first job quickly by showcasing their expertise.",
  },
  {
    question: "What if the client disappears?",
    answer:
      "Sometimes clients change plans. If a client seems hesitant, communicate clearly and ask for confirmation or notice if plans change. You can also report inactive clients to our support team.",
  },
  {
    question: "Am I guaranteed to get the order?",
    answer:
      "Clients decide who to work with based on your profile, offer, communication, and pricing. While not guaranteed, creating a strong profile and sending thoughtful proposals significantly increases your chances.",
  },
]

export function FaqSection() {
  return (
    <section className="relative py-32 bg-zinc-950 overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-20" />

      <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
          
          {/* Left Column — Sticky Info */}
          <div className="lg:sticky lg:top-28 text-left font-sans flex flex-col gap-5">
            {/* Label */}
            <div className="inline-flex items-center gap-2 self-start select-none">
              <MessageCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="text-[10px] font-semibold text-zinc-400 tracking-[0.16em] uppercase font-sans">
                Help Center
              </span>
            </div>

            {/* Title */}
            <h2 className="font-heading font-bold text-4xl lg:text-6xl leading-[1.05] tracking-tight text-white mb-2">
              Frequently Asked Questions
            </h2>

            {/* Description */}
            <p className="font-body text-[15px] text-zinc-400 leading-relaxed font-normal max-w-sm mb-4">
              Everything you need to know about working on Quickhands. Can't find what you're looking for? Contact our support team.
            </p>

            {/* Pill CTA Sign Up */}
            <OnboardingModal>
              <Button
                size="lg"
                className="h-11 px-7 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-full shadow-sm transition-all duration-200 group self-start cursor-pointer"
              >
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </OnboardingModal>

            {/* Custom Interactive Widget (Replaces static SVG Illustration) */}
            <div className="relative mt-8 max-w-xs select-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-[24px] blur-xl" />
              <div className="relative rounded-[24px] border border-zinc-850 bg-zinc-900/90 backdrop-blur-md p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8.5 w-8.5 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-750 transition-colors group-hover:border-primary/30">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Ask our helper bot</p>
                    <p className="text-[9px] text-zinc-500 font-light mt-0.5">Response time: &lt; 1 min</p>
                  </div>
                </div>
                <div className="bg-zinc-850/40 rounded-xl p-3 border border-zinc-850/50 text-[11px] text-zinc-400 leading-normal font-light">
                  "Hello! I am here to help you get registered as a specialist. What skills do you have?"
                </div>
                <div className="flex items-center bg-zinc-950 border border-zinc-850 rounded-full p-1.5 shadow-inner">
                  <div className="w-full text-left bg-transparent px-3 text-[10px] text-zinc-500 font-light">
                    Type your question...
                  </div>
                  <button className="h-6.5 w-6.5 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(20,168,0,0.25)] hover:bg-primary-hover active:scale-95 transition-all">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — FAQ Accordions */}
          <div>
            <Accordion type="single" collapsible className="space-y-3 font-sans text-left">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group border border-zinc-900 bg-zinc-900/30 rounded-[24px] px-6 py-1
                    data-[state=open]:bg-zinc-900 data-[state=open]:border-primary/20 data-[state=open]:border-l-primary data-[state=open]:border-l-2
                    transition-all duration-300 hover:border-zinc-850 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <AccordionTrigger
                    className="py-5 text-left text-[14.5px] font-semibold text-zinc-300 
                      hover:text-white hover:no-underline transition-colors duration-150 border-0 focus:outline-none"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-[15px] text-zinc-400 leading-relaxed pb-5 border-t border-zinc-850/30 pt-4 font-normal">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Bottom helper email link */}
            <p className="mt-10 font-body text-[15px] text-zinc-500 text-center font-normal select-none">
              Still have questions?{" "}
              <a href="mailto:support@quickhands.com" className="text-primary hover:text-primary-hover transition-colors underline underline-offset-2">
                Contact our support team →
              </a>
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
