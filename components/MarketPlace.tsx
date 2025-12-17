"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const categories = [
  {
    title: "Tutors & Education",
    count: 243_817,
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
    count: 198_462,
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
    count: 112_905,
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
    count: 164_733,
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
    count: 58_214,
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
    count: 41_689,
    items: [
      "Personal trainers",
      "Fitness instructors",
      "Yoga instructors",
      "Pilates instructors",
      "Stretching & mobility coaches",
      "Dance instructors",
      "Sports coaches (football, athletics, etc.)",
    ],
    services: 742,
  },
  {
    title: "Arts & Entertainment",
    count: 53_407,
    items: [
      "Musicians",
      "DJs",
      "MCs / Event hosts",
      "Dancers",
      "Photographers",
      "Videographers",
      "Makeup artists for events",
      "Event entertainers (clowns, performers)",
    ],
    services: 1183,
  },
  {
    title: "Domestic & Household Staff",
    count: 69_528,
    items: [
      "Housekeepers",
      "Cleaners",
      "Nannies",
      "Babysitters",
      "Caregivers",
      "Gardeners",
      "Drivers",
      "Pet sitters / dog walkers",
    ],
    services: 624,
  },
  {
    title: "Driving & Transport",
    count: 31_964,
    items: [
      "Driving instructors (manual & automatic)",
      "Motorcycle riding instructors",
      "Defensive driving instructors",
      "Delivery drivers",
      "Couriers",
      "Passenger transport services",
      "Moving & logistics services",
    ],
    services: 512,
  },
  {
    title: "Animal & Pet Services",
    count: 18_372,
    items: [
      "Veterinarians",
      "Veterinary assistants",
      "Pet grooming",
      "Dog trainers",
      "Animal boarding",
      "Livestock care (region-specific)",
    ],
    services: 341,
  },
  {
    title: "Other Popular Services",
    count: 92_146,
    items: [
      "Mobile money agents",
      "Phone repair technicians",
      "Solar panel installers",
      "CCTV & security installers",
      "Internet & satellite installers",
      "Tailors & fashion designers",
      "Shoe repair",
      "Welding & metalwork",
    ],
    services: 1107,
  },
]


export default function Marketplace() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-4xl font-bold tracking-tight text-foreground">Trusted specialists near you</h2>
          <p className="font-sans mt-4 text-muted-foreground leading-relaxed">
            Choose from <span className="text-primary font-semibold">200,000+ local specialists </span>or
            <span className="text-primary font-semibold"> 2,600+ remote professionals </span>, all ready to help when
            you need them.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border bg-card">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div>
                    <h3 className="font-sans text-lg font-semibold text-foreground">{cat.title}</h3>
                    <p className="font-mono text-sm tabular-nums text-primary">
                      {cat.count.toLocaleString()} specialists
                    </p>
                  </div>

                  <ul className="font-sans space-y-1 text-sm text-muted-foreground leading-relaxed">
                    {cat.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 font-sans text-sm text-primary font-medium">
                    All {cat.services} services →
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* App Banner */}
        <div className="relative mt-24 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid gap-8 p-10 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="font-sans text-3xl font-bold text-foreground">
                The Quickhands app is launching in January
              </h3>
              <p className="font-sans mt-3 max-w-md text-muted-foreground leading-relaxed">
                Be the first to get access by joining
                <span className="text-primary font-medium"> Waitlist </span>
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button className="font-sans bg-primary text-primary-foreground hover:opacity-90 font-medium">
                  App Store
                </Button>
                <Button variant="outline" className="font-sans border-primary text-primary font-medium bg-transparent">
                  Google Play
                </Button>
                <Button variant="outline" className="font-sans border-primary text-primary font-medium bg-transparent">
                  Huawei AppGallery
                </Button>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="rounded-xl border border-border bg-background p-4">
                <Image src="/qr-placeholder.png" alt="Download QR code" width={140} height={140} />
                <p className="font-sans mt-3 text-center text-xs text-muted-foreground">Scan to download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
