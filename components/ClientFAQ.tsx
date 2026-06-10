"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
        <div className="mx-auto max-w-3xl">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-zinc-950 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-sm text-zinc-500 font-light max-w-md mx-auto leading-relaxed">
              Everything you need to know about secure client-specialist cooperation on Quickhands.
            </p>
          </div>

          {/* Premium Ceramic FAQ Accordions */}
          <Accordion type="single" collapsible className="space-y-4 font-sans">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={[
                  "rounded-[24px]",
                  "bg-white text-zinc-900",
                  "border border-zinc-100",
                  "shadow-sm/50",
                  "hover:shadow-sm hover:border-zinc-200",
                  "transition-all duration-300",
                  "overflow-hidden px-6 py-1",
                ].join(" ")}
              >
                <AccordionTrigger
                  className={[
                    "py-5",
                    "text-left font-sans text-[14.5px] font-semibold text-zinc-900",
                    "hover:no-underline",
                    "border-0 focus:outline-none",
                  ].join(" ")}
                >
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="pt-1 pb-5 border-t border-zinc-50">
                  <p className="font-sans text-[12.5px] text-zinc-500 leading-relaxed font-light mt-3">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
