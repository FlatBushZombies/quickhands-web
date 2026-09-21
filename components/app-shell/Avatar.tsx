"use client"

/* Squircle avatar with the same initials fallback + hashed accents that
   ConversationList already used (role-neutral: one green tint, one violet,
   one amber). Decorative — the person's name always sits next to it. */

const SIZES = {
  sm: "h-6 w-6 rounded-[8px] text-[10px]",
  md: "h-10 w-10 rounded-[12px] text-[13px]",
  lg: "h-12 w-12 rounded-[14px] text-[15px]",
} as const

const ACCENTS = ["bg-primary/10 text-foreground", "bg-[#F5E9FF] text-[#7C3AED]", "bg-[#FFF3DC] text-[#B45309]"]

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getAccent(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return ACCENTS[hash % ACCENTS.length]
}

export function Avatar({
  name,
  imageUrl,
  size = "md",
  className = "",
}: {
  name: string
  imageUrl?: string | null
  size?: keyof typeof SIZES
  className?: string
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" className={`shrink-0 object-cover ${SIZES[size]} ${className}`} />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center font-bold ${SIZES[size]} ${getAccent(name)} ${className}`}
    >
      {getInitials(name)}
    </div>
  )
}
