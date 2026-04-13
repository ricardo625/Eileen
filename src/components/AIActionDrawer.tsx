import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, Maximize2, Send, CheckCircle } from 'lucide-react'

export interface DrawerAction {
  title: string
  subtitle: string
  description: string
  impact: { label: string; value: string; positive?: boolean }[]
  steps: { label: string; detail: string }[]
  confirmLabel: string
}

type Phase = 'generating' | 'ready' | 'executing' | 'done'

// ─── Shared sub-components ───────────────────────────────────────────────────

function AIAvatar() {
  return (
    <div className="size-[28px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-[2px]">
      <Sparkles size={12} className="text-white" strokeWidth={2} />
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-[4px]">
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
    </div>
  )
}

// ─── GeneratingState ─────────────────────────────────────────────────────────

function GeneratingState() {
  const [step, setStep] = useState(0)
  const messages = ['Analyzing your data…', 'Calculating expected impact…', 'Building step-by-step plan…']

  useEffect(() => {
    const timers = [setTimeout(() => setStep(1), 600), setTimeout(() => setStep(2), 1200)]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[16px] bg-[#f8fafc]">
      <div className="flex gap-[10px] items-start">
        <AIAvatar />
        <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
          <TypingDots />
        </div>
      </div>

      {messages.slice(0, step + 1).map((msg, i) => (
        <div key={i} className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.3s ease-out both' }}>
          <AIAvatar />
          <div className="flex-1 bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
            <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">{msg}</p>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-[10px] mt-[4px]">
        {[1, 0.7, 0.5].map((w, i) => (
          <div
            key={i}
            className="h-[14px] rounded-full bg-[#e2e8f0]"
            style={{ width: `${w * 100}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <Keyframes />
    </div>
  )
}

// ─── ReadyState ───────────────────────────────────────────────────────────────

function ReadyState({ action }: { action: DrawerAction }) {
  return (
    <div className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[16px] bg-[#f8fafc]">
      <div className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: '0ms' }}>
        <AIAvatar />
        <div className="flex-1 bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
          <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">{action.description}</p>
        </div>
      </div>

      <div className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: '80ms' }}>
        <AIAvatar />
        <div className="flex-1 flex flex-col gap-[8px]">
          <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
            <p className="text-[13px] text-[#1e293b] font-inter">Here's the expected impact:</p>
          </div>
          <div className="grid grid-cols-2 gap-[6px]">
            {action.impact.map((imp, i) => (
              <div
                key={imp.label}
                className="bg-white rounded-[12px] px-[12px] py-[10px] border border-[#f1f5f9] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-[2px]"
                style={{ animation: 'fade-slide-up 0.3s ease-out both', animationDelay: `${160 + i * 50}ms` }}
              >
                <span className={`text-[17px] font-bold font-heading leading-none ${imp.positive ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>{imp.value}</span>
                <span className="text-[11px] text-[#94a3b8] font-inter">{imp.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: '200ms' }}>
        <AIAvatar />
        <div className="flex-1 flex flex-col gap-[8px]">
          <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
            <p className="text-[13px] text-[#1e293b] font-inter">Here's my step-by-step plan:</p>
          </div>
          <div className="flex flex-col gap-[6px]">
            {action.steps.map((step, i) => (
              <div
                key={step.label}
                className="bg-white rounded-[12px] px-[14px] py-[10px] border border-[#f1f5f9] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex gap-[10px] items-start"
                style={{ animation: 'fade-slide-up 0.3s ease-out both', animationDelay: `${280 + i * 60}ms` }}
              >
                <div className="size-[20px] rounded-full bg-[#eef2ff] flex items-center justify-center shrink-0 mt-[1px]">
                  <span className="text-[9px] font-bold text-[#6366f1] font-inter">{i + 1}</span>
                </div>
                <div className="flex flex-col gap-[1px]">
                  <span className="text-[12px] font-semibold text-[#0f172a] font-inter">{step.label}</span>
                  <span className="text-[11px] text-[#64748b] font-inter leading-snug">{step.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex gap-[10px] items-start"
        style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: `${360 + action.steps.length * 60}ms` }}
      >
        <AIAvatar />
        <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9] flex-1">
          <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">
            Ready to proceed. Should I go ahead and <strong>{action.confirmLabel.toLowerCase()}</strong>?
          </p>
        </div>
      </div>

      <Keyframes />
    </div>
  )
}

// ─── ExecutingState ───────────────────────────────────────────────────────────

function ExecutingState({ action }: { action: DrawerAction }) {
  const [step, setStep] = useState(0)
  const messages = [
    `Executing: ${action.confirmLabel}…`,
    'Coordinating with relevant parties…',
    'Verifying and confirming completion…',
  ]

  useEffect(() => {
    const timers = [setTimeout(() => setStep(1), 700), setTimeout(() => setStep(2), 1400)]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[16px] bg-[#f8fafc]">
      {/* User confirmation bubble */}
      <div className="flex justify-end" style={{ animation: 'fade-slide-up 0.25s ease-out both' }}>
        <div className="max-w-[75%] bg-[#6366f1] rounded-[16px] rounded-br-[4px] px-[14px] py-[10px]">
          <p className="text-[13px] text-white font-inter leading-[20px]">Yes, go ahead.</p>
        </div>
      </div>

      {/* Typing bubble */}
      <div className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.3s ease-out both', animationDelay: '100ms' }}>
        <AIAvatar />
        <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
          <TypingDots />
        </div>
      </div>

      {/* Step messages */}
      {messages.slice(0, step + 1).map((msg, i) => (
        <div key={i} className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.3s ease-out both' }}>
          <AIAvatar />
          <div className="flex-1 bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
            <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">{msg}</p>
          </div>
        </div>
      ))}

      {/* Shimmer skeletons */}
      <div className="flex flex-col gap-[10px] mt-[4px]">
        {[1, 0.7, 0.5].map((w, i) => (
          <div
            key={i}
            className="h-[14px] rounded-full bg-[#e2e8f0]"
            style={{ width: `${w * 100}%`, animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <Keyframes />
    </div>
  )
}

// ─── DoneState ────────────────────────────────────────────────────────────────

function DoneState({ action, followUp, setFollowUp, onSend }: {
  action: DrawerAction
  followUp: string
  setFollowUp: (v: string) => void
  onSend: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[16px] bg-[#f8fafc]">
      {/* User confirmation bubble */}
      <div className="flex justify-end" style={{ animation: 'fade-slide-up 0.25s ease-out both' }}>
        <div className="max-w-[75%] bg-[#6366f1] rounded-[16px] rounded-br-[4px] px-[14px] py-[10px]">
          <p className="text-[13px] text-white font-inter leading-[20px]">Yes, go ahead.</p>
        </div>
      </div>

      {/* Success confirmation bubble */}
      <div className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: '80ms' }}>
        <AIAvatar />
        <div className="flex-1 flex flex-col gap-[8px]">
          {/* Success card */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] flex items-start gap-[10px]">
            <CheckCircle size={16} className="text-[#16a34a] shrink-0 mt-[1px]" strokeWidth={2} />
            <div className="flex flex-col gap-[2px]">
              <span className="text-[13px] font-semibold text-[#15803d] font-inter">Action completed</span>
              <span className="text-[12px] text-[#166534] font-inter leading-[18px]">
                "{action.confirmLabel}" has been executed successfully.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps summary */}
      <div className="flex gap-[10px] items-start" style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: '180ms' }}>
        <AIAvatar />
        <div className="flex-1 flex flex-col gap-[6px]">
          <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
            <p className="text-[13px] text-[#1e293b] font-inter">Here's what I did:</p>
          </div>
          {action.steps.map((step, i) => (
            <div
              key={step.label}
              className="flex items-center gap-[8px] bg-white rounded-[10px] px-[12px] py-[8px] border border-[#f1f5f9] shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
              style={{ animation: 'fade-slide-up 0.28s ease-out both', animationDelay: `${240 + i * 50}ms` }}
            >
              <CheckCircle size={13} className="text-[#16a34a] shrink-0" strokeWidth={2} />
              <span className="text-[12px] font-medium text-[#1e293b] font-inter">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up prompt */}
      <div
        className="flex gap-[10px] items-start"
        style={{ animation: 'fade-slide-up 0.35s ease-out both', animationDelay: `${280 + action.steps.length * 50}ms` }}
      >
        <AIAvatar />
        <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9] flex-1">
          <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">
            Is there anything else you'd like me to help with?
          </p>
        </div>
      </div>

      <Keyframes />
    </div>
  )
}

// ─── Keyframes (shared) ───────────────────────────────────────────────────────

function Keyframes() {
  return (
    <style>{`
      @keyframes bounce-dot {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes fade-slide-up {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }
    `}</style>
  )
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

export function AIActionDrawer({
  action,
  onClose,
  onConfirm,
}: {
  action: DrawerAction | null
  onClose: () => void
  onConfirm?: () => void
}) {
  const [phase, setPhase] = useState<Phase>('generating')
  const [followUp, setFollowUp] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!action) return
    setPhase('generating')
    setFollowUp('')
    const t = setTimeout(() => setPhase('ready'), 1800)
    return () => clearTimeout(t)
  }, [action])

  function handleConfirm() {
    onConfirm?.()
    setPhase('executing')
    setTimeout(() => setPhase('done'), 2000)
  }

  function handleFollowUpSend() {
    if (!followUp.trim()) return
    // For now close and navigate to AI Leon with the message context
    onClose()
    navigate('/ai-leon')
  }

  if (!action) return null

  const statusLabel: Record<Phase, string> = {
    generating: 'Generating plan…',
    ready: 'Ready to execute',
    executing: 'Executing…',
    done: 'Action complete',
  }

  const statusColor: Record<Phase, string> = {
    generating: '#f59e0b',
    ready: '#22c55e',
    executing: '#6366f1',
    done: '#16a34a',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[100]"
        style={{ animation: 'fade-in 0.2s ease-out both' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-[460px] bg-white z-[101] flex flex-col"
        style={{
          boxShadow: '-12px 0 48px rgba(0,0,0,0.12)',
          animation: 'slide-in-right 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both',
        }}
      >
        {/* Header */}
        <div className="px-[24px] py-[18px] border-b border-[#f1f5f9] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="size-[36px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0">
              <Sparkles size={15} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-[1px]">
              <span className="text-[14px] font-bold text-[#0f172a] font-heading leading-none">Eileen AI</span>
              <div className="flex items-center gap-[4px]">
                <div
                  className="size-[6px] rounded-full"
                  style={{ backgroundColor: statusColor[phase], transition: 'background-color 0.4s ease' }}
                />
                <span className="text-[11px] text-[#94a3b8] font-inter" style={{ transition: 'opacity 0.3s' }}>
                  {statusLabel[phase]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[4px]">
            <button
              onClick={() => { onClose(); navigate('/ai-leon', { state: { action, phase } }) }}
              title="Open in AI Leon"
              className="text-[#94a3b8] hover:text-[#6366f1] transition-colors p-[4px] rounded-lg hover:bg-[#eef2ff]"
            >
              <Maximize2 size={15} strokeWidth={2} />
            </button>
            <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b] transition-colors p-[4px]">
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Chat body */}
        {phase === 'generating' && <GeneratingState />}
        {phase === 'ready' && <ReadyState action={action} />}
        {phase === 'executing' && <ExecutingState action={action} />}
        {phase === 'done' && (
          <DoneState
            action={action}
            followUp={followUp}
            setFollowUp={setFollowUp}
            onSend={handleFollowUpSend}
          />
        )}

        {/* Footer */}
        {phase !== 'done' ? (
          <div
            className="px-[20px] py-[16px] border-t border-[#f1f5f9] bg-white flex items-center gap-[8px] shrink-0"
            style={{ opacity: phase === 'generating' || phase === 'executing' ? 0.4 : 1, transition: 'opacity 0.4s ease' }}
          >
            <button
              onClick={onClose}
              disabled={phase === 'generating' || phase === 'executing'}
              className="flex-1 py-[11px] rounded-[12px] border border-[#e2e8f0] text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors disabled:cursor-not-allowed"
            >
              Not now
            </button>
            <button
              onClick={phase === 'ready' ? handleConfirm : undefined}
              disabled={phase !== 'ready'}
              className="flex-[2] flex items-center justify-center gap-[7px] py-[11px] rounded-[12px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[13px] font-semibold text-white font-inter hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
            >
              <Sparkles size={13} strokeWidth={2} />
              {phase === 'generating' ? 'Generating…' : phase === 'executing' ? 'Executing…' : action.confirmLabel}
            </button>
          </div>
        ) : (
          <div className="px-[20px] py-[16px] border-t border-[#f1f5f9] bg-white shrink-0" style={{ animation: 'fade-slide-up 0.3s ease-out both' }}>
            <div className="flex items-center gap-[8px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] px-[14px] py-[10px] focus-within:border-[#6366f1] transition-colors">
              <textarea
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFollowUpSend() } }}
                placeholder="Ask a follow-up…"
                rows={1}
                className="flex-1 bg-transparent text-[13px] font-inter text-[#1e293b] placeholder:text-[#94a3b8] resize-none outline-none leading-[20px]"
                style={{ fieldSizing: 'content', maxHeight: 80 } as React.CSSProperties}
              />
              <button
                onClick={handleFollowUpSend}
                disabled={!followUp.trim()}
                className="size-[30px] rounded-full bg-[#6366f1] flex items-center justify-center hover:bg-[#4f46e5] transition-colors disabled:opacity-35 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={13} className="text-white translate-x-[1px]" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
