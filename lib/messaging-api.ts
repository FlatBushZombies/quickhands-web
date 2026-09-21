import { fetchWithRetry, getApiUrl, parseJsonSafely } from "@/lib/fetch-client"
import type { ServerMessage } from "@/hooks/useMessagingSocket"

export interface ConversationParticipant {
  clerkId: string
  displayName: string
}

export interface Conversation {
  conversationId: string
  conversationType: "direct" | "job_application"
  jobId: number | null
  jobTitle: string | null
  participants: ConversationParticipant[]
  otherUser: { clerkId: string; displayName: string; imageUrl: string | null }
  lastMessageText: string | null
  lastMessageAt: string | null
  createdAt: string
  updatedAt: string
  unreadCount: number
}

export async function getConversations(token: string): Promise<Conversation[]> {
  const response = await fetchWithRetry(getApiUrl("/api/messaging/conversations"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafely(response)
  return response.ok && data?.success ? (data.conversations as Conversation[]) : []
}

export async function getConversationMessages(
  conversationId: string,
  token: string
): Promise<{ conversation: Conversation | null; messages: ServerMessage[] }> {
  const response = await fetchWithRetry(
    getApiUrl(`/api/messaging/conversations/${encodeURIComponent(conversationId)}/messages`),
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await parseJsonSafely(response)
  if (!response.ok || !data?.success) {
    return { conversation: null, messages: [] }
  }
  return { conversation: data.conversation ?? null, messages: data.messages ?? [] }
}

export type OpenConversationResult = { conversationId: string } | { error: string }

/**
 * Finds or creates the direct conversation with another user
 * (GET /api/messaging/conversation-with/:otherClerkId). The backend derives a
 * deterministic conversation id, so calling this repeatedly — including a
 * retry after a cold-start timeout — always lands on the same conversation
 * rather than creating duplicates.
 */
export async function getConversationWithUser(otherClerkId: string, token: string): Promise<OpenConversationResult> {
  try {
    const response = await fetchWithRetry(
      getApiUrl(`/api/messaging/conversation-with/${encodeURIComponent(otherClerkId)}`),
      { headers: { Authorization: `Bearer ${token}` } },
      { retries: 2, timeoutMs: 30000 }
    )
    const data = await parseJsonSafely(response)

    if (response.ok && data?.success && typeof data.conversationId === "string") {
      return { conversationId: data.conversationId }
    }

    return { error: data?.message || `Couldn't open the conversation (${response.status})` }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error" }
  }
}
