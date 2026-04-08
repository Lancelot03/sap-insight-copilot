import type { ReactNode } from 'react'

export type ChatRole = 'user' | 'assistant'

export type ResponseCard = {
  title: string
  value: string
  subtitle?: string
}

type MessageBubbleProps = {
  role: ChatRole
  content: string
  cards?: ResponseCard[]
  timestamp: string
  children?: ReactNode
}

export function MessageBubble({ role, content, cards, timestamp, children }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
          isUser
            ? 'rounded-br-md bg-sapBlue text-white'
            : 'rounded-bl-md border border-slate-200 bg-white text-slate-900'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>

        {cards && cards.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {cards.map((card) => (
              <div key={`${card.title}-${card.value}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                <p className="mt-1 text-lg font-semibold text-sapBlue">{card.value}</p>
                {card.subtitle ? <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p> : null}
              </div>
            ))}
          </div>
        ) : null}

        {children}

        <p className={`mt-2 text-[10px] ${isUser ? 'text-sky-100' : 'text-slate-400'}`}>{timestamp}</p>
      </div>
    </div>
  )
}
