"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { ListPanel } from "@/components/app-shell/ListPanel"
import { MobileTopBar } from "@/components/app-shell/MobileTopBar"
import { PaneHeader } from "@/components/app-shell/PaneHeader"
import { SCROLL_THIN } from "@/components/app-shell/role-styles"
import { ShellDataProvider } from "@/components/app-shell/ShellData"
import { Sidebar } from "@/components/app-shell/Sidebar"

const DESKTOP_QUERY = "(min-width: 1024px)"
const LIST_STORAGE_KEY = "qh:list-panel-open"

function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(DESKTOP_QUERY)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  )
}

/**
 * Three-pane app shell for the authenticated area. Must render inside
 * OnboardingGate (it relies on AppRoleProvider).
 *
 * Height chain (so each column scrolls on its own and the window never does):
 *   root  h-dvh flex-col overflow-hidden
 *   └ frame  flex min-h-0 flex-1                (row from lg up)
 *     ├ sidebar   h-full, nav = min-h-0 flex-1 overflow-y-auto
 *     ├ list panel wrapper h-full → panel min-h-0 flex-1 overflow-y-auto
 *     └ pane  flex-col min-h-0 flex-1 → body min-h-0 flex-1 overflow-y-auto
 * Routes that want the full pane height use `h-full`; everything else just
 * flows and scrolls inside the pane body.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop()
  const [listOpen, setListOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  // Remember the collapsed state per viewer (convenience only — every access is guarded).
  useEffect(() => {
    try {
      if (window.localStorage.getItem(LIST_STORAGE_KEY) === "0") setListOpen(false)
    } catch {
      /* storage unavailable — default open */
    }
  }, [])

  const toggleList = useCallback(() => {
    setListOpen((current) => {
      const next = !current
      try {
        window.localStorage.setItem(LIST_STORAGE_KEY, next ? "1" : "0")
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return (
    <ShellDataProvider enabled={isDesktop}>
      <div className="flex h-dvh flex-col overflow-hidden bg-background lg:p-3">
        <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

        <div className="flex min-h-0 flex-1 lg:rounded-[28px] lg:border lg:border-border lg:bg-secondary lg:p-3">
          {/* Column 1 — sidebar (desktop) */}
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Sidebar">
            <Sidebar variant="desktop" listOpen={listOpen} onToggleList={toggleList} />
          </aside>

          {/* Column 2 — list panel (desktop, collapsible). Width animates; the
              panel inside keeps its fixed width so nothing reflows mid-collapse. */}
          <div
            id="app-list-panel"
            inert={!listOpen}
            className={`hidden shrink-0 overflow-hidden transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block ${
              listOpen ? "w-[272px]" : "w-0"
            }`}
          >
            <div className="h-full w-[272px] pl-3">
              <ListPanel />
            </div>
          </div>

          {/* Column 3 — main pane */}
          <section
            aria-label="Page content"
            className="flex min-h-0 min-w-0 flex-1 flex-col bg-card lg:ml-3 lg:rounded-[20px] lg:border lg:border-border"
          >
            <div className="hidden lg:block">
              <PaneHeader />
            </div>
            <div className={`min-h-0 flex-1 overflow-y-auto lg:rounded-b-[19px] ${SCROLL_THIN}`}>{children}</div>
          </section>
        </div>

        {/* Below lg: the sidebar's contents live in a left drawer. */}
        <Sheet open={menuOpen && !isDesktop} onOpenChange={setMenuOpen}>
          <SheetContent side="left" className="w-[300px] max-w-[85vw] gap-0 bg-secondary p-3 sm:max-w-[300px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigate QuickHands</SheetDescription>
            <Sidebar variant="drawer" onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </ShellDataProvider>
  )
}
