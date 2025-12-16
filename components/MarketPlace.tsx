"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const categories = [
  {
    title: "Tutors",
    count: 221_434,
    items: ["English language", "Mathematics", "Russian language", "Primary school", "Music"],
    services: 1900,
  },
  {
    title: "Repairmen",
    count: 185_281,
    items: ["Plumbers", "Electricians", "Tilers", "Plasterers", "Turnkey repairs"],
    services: 1992,
  },
  {
    title: "Beauty masters",
    count: 76_458,
    items: ["Makeup", "Manicure", "Hairstyles", "Epilation", "Stylists"],
    services: 1988,
  },
  {
    title: "Freelancers",
    count: 116_336,
    items: ["Designers", "Working with texts", "Marketing", "System administrators", "IT outsourcing"],
    services: 1083,
  },
  {
    title: "Accountants and lawyers",
    count: 46_390,
    items: ["Lawyers", "Accountants", "Realtors", "Business consultants", "Business coaches"],
    services: 1028,
  },
  {
    title: "Sports trainers",
    count: 25_397,
    items: ["Fitness", "Yoga", "Pilates", "Stretching", "Aerobics"],
    services: 730,
  },
  {
    title: "Artists",
    count: 36_772,
    items: ["Musicians", "Dancers", "Leading", "Magicians", "Clowns"],
    services: 1079,
  },
  {
    title: "Domestic staff",
    count: 44_504,
    items: ["Housekeepers", "Drivers", "Dog walking", "Nurses", "Housekeeper"],
    services: 390,
  },
  {
    title: "Veterinarians",
    count: 6_386,
    items: ["Animal boarding", "Pet grooming", "Veterinary care", "Pet sitting", "Dog training"],
    services: 284,
  },
  {
    title: "Driving instructors",
    count: 2_542,
    items: [
      "Driving (manual transmission)",
      "Driving (automatic)",
      "Motorcycle lessons",
      "Theory classes",
      "Exam preparation",
    ],
    services: 156,
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
