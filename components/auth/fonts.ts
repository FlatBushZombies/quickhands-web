import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"

export const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
export const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument-serif",
})

export const authFontClassName = `${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`
