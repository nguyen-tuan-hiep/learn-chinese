import { useState } from 'react'
import { motion } from 'framer-motion'
import { speak, type Gender } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { spring } from '@/components/ui/motion'

/** Round glass play button for Chinese audio; tinted while speaking. */
export function SpeakButton({
  text,
  size = 'md',
  slow = false,
  gender,
  className = '',
}: {
  text: string
  size?: 'sm' | 'md' | 'lg'
  slow?: boolean
  gender?: Gender
  className?: string
}) {
  const rate = useSettings((s) => s.speechRate)
  const [playing, setPlaying] = useState(false)
  const dims = { sm: 'size-9', md: 'size-11', lg: 'size-16' }[size]
  const icon = { sm: 16, md: 20, lg: 28 }[size]

  return (
    <motion.button
      type="button"
      aria-label={slow ? 'Nghe chậm' : 'Nghe'}
      title={slow ? 'Nghe chậm' : 'Nghe'}
      whileTap={{ scale: 0.92 }}
      transition={spring.snappy}
      onClick={async (e) => {
        e.stopPropagation()
        setPlaying(true)
        try {
          await speak(text, slow ? rate * 0.6 : rate, gender)
        } finally {
          setPlaying(false)
        }
      }}
      className={`${dims} glass-thin shrink-0 grid place-items-center rounded-full cursor-pointer transition-colors ${
        playing ? 'bg-tint-soft text-tint-text' : 'text-label'
      } ${className}`}
    >
      {slow ? (
        <span className="text-[11px] font-bold">0.6×</span>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          {size !== 'sm' && <path d="M18.5 5.5a9 9 0 0 1 0 13" />}
        </svg>
      )}
    </motion.button>
  )
}
