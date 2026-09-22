import { CheckCircle2 } from "lucide-react"

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "Q"
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

/**
 * Avatar sitting on its own soft pastel-tinted circle backdrop — the
 * reference's signature identity treatment. Same green token as the rest
 * of the page, just a low-opacity halo behind the photo/initials instead
 * of a hard-edged avatar sitting directly on the gradient wash.
 */
export function BioAvatar({
  name,
  imageUrl,
  isVerified,
}: {
  name: string
  imageUrl: string | null
  isVerified: boolean
}) {
  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-primary/8">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-[0_8px_30px_-8px_rgba(20,168,0,0.35)]"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/70 text-3xl font-bold text-primary-foreground shadow-[0_8px_30px_-8px_rgba(20,168,0,0.35)]">
          {initialsOf(name)}
        </div>
      )}
      {isVerified ? (
        <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary">
          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
        </div>
      ) : null}
    </div>
  )
}
