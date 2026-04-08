'use client'

import { useMemo, useState } from 'react'

import { MessageBubble, type ChatRole, type ResponseCard } from './message-bubble'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  cards?: ResponseCard[]
  createdAt: Date
}

type ChatApiResponse = {
  message: string
  cards?: ResponseCard[]
}

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL ?? '/api/chat'

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function buildDemoReply(question: string): ChatApiResponse {
  const q = question.toLowerCase()

  if (q.includes('po') && q.includes('material')) {
    return {
      message: 'Demo mode: I routed this to MM getPOCount(material).',
      cards: [
        { title: 'Action', value: 'getPOCount' },
        { title: 'Result', value: '2 POs' },
      ],
    }
  }

  if (q.includes('monthly') && q.includes('revenue')) {
    return {
      message: 'Demo mode: I routed this to FI getMonthlyRevenue().',
      cards: [
        { title: 'Jan 2026', value: '$20,500' },
        { title: 'Feb 2026', value: '$11,900' },
      ],
    }
  }

  return {
    message: 'Demo mode: Intent captured. This is a local mock response (no backend call).',
    cards: [
      { title: 'Status', value: 'Local Demo' },
      { title: 'Connectivity', value: 'No API used' },
    ],
  }
}

export function ChatWindow({ demoMode = false }: ChatWindowProps) {
function typingCards(question: string): ResponseCard[] {
  return [
    {
      title: 'Intent',
      value: question.toLowerCase().includes('revenue') ? 'Revenue analytics' : 'Operational query',
      subtitle: 'Auto-classified from prompt',
    },
    {
      title: 'Status',
      value: 'Ready',
      subtitle: 'Connect /api/chat or CAP action endpoint',
    },
  ]
}

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am SAP Insight Copilot. Ask me about PO counts, spend, monthly revenue, due aging, or profit center performance.',
      createdAt: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping])

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || isTyping) return

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      const payload = (await response.json()) as ChatApiResponse

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: payload.message ?? 'I could not parse a response from API.',
        cards: payload.cards,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const fallback: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          'API endpoint is currently unavailable. I captured your question and prepared a local response card preview.',
        cards: typingCards(question),
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, fallback])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <section className="mx-auto flex h-[100dvh] w-full max-w-5xl flex-col px-3 py-3 sm:px-6 sm:py-6">
      <header className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg">SAP Insight Copilot</h1>
          <p className="text-xs text-slate-500">Enterprise assistant for MM and FI insights</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Online</span>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-100 p-3 sm:p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            cards={message.cards}
            timestamp={formatTime(message.createdAt)}
          />
        ))}

        {isTyping ? (
          <MessageBubble role="assistant" content="" timestamp={formatTime(new Date())}>
            <div className="mt-2 flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
            </div>
          </MessageBubble>
        ) : null}
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void sendMessage()
              }
            }}
            placeholder="Ask: How many POs for material 100023?"
            className="max-h-40 min-h-11 flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-sapBlue transition focus:border-sapBlue focus:ring-1"
          />
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={!canSend}
            className="h-11 rounded-lg bg-sapBlue px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  )
}
