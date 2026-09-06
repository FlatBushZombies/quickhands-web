"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type PillButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark"
type PillButtonSize = "sm" | "md" | "lg"

interface SharedProps {
  children: ReactNode
  variant?: PillButtonVariant
  size?: PillButtonSize
  className?: string
  /** Show the trailing arrow that nudges forward on hover. Defaults to true for "primary". */
  showArrow?: boolean
  icon?: ReactNode
}

interface PillButtonAsButton extends SharedProps {
  href?: undefined
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  "aria-label"?: string
  "aria-expanded"?: boolean
  "aria-haspopup"?: boolean
  id?: string
}

interface PillButtonAsLink extends SharedProps {
  href: string
}

type PillButtonProps = PillButtonAsButton | PillButtonAsLink

const sizeClasses: Record<PillButtonSize, string> = {
  sm: "h-9 px-4 text-[11px] gap-1.5",
  md: "h-11 px-6 text-xs gap-2",
  lg: "h-12 px-7 text-[13px] gap-2",
}

const variantClasses: Record<PillButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_4px_14px_rgba(20,168,0,0.25)] hover:bg-primary-hover hover:shadow-[0_6px_20px_rgba(20,168,0,0.35)]",
  secondary:
    "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800",
  outline:
    "bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
  ghost:
    "bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
  dark:
    "bg-white/10 text-white border border-white/15 backdrop-blur-sm hover:bg-white/15",
}

const baseClasses =
  "group relative inline-flex items-center justify-center rounded-full font-sans font-semibold whitespace-nowrap select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

export function PillButton(props: PillButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    showArrow = variant === "primary",
    icon,
  } = props

  const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], className)

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {showArrow && (
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </>
  )

  if ("href" in props && props.href) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="inline-block"
      >
        <Link href={props.href} className={classes}>
          {content}
        </Link>
      </motion.div>
    )
  }

  const {
    children: _children,
    variant: _variant,
    size: _size,
    className: _className,
    showArrow: _showArrow,
    icon: _icon,
    href: _href,
    ...buttonProps
  } = props as PillButtonAsButton
  void _children
  void _variant
  void _size
  void _className
  void _showArrow
  void _icon
  void _href

  return (
    <motion.button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      aria-label={buttonProps["aria-label"]}
      aria-expanded={buttonProps["aria-expanded"]}
      aria-haspopup={buttonProps["aria-haspopup"]}
      id={buttonProps.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={classes}
    >
      {content}
    </motion.button>
  )
}
