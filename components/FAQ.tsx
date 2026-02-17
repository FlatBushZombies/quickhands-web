"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
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
    <section className="relative py-28 bg-zinc-950 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
          {/* Left column — sticky */}
          <div className="lg:sticky lg:top-24">
            {/* Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900 px-4 py-1.5 mb-7">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span
                className="text-xs font-semibold text-zinc-400 tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Help Center
              </span>
            </div>

            <h2
              className="text-5xl font-black leading-[1.05] tracking-tight text-white mb-5 text-balance"
              style={{ fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}
            >
              Frequently Asked Questions
            </h2>

            <p className="text-base text-zinc-400 leading-relaxed mb-10 text-pretty max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Everything you need to know about working on Quickhands. Can't find what you're looking for? Contact our
              support team.
            </p>

            {/* CTA */}
            <OnboardingModal>
              <Button
                size="lg"
                className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/40 transition-all duration-200 group"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </OnboardingModal>

            {/* Illustration card */}
            <div className="relative mt-14 max-w-xs">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm p-6">
                <Image
                  src="/illustrations/undraw_questions.svg"
                  alt="Frequently asked questions"
                  width={320}
                  height={260}
                  className="w-full h-auto opacity-90 drop-shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Right column — accordion */}
          <div>
            <Accordion type="single" collapsible className="space-y-2.5">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group border border-zinc-800 bg-zinc-900/60 rounded-xl px-6 
                    data-[state=open]:bg-zinc-900 data-[state=open]:border-emerald-600/40 
                    transition-all duration-200 hover:border-zinc-700"
                >
                  <AccordionTrigger
                    className="py-5 text-left text-[15px] font-semibold text-zinc-200 
                      hover:text-white hover:no-underline transition-colors duration-150"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-sm text-zinc-400 leading-relaxed pb-5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Bottom helper text */}
            <p className="mt-8 text-sm text-zinc-500 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Still have questions?{" "}
              <a href="mailto:support@quickhands.com" className="text-emerald-500 hover:text-emerald-400 transition-colors underline underline-offset-2">
                Contact our support team →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
