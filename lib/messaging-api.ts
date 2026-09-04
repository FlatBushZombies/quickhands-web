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
