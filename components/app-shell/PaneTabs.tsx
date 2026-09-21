"use client"

import { useRef } from "react"
import type { LucideIcon } from "lucide-react"
import { useAppRole } from "@/components/app/AppRoleContext"
import { SCROLL_THIN, getRoleStyles } from "@/components/app-shell/role-styles"

export interface PaneTab {
  id: string
  label: string
  icon: LucideIcon
}

export function tabId(prefix: string, id: string) {
  return `${prefix}-tab-${id}`
}

export function panelId(prefix: string, id: string) {
  return `${prefix}-panel-${id}`
}

/**
 * Tab bar with proper tablist semantics: roving tabindex, arrow / Home / End
 * keys (automatic activation), 2px underline the width of the active tab in
 * the viewer's role colour. Pair each panel with `panelId`/`tabId`.
 */
export function PaneTabs({
  tabs,
  value,
  onChange,
  idPrefix,
  label,
}: {
  tabs: PaneTab[]
  value: string
  onChange: (id: string) => void
  idPrefix: string
  label: string
}) {
  const { appRole } = useAppRole()
  const role = getRoleStyles(appRole)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const move = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      move(index + 1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      move(index - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      move(0)
    } else if (event.key === "End") {
      event.preventDefault()
      move(tabs.length - 1)
    }
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex shrink-0 items-end gap-1 overflow-x-auto border-b border-border px-4 sm:px-6 ${SCROLL_THIN}`}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === value
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node
            }}
            type="button"
            role="tab"
            id={tabId(idPrefix, tab.id)}
            aria-selected={selected}
            aria-controls={panelId(idPrefix, tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`-mb-px flex h-11 shrink-0 items-center gap-2 rounded-t-[8px] border-b-2 px-3 text-sm outline-none transition-colors motion-reduce:transition-none ${role.focus} focus-visible:ring-inset ${
              selected
                ? `${role.bar} font-medium text-foreground`
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`h-4 w-4 ${selected ? role.text : ""}`} strokeWidth={1.75} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
