export interface ParsedCard {
  kind: string
  label: string
  note: string | null
}

// Direct port of freelance-app/lib/messageCards.ts — plain JS with no RN
// dependency, no changes needed. The backend builds the QH_CARD:: wrapper
// server-side (src/utils/communicationCards.js); the client only ever
// parses it, never constructs it — sending uses {tag, label, note}.
export function parseCard(text: string): ParsedCard | null {
  const normalized = String(text || "").trim()
  if (!normalized.startsWith("QH_CARD::")) return null
  try {
    const parsed = JSON.parse(normalized.slice("QH_CARD::".length))
    if (!parsed?.label) return null
    return {
      kind: String(parsed.kind || "update"),
      label: String(parsed.label),
      note: parsed.note ? String(parsed.note) : null,
    }
  } catch {
    return null
  }
}
