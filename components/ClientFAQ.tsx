"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ClientLogin } from "./ClientLogin"
import { Em } from "./quickhands/Em"

const faqs = [
  {
    question: "Do I have to pay to use your platform?",
    answer:
      "No, our platform is completely free for clients. We connect you with the right specialists for your task, and you only pay the specialist after the job has been completed and you’re satisfied with the results.",
  },
  {
    question: "Is there any risk of losing my money?",
    answer:
      "No. To protect you from scams or dishonest behavior, all payments are made securely through our app.",
  },
  {
    question: "Why is paying through your app safe?",
    answer:
      "Paying through our app guarantees that the job is completed to a high standard. If the specialist’s work doesn’t meet your expectations, your money is protected because it’s held securely on our platform until you approve the completed task.",
  },
  {
    question: "Why should I use your platform instead of finding someone on my own?",
    answer:
      "Our platform helps you save time and money while ensuring high-quality services and peace of mind. You can choose from a wide range of verified specialists.",
  },
]

export function ClientFAQ() {
  return (
    <section className="py-32 w-full bg-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Section Header — sticky rail on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 text-center lg:text-left space-y-4">
            <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-zinc-950 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-sm text-zinc-500 font-light max-w-md mx-auto lg:mx-0 leading-relaxed">
              Everything you need to know about secure client-specialist cooperation on Quickhands.
            </p>
          </div>

          {/* Premium Ceramic FAQ Accordions */}
          <Accordion type="single" collapsible className="lg:col-span-7 space-y-4 font-sans">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={[
                  "rounded-[24px]",
                  "bg-white text-zinc-900",
                  "border border-zinc-200",
                  "shadow-sm",
                  "data-[state=open]:border-primary/30 data-[state=open]:shadow-md data-[state=open]:bg-[var(--primary-light)]",
                  "hover:border-zinc-300 hover:shadow-md",
                  "transition-all duration-300",
                  "overflow-hidden px-6 py-1",
                ].join(" ")}
              >
                <AccordionTrigger
                  className={[
                    "py-5",
                    "text-left font-sans text-[14.5px] font-semibold text-zinc-900 hover:text-primary",
                    "hover:no-underline transition-colors duration-150",
                    "border-0 focus:outline-none",
                  ].join(" ")}
                >
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="pt-1 pb-5 border-t border-zinc-200">
                  <p className="font-sans text-[12.5px] text-zinc-500 leading-relaxed font-light mt-3">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Closing CTA band — bookends the page with the same promise and CTA the Hero opened with */}
        <div className="mt-28 rounded-[32px] border border-zinc-200 bg-[var(--primary-light)] shadow-sm px-8 py-14 md:px-16 md:py-16 text-center flex flex-col items-center gap-7">
          <h3 className="font-serif text-3xl md:text-[48px] tracking-[-0.02em] leading-[1.08] text-zinc-950 font-bold max-w-2xl">
            Quickly find the right <Em className="font-bold">specialists</Em> for your tasks.
          </h3>
          <ClientLogin>
            <button
              type="button"
              className="h-12 px-8 font-sans text-xs font-semibold rounded-full bg-primary text-white hover:bg-primary-hover active:scale-[0.97] transition-all duration-200 shadow-[0_4px_14px_rgba(38,192,141,0.25)] hover:shadow-[0_6px_20px_rgba(38,192,141,0.35)] cursor-pointer"
            >
              Get Started
            </button>
          </ClientLogin>
        </div>
      </div>
    </section>
  )
}
