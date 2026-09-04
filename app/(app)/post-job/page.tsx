"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@clerk/nextjs"
import { CheckCircle2, Loader2, Locate, MapPin } from "lucide-react"
import { RoleGate } from "@/components/app/RoleGate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AttachmentPicker } from "@/components/jobs/AttachmentPicker"
import { createJob, type CreateJobResult } from "@/lib/jobs-api"
import { detectLocation } from "@/lib/geocoding"

const QUICK_SERVICES = ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting", "Moving"]
const SPECIALIST_OPTIONS = ["Any Specialist", "Top Rated", "Most Affordable"]

type Screen = "form" | "submitting" | "success"

export default function PostJobPage() {
  return (
    <RoleGate allow="client">
      <PostJobForm />
    </RoleGate>
  )
}

function PostJobForm() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()

  const [screen, setScreen] = useState<Screen>("form")
  const [result, setResult] = useState<CreateJobResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSlowHint, setShowSlowHint] = useState(false)

  const [serviceType, setServiceType] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [specialistChoice, setSpecialistChoice] = useState(SPECIALIST_OPTIONS[0])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [documents, setDocuments] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const [locating, setLocating] = useState(false)
  const [location, setLocation] = useState<{ label: string | null; city: string | null; latitude: number | null; longitude: number | null }>({
    label: null,
    city: null,
    latitude: null,
    longitude: null,
  })
  const [manualCity, setManualCity] = useState("")

  useEffect(() => {
    if (screen !== "submitting") {
      setShowSlowHint(false)
      return
    }
    const timer = setTimeout(() => setShowSlowHint(true), 4000)
    return () => clearTimeout(timer)
  }, [screen])

  const toggleService = (service: string) => {
    setSelectedServices((current) =>
      current.includes(service) ? current.filter((s) => s !== service) : [...current, service]
    )
  }

  const handleDetectLocation = async () => {
    setLocating(true)
    try {
      const detected = await detectLocation()
      setLocation(detected)
    } catch (detectError) {
      console.error("Location detection failed:", detectError)
    } finally {
      setLocating(false)
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const svcType = serviceType.trim() || selectedServices[0] || ""
  const isValid =
    svcType.length > 0 &&
    startDate.length > 0 &&
    endDate.length > 0 &&
    maxPrice.trim().length > 0 &&
    !isNaN(parseFloat(maxPrice)) &&
    endDate >= startDate

  const handleSubmit = async () => {
    if (!isValid || !user) return
    setScreen("submitting")
    setError(null)

    try {
      const token = await getToken()
      if (!token) throw new Error("Could not verify your session. Please try again.")

      const response = await createJob(
        {
          serviceType: svcType,
          selectedServices: selectedServices.length > 0 ? selectedServices : [svcType],
          startDate,
          endDate,
          maxPrice: Number(maxPrice),
          specialistChoice,
          additionalInfo,
          documents,
          clerkId: user.id,
          userName: user.fullName || "Anonymous",
          userAvatar: user.imageUrl || null,
          location: {
            label: location.label,
            city: location.city || manualCity.trim() || null,
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
        token
      )

      setResult(response)
      setScreen("success")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.")
      setScreen("form")
    }
  }

  const resetForm = () => {
    setServiceType("")
    setSelectedServices([])
    setStartDate("")
    setEndDate("")
    setMaxPrice("")
    setSpecialistChoice(SPECIALIST_OPTIONS[0])
    setAdditionalInfo("")
    setDocuments([])
    setResult(null)
    setScreen("form")
  }

  if (screen === "success" && result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="font-heading mt-4 text-2xl font-bold text-foreground">Job posted</h1>
        <p className="mt-2 text-muted-foreground">
          {result.matchingSummary.nearbyFreelancerCount > 0
            ? `${result.matchingSummary.nearbyFreelancerCount} nearby specialists have been notified.`
            : "We'll notify matching specialists as they become available."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={resetForm}>
            Post another
          </Button>
          <Button onClick={() => router.push("/dashboard")}>Go to dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Post a job</h1>
      <p className="mt-1 text-sm text-muted-foreground">Tell specialists what you need done.</p>

      <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <Label htmlFor="serviceType" className="text-sm font-semibold text-foreground">
            What do you need done?
          </Label>
          <Input
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="e.g. Fix a leaking pipe"
            className="mt-2"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_SERVICES.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedServices.includes(service)
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-sm font-semibold text-foreground">
              Start date
            </Label>
            <Input id="startDate" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-sm font-semibold text-foreground">
              End date
            </Label>
            <Input id="endDate" type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-2" />
          </div>
        </div>

        <div>
          <Label htmlFor="maxPrice" className="text-sm font-semibold text-foreground">
            Budget (US$)
          </Label>
          <Input
            id="maxPrice"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 100"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground">Specialist preference</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SPECIALIST_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSpecialistChoice(option)}
                className={`rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition-colors ${
                  specialistChoice === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="additionalInfo" className="text-sm font-semibold text-foreground">
            Additional details
          </Label>
          <Textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Anything specialists should know before applying"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground">Attachments</Label>
          <div className="mt-2">
            <AttachmentPicker documents={documents} onChange={setDocuments} onUploadingChange={setUploading} />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground">Location</Label>
          <div className="mt-2 flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleDetectLocation} disabled={locating}>
              {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Locate className="h-3.5 w-3.5" />}
              Detect my location
            </Button>
            {location.latitude !== null ? (
              <span className="flex items-center gap-1 text-xs text-primary">
                <MapPin className="h-3.5 w-3.5" />
                {location.label || location.city || "Location detected"}
              </span>
            ) : null}
          </div>
          {location.latitude !== null && !location.city ? (
            <Input
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="City / area name"
              className="mt-2"
            />
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {showSlowHint ? (
          <p className="text-xs text-muted-foreground">Waking up the server — this can take up to a minute on the first request…</p>
        ) : null}

        <Button className="w-full" onClick={handleSubmit} disabled={!isValid || uploading || screen === "submitting"}>
          {screen === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post job"}
        </Button>
      </div>
    </div>
  )
}
