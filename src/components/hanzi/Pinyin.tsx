import { getTone, PINYIN_WORD, splitSyllables } from '@/lib/pinyin'

const COLORS = ['', 'text-tone1', 'text-tone2', 'text-tone3', 'text-tone4', 'text-tone5']

/** Pinyin with each syllable tinted by its tone; punctuation and spacing are kept. */
export function Pinyin({ text, className = '', plain = false }: { text: string; className?: string; plain?: boolean }) {
  if (plain) return <span className={className}>{text}</span>
  // Apostrophes (nǚ'ér) stay in the gaps so syllable splitting doesn't drop them.
  const tokens = text.split(PINYIN_WORD)
  return (
    <span className={`font-medium ${className}`}>
      {tokens.map((tok, i) =>
        i % 2 === 0 ? (
          <span key={i}>{tok}</span>
        ) : (
          splitSyllables(tok).map((syl, j) => (
            <span key={`${i}-${j}`} className={COLORS[getTone(syl)]}>
              {syl}
            </span>
          ))
        ),
      )}
    </span>
  )
}
