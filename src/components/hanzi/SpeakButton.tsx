import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { speak, type Gender } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { spring } from '@/components/ui/motion'

/** Round grey play button for Chinese audio (same as Word of the day's); tinted while speaking. */
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
  const icon = { sm: 'size-4', md: 'size-[1.125rem]', lg: 'size-7' }[size]

  return (
    <motion.button
      type="button"
      aria-label={slow ? 'Listen slowly' : 'Listen'}
      title={slow ? 'Listen slowly' : 'Listen'}
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
      className={`${dims} shrink-0 grid place-items-center rounded-full cursor-pointer transition-colors ${
        playing ? 'bg-tint-soft text-tint-text' : 'bg-fill text-label hover:bg-separator'
      } ${className}`}
    >
      {slow ? (
        <span className="text-[11px] font-bold">0.6×</span>
      ) : (
<Volume2 aria-hidden="true" className={icon} />
      )}
    </motion.button>
  )
}
