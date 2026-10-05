import { CheckCircle2 } from "lucide-react"
import { BIO_ACCENT, BIO_ACCENT_TINT } from "@/components/bio/BioDesign"

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "Q"
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

/**
 * Avatar on a faint accent halo, with a hairline ring and a solid verified
 * badge. Sizes are passed in so the settings preview can render it smaller.
 */
export function BioAvatar({
  name,
  imageUrl,
  isVerified,
  size = 132,
}: {
  name: string
  imageUrl: string | null
  isVerified: boolean
  size?: number
}) {
  const inner = Math.round(size * 0.85)
  const ring = "0 0 0 4px var(--paper),0 0 0 5px rgba(10,10,11,.12)"

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: size,
        height: size,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: BIO_ACCENT_TINT,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          style={{ width: inner, height: inner, borderRadius: "50%", objectFit: "cover", boxShadow: ring }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            width: inner,
            height: inner,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: BIO_ACCENT,
            color: "#FFFFFF",
            fontFamily: "var(--font-sans)",
            fontSize: Math.round(size * 0.24),
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            boxShadow: ring,
          }}
        >
          {initialsOf(name)}
        </div>
      )}
      {isVerified ? (
        <div
          style={{
            position: "absolute",
            right: 2,
            bottom: 2,
            display: "flex",
            width: Math.round(size * 0.23),
            height: Math.round(size * 0.23),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: BIO_ACCENT,
            boxShadow: "0 0 0 3px var(--paper)",
          }}
        >
          <CheckCircle2 style={{ width: "52%", height: "52%", color: "#FFFFFF" }} strokeWidth={2.25} />
        </div>
      ) : null}
    </div>
  )
}
