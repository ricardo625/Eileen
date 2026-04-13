import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Send, Paperclip, Mic } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'
import userAvatar from '../assets/avatar.png'
import type { DrawerAction } from '../components/AIActionDrawer'

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = 'ai' | 'user'

interface Message {
  id: number
  role: MessageRole
  text: string
  delay?: number
}

// ─── Initial messages ─────────────────────────────────────────────────────────

const defaultMessages: Message[] = [
  {
    id: 1,
    role: 'ai',
    text: 'Hi there! I\'m Eileen AI — your shelf intelligence assistant. I can help you analyze store performance, identify critical issues, suggest campaign optimizations, and auto-resolve shelf alerts.',
  },
  {
    id: 2,
    role: 'ai',
    text: 'Right now I\'m tracking 12 issues across 48 stores, with 5 high-priority alerts that have revenue impact. Would you like me to walk you through the most critical ones?',
  },
]

// ─── Build messages from drawer state ────────────────────────────────────────

function buildMessagesFromDrawer(action: DrawerAction, phase: string): Message[] {
  const msgs: Message[] = []
  let id = 1

  msgs.push({ id: id++, role: 'ai', text: action.description })

  const impactText = action.impact.map((i) => `${i.label}: ${i.value}`).join(' · ')
  msgs.push({ id: id++, role: 'ai', text: `Expected impact — ${impactText}` })

  const stepsText = action.steps.map((s, i) => `${i + 1}. ${s.label}`).join('\n')
  msgs.push({ id: id++, role: 'ai', text: `Here's my step-by-step plan:\n${stepsText}` })

  msgs.push({
    id: id++,
    role: 'ai',
    text: `Ready to proceed. Should I go ahead and ${action.confirmLabel.toLowerCase()}?`,
  })

  if (phase === 'executing' || phase === 'done') {
    msgs.push({ id: id++, role: 'user', text: 'Yes, go ahead.' })
    msgs.push({ id: id++, role: 'ai', text: `Executing: ${action.confirmLabel}…` })
    msgs.push({ id: id++, role: 'ai', text: 'Coordinating with relevant parties…' })
    msgs.push({ id: id++, role: 'ai', text: 'Verifying and confirming completion…' })
  }

  if (phase === 'done') {
    msgs.push({
      id: id++,
      role: 'ai',
      text: `✓ Action completed! "${action.confirmLabel}" has been executed successfully.`,
    })
    const doneSteps = action.steps.map((s) => `✓ ${s.label}`).join('\n')
    msgs.push({ id: id++, role: 'ai', text: `Here's what I did:\n${doneSteps}` })
    msgs.push({ id: id++, role: 'ai', text: 'Is there anything else you\'d like me to help with?' })
  }

  return msgs
}

// ─── Quick prompts ─────────────────────────────────────────────────────────────

const quickPrompts = [
  'Show me critical shelf issues',
  'Summarize this week\'s campaigns',
  'Which stores need attention?',
  'Auto-resolve low-stock alerts',
]

// ─── AI Avatar ───────────────────────────────────────────────────────────────

function AIAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.4} className="text-white" strokeWidth={2} />
    </div>
  )
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-[4px] px-[14px] py-[12px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="size-[6px] rounded-full bg-[#94a3b8]"
          style={{
            animation: 'bounce-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ─── Chat Bubble ─────────────────────────────────────────────────────────────

function ChatBubble({ message, animDelay = 0 }: { message: Message; animDelay?: number }) {
  const isAI = message.role === 'ai'

  if (isAI) {
    return (
      <div
        className="flex gap-[10px] items-end"
        style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: `${animDelay}ms` }}
      >
        <AIAvatar size={32} />
        <div className="max-w-[72%] bg-white rounded-[18px] rounded-bl-[4px] px-[16px] py-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.07)] border border-[#f1f5f9]">
          <p className="text-[14px] text-[#1e293b] font-inter leading-[22px]">{message.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex gap-[10px] items-end justify-end"
      style={{ animation: 'fade-slide-up 0.3s ease-out both', animationDelay: `${animDelay}ms` }}
    >
      <div className="max-w-[72%] bg-[#6366f1] rounded-[18px] rounded-br-[4px] px-[16px] py-[12px]">
        <p className="text-[14px] text-white font-inter leading-[22px]">{message.text}</p>
      </div>
      <div className="size-[32px] rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
        <img src={userAvatar} alt="User" className="size-full object-cover" />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AILeon() {
  const location = useLocation()
  const drawerState = location.state as { action: DrawerAction; phase: string } | null

  const startingMessages = drawerState
    ? buildMessagesFromDrawer(drawerState.action, drawerState.phase)
    : defaultMessages

  const [messages, setMessages] = useState<Message[]>(startingMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [nextId, setNextId] = useState(200)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function handleSend(text?: string) {
    const content = (text ?? input).trim()
    if (!content) return

    const userMsg: Message = { id: nextId, role: 'user', text: content }
    setMessages((prev) => [...prev, userMsg])
    setNextId((n) => n + 1)
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: nextId + 1,
        role: 'ai',
        text: getAIResponse(content),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
      setNextId((n) => n + 2)
    }, 1400)
  }

  function getAIResponse(userText: string): string {
    const lower = userText.toLowerCase()
    if (lower.includes('critical') || lower.includes('issue')) {
      return 'I found 5 critical issues right now. The most urgent: SKU #4821 (Cabernet Sauvignon) is out of stock at 3 Target stores in West Coast — that\'s approximately $14,200 in lost weekly revenue. Want me to initiate a restock recommendation?'
    }
    if (lower.includes('campaign')) {
      return 'Your current campaigns are performing at 78% of target. The "Summer Reds" campaign is outperforming — +23% vs baseline. "Holiday Bundle" is lagging by 12%. I recommend reallocating $2,400 of the Holiday budget to Summer Reds. Shall I prepare the adjustment?'
    }
    if (lower.includes('store') || lower.includes('attention')) {
      return 'Top 3 stores needing immediate attention: (1) Target — Westfield, CA: 4 OOS items, (2) Whole Foods — Austin, TX: pricing mismatches on 2 SKUs, (3) Kroger — Atlanta, GA: planogram compliance at 61%. Want me to create action plans for each?'
    }
    if (lower.includes('auto') || lower.includes('resolve')) {
      return 'I can auto-resolve 8 of the 12 current alerts with high confidence. This includes updating 3 restock requests, flagging 2 pricing discrepancies to your team, and re-submitting 3 pending compliance forms. The remaining 4 require your manual review. Proceed with auto-resolution?'
    }
    return 'Got it! I\'m analyzing your request across all store data. This may take a moment — I\'ll surface the most actionable insights for you right away.'
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[80px] flex items-center justify-between px-[32px] shrink-0 border-b border-[#f1f5f9] bg-white">
          <div className="flex items-center gap-[12px]">
            <div className="size-[40px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <Sparkles size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[20px] font-bold text-[#0f172a] font-heading leading-none">AI Leon</div>
              <div className="flex items-center gap-[5px] mt-[3px]">
                <div className="size-[7px] rounded-full bg-[#22c55e]" />
                <span className="text-[11px] font-medium text-[#94a3b8] font-inter">Online · Ready to help</span>
              </div>
            </div>
          </div>
          <DarkModeToggle />
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-[32px] py-[28px] flex flex-col gap-[16px]">

          {/* Messages */}
          {messages.map((msg, i) => (
            <ChatBubble key={msg.id} message={msg} animDelay={i < defaultMessages.length ? msg.delay ?? 0 : 0} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-[10px] items-end" style={{ animation: 'fade-slide-up 0.25s ease-out both' }}>
              <AIAvatar size={32} />
              <div className="bg-white rounded-[18px] rounded-bl-[4px] shadow-[0px_1px_4px_rgba(0,0,0,0.07)] border border-[#f1f5f9]">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — only show when no user messages yet */}
        {messages.filter((m) => m.role === 'user').length === 0 && !isTyping && (
          <div className="px-[32px] pb-[8px] flex flex-wrap gap-[8px]">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-[14px] py-[8px] rounded-full border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#566166] font-inter hover:border-[#6366f1] hover:text-[#6366f1] transition-colors shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="px-[32px] py-[20px] bg-white border-t border-[#f1f5f9] shrink-0">
          <div className="flex items-end gap-[10px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[20px] px-[16px] py-[12px] focus-within:border-[#6366f1] transition-colors">
            <button className="text-[#94a3b8] hover:text-[#64748b] transition-colors shrink-0 mb-[2px]">
              <Paperclip size={17} strokeWidth={1.75} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI Leon anything about your shelves…"
              rows={1}
              className="flex-1 bg-transparent text-[14px] font-inter text-[#1e293b] placeholder:text-[#94a3b8] resize-none outline-none leading-[22px] max-h-[120px] overflow-y-auto"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <div className="flex items-center gap-[6px] shrink-0">
              <button className="text-[#94a3b8] hover:text-[#64748b] transition-colors mb-[2px]">
                <Mic size={17} strokeWidth={1.75} />
              </button>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="size-[34px] rounded-full bg-[#6366f1] flex items-center justify-center hover:bg-[#4f46e5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={15} className="text-white translate-x-[1px]" strokeWidth={2} />
              </button>
            </div>
          </div>
          <p className="text-center text-[11px] text-[#94a3b8] font-inter mt-[10px]">
            AI Leon can make mistakes. Always verify critical actions.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
