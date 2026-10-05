/**
 * The design's profession taxonomy. Skills are stored as a comma-separated
 * string in users.skills, so a category is never stored: it is derived from
 * the saved skills when the page loads.
 */
export interface ProfessionCategory {
  id: string
  label: string
  icon: string
  role: string
  subs: string[]
}

export const CATEGORIES: ProfessionCategory[] = [
  { id: "repairs", label: "Home & repairs", icon: "wrench", role: "Handyman & repairs", subs: ["Plumbing", "Electrical", "Handyman", "Furniture assembly", "Installations", "Painting"] },
  { id: "cleaning", label: "Cleaning", icon: "sparkles", role: "Cleaning specialist", subs: ["Home clean", "Deep clean", "Office clean", "Move-out clean", "Laundry"] },
  { id: "moving", label: "Moving & delivery", icon: "truck", role: "Moving & delivery", subs: ["Moving help", "Pickup & drop-off", "Deliveries", "Errands", "Heavy lifting"] },
  { id: "beauty", label: "Beauty", icon: "scissors", role: "Beauty professional", subs: ["Hair", "Nails", "Makeup", "Barber"] },
  { id: "garden", label: "Garden & outdoor", icon: "trees", role: "Garden & outdoor", subs: ["Lawn mowing", "Gardening", "Tree trimming", "Pool cleaning"] },
  { id: "other", label: "Tutoring & other", icon: "graduation-cap", role: "Tutor & assistant", subs: ["Tutoring", "Admin help", "Tech support"] },
]

/**
 * Skills written by the existing onboarding flow that the design's sub-skill
 * lists don't contain. They are mapped to a category so they are not lost.
 */
const LEGACY_SKILL_CATEGORY: Record<string, string> = {
  Carpentry: "repairs",
  Cleaning: "cleaning",
  Moving: "moving",
  Other: "other",
}

export function parseSkills(raw: string | null | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function categoryForSkill(skill: string): string | null {
  const hit = CATEGORIES.find((c) => c.subs.includes(skill))
  if (hit) return hit.id
  return LEGACY_SKILL_CATEGORY[skill] ?? null
}

/** The category that the largest number of saved skills belong to. */
export function deriveCategory(skills: string[]): ProfessionCategory | null {
  const counts = new Map<string, number>()
  for (const skill of skills) {
    const id = categoryForSkill(skill)
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  let best: string | null = null
  let bestCount = 0
  counts.forEach((count, id) => {
    if (count > bestCount) {
      best = id
      bestCount = count
    }
  })
  return CATEGORIES.find((c) => c.id === best) ?? null
}

export const YEAR_OPTIONS = [
  { value: "<1", label: "< 1 yr", long: "Less than a year", stored: "Less than 1 year" },
  { value: "1-3", label: "1–3", long: "1–3 years", stored: "1–3 years" },
  { value: "3-5", label: "3–5", long: "3–5 years", stored: "3–5 years" },
  { value: "5+", label: "5+", long: "5+ years", stored: "5+ years" },
] as const

export type YearValue = (typeof YEAR_OPTIONS)[number]["value"]

/**
 * Maps the stored experience text to a design bucket. Accepts the design's
 * own labels and the onboarding flow's "Beginner / Intermediate / Expert".
 */
export function yearsFromStored(raw: string | null | undefined): YearValue {
  const text = (raw ?? "").toLowerCase()
  const exact = YEAR_OPTIONS.find((o) => o.stored.toLowerCase() === text || o.long.toLowerCase() === text)
  if (exact) return exact.value
  if (text.startsWith("beginner")) return "<1"
  if (text.startsWith("intermediate")) return "3-5"
  if (text.startsWith("expert")) return "5+"
  return "1-3"
}

export function yearsLabel(value: YearValue) {
  return YEAR_OPTIONS.find((o) => o.value === value)?.stored ?? "1–3 years"
}

/** Strips the legacy skills a category switch should keep. */
export function skillsForCategory(skills: string[], categoryId: string) {
  return skills.filter((s) => categoryForSkill(s) === categoryId)
}

export function initials(name: string | null | undefined) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function shortName(name: string | null | undefined) {
  const parts = (name || "").split(" ").filter(Boolean)
  return (parts[0] || "") + (parts[1] ? " " + parts[1][0] + "." : "")
}

export function firstName(name: string | null | undefined) {
  return (name || "").split(" ")[0] || ""
}

export function formatRange(start: string | null, end: string | null) {
  const fmt = (iso: string | null) => {
    if (!iso) return null
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { day: "numeric", month: "short" })
  }
  return [fmt(start), fmt(end)].filter(Boolean).join(" – ") || "Dates to agree"
}
