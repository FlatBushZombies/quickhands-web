import type { AppRole } from "@/lib/user-api"

/**
 * Thin, palette-matched scrollbars for the shell's independently scrolling
 * columns (standard properties — Chromium 121+, Firefox, Safari 18.2+).
 */
export const SCROLL_THIN = "[scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]"

/**
 * Role colour split for the whole shell. Clients wear the brand green,
 * specialists wear the specialist blue — same split AppHeader used. Class
 * strings are written out in full so Tailwind can see them.
 *
 * "activeItem" is the raised selected-row surface: the role tint mixed into
 * the card colour (so it reads lighter than the neutral frame around it),
 * a hairline in the role tint and a soft shadow.
 */
export interface RoleStyles {
  /** Text/icon in the role colour. */
  text: string
  /** Soft tinted tile (icon tiles, avatars of "you"). */
  tile: string
  /** Raised selected row. */
  activeItem: string
  /** Solid primary action button. */
  solid: string
  /** Tab underline / bar fill. */
  bar: string
  /** Themed keyboard focus ring. */
  focus: string
}

const CLIENT: RoleStyles = {
  text: "text-primary",
  tile: "bg-primary/10 text-primary",
  activeItem: "border-primary/25 bg-[color-mix(in_oklab,var(--primary)_9%,var(--card))] shadow-sm",
  solid: "bg-primary text-primary-foreground hover:bg-primary-hover",
  bar: "border-primary",
  focus: "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0",
}

const SPECIALIST: RoleStyles = {
  text: "text-specialist",
  tile: "bg-specialist/10 text-specialist",
  activeItem: "border-specialist/25 bg-[color-mix(in_oklab,var(--specialist)_9%,var(--card))] shadow-sm",
  solid: "bg-specialist text-specialist-foreground hover:bg-specialist-hover",
  bar: "border-specialist",
  focus: "focus-visible:ring-2 focus-visible:ring-specialist/60 focus-visible:ring-offset-0",
}

export function getRoleStyles(role: AppRole): RoleStyles {
  return role === "client" ? CLIENT : SPECIALIST
}
