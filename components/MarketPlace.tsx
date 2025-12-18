"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  {
    title: "Tutors & Education",
    illustration: "/illustrations/Teacher.svg",
    count: 0,
    items: [
      "English tutoring",
      "Mathematics",
      "Science (Physics, Chemistry, Biology)",
      "Primary school tutoring",
      "High school exam preparation",
      "University tutoring",
      "Computer literacy",
      "Music lessons",
      "Language tutoring (local & international)",
    ],
    services: 2146,
  },
  {
    title: "Home & Repair Services",
    illustration: "/illustrations/Electrician.svg",
    count: 0,
    items: [
      "Plumbers",
      "Electricians",
      "Painters",
      "Tilers",
      "Builders / Bricklayers",
      "Handymen",
      "Roofing specialists",
      "Appliance repair",
      "Renovations (turnkey)",
    ],
    services: 2312,
  },
  {
    title: "Beauty & Personal Care",
    illustration: "/illustrations/Beauty.svg",
    count: 0,
    items: [
      "Makeup artists",
      "Hair stylists / Braiders",
      "Barbers",
      "Nail technicians",
      "Lash & brow technicians",
      "Massage therapists",
      "Waxing & hair removal",
      "Personal stylists",
    ],
    services: 1874,
  },
  {
    title: "Freelancers & Digital Services",
    illustration: "/illustrations/Freelancer.svg",
    count: 0,
    items: [
      "Graphic designers",
      "Web designers & developers",
      "Social media managers",
      "Digital marketers",
      "Content writers",
      "Translators",
      "Virtual assistants",
      "IT support & outsourcing",
      "Data entry specialists",
    ],
    services: 1439,
  },
  {
    title: "Business & Legal Services",
    illustration: "/illustrations/Lawyer.svg",
    count: 0,
    items: [
      "Accountants",
      "Bookkeepers",
      "Tax consultants",
      "Lawyers",
      "Company registration services",
      "Business consultants",
      "HR consultants",
      "Real estate agents",
    ],
    services: 986,
  },
  {
    title: "Sports & Wellness",
    illustration: "/illustrations/Coach.svg",
    count: 0,
    items: [
      "Personal trainers",
      "Fitness instructors",
      "Yoga instructors",
      "Pilates instructors",
      "Stretching & mobility coaches",
      "Dance instructors",
      "Sports coaches",
    ],
    services: 742,
  },
  {
    title: "Arts & Entertainment",
    illustration: "/illustrations/Videographer.svg",
    count: 0,
    items: [
      "Musicians",
      "DJs",
      "MCs / Event hosts",
      "Dancers",
      "Photographers",
      "Videographers",
      "Makeup artists for events",
      "Event entertainers",
    ],
    services: 1183,
  },
  {
    title: "Domestic & Household Staff",
    illustration: "/illustrations/Gardening.svg",
    count: 0,
    items: [
      "Housekeepers",
      "Cleaners",
      "Nannies",
      "Babysitters",
      "Caregivers",
      "Gardeners",
      "Drivers",
      "Pet sitters",
    ],
    services: 624,
  },
  {
    title: "Driving & Transport",
    illustration: "/illustrations/Driver.svg",
    count: 0,
    items: [
      "Driving instructors",
      "Motorcycle instructors",
      "Defensive driving",
      "Delivery drivers",
      "Couriers",
      "Passenger transport",
      "Moving & logistics",
    ],
    services: 512,
  },
  {
    title: "Animal & Pet Services",
    illustration: "/illustrations/Veterinary.svg",
    count: 0,
    items: [
      "Veterinarians",
      "Veterinary assistants",
      "Pet grooming",
      "Dog trainers",
      "Animal boarding",
      "Livestock care",
    ],
    services: 341,
  },
  {
    title: "Other Popular Services",
    illustration: "/illustrations/Installation.svg",
    count: 0,
    items: [
      "Mobile money agents",
      "Phone repair technicians",
      "Solar panel installers",
      "CCTV & security installers",
      "Internet & satellite installers",
      "Tailors & designers",
      "Welding & metalwork",
    ],
    services: 1107,
  },
]

export default function Marketplace() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Trusted specialists near you
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose from{" "}
            <span className="font-semibold text-primary">
              0 local specialists
            </span>{" "}
            or{" "}
            <span className="font-semibold text-primary">
              0 remote professionals
            </span>
            , all ready to help when you need them.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="group relative h-full overflow-hidden border-border bg-card transition hover:shadow-xl">
                {/* Illustration */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="relative h-44 w-44 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={cat.illustration}
                      alt={`${cat.title} illustration`}
                      fill
                      className="object-contain"
                      priority={i < 3}
                    />
                  </div>
                </div>

                {/* Content */}
                <CardContent className="relative z-10 flex h-full flex-col gap-4 p-6 pr-40">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <p className="text-sm font-mono text-primary">
                      {cat.count.toLocaleString()} specialists
                    </p>
                  </div>

                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {cat.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 text-sm font-medium text-primary">
                    All {cat.services.toLocaleString()} services →
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* App Banner */}
        <div className="mt-24 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid gap-8 p-10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground">
                The Quickhands app is launching in January
              </h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                Be the first to get access by joining
                <span className="font-medium text-primary"> the waitlist</span>.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button className="bg-primary text-primary-foreground">
                  App Store
                </Button>
                <Button variant="outline" className="border-primary text-primary">
                  Google Play
                </Button>
                <Button variant="outline" className="border-primary text-primary">
                  Huawei AppGallery
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-xl border border-border bg-background p-4">
                <Image
                  src="/qr-placeholder.png"
                  alt="Download QR code"
                  width={140}
                  height={140}
                />
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Scan to download
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
