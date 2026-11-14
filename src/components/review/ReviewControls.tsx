import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, Kbd } from '@/components/ui/Button'
import { spring } from '@/components/ui/motion'

const round = 'glass grid size-14 shrink-0 cursor-pointer place-items-center rounded-full text-label transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100'

/** Previous / flip / next. The black flip pill cross-fades its label in place. */
export function ReviewControls({ revealed, canMove, onPrev, onNext, onFlip }: { revealed: boolean; canMove: boolean; onPrev: () => void; onNext: () => void; onFlip: () => void }) {
  return <>
    <div className="flex items-center justify-center gap-4">
      <button type="button" onClick={onPrev} disabled={!canMove} aria-label="Thẻ trước" className={round}><ChevronLeft aria-hidden="true" className="size-6" /></button>
      <Button size="lg" onClick={onFlip} aria-pressed={revealed} className="relative min-w-40 flex-1 overflow-hidden sm:max-w-56 sm:flex-none">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={revealed ? 'back' : 'front'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring.snappy}>
            {revealed ? 'Úp thẻ' : 'Lật thẻ'}
          </motion.span>
        </AnimatePresence>
      </Button>
      <button type="button" onClick={onNext} disabled={!canMove} aria-label="Thẻ tiếp" className={round}><ChevronRight aria-hidden="true" className="size-6" /></button>
    </div>
    <p className="hidden text-center text-caption text-secondary-label sm:block"><Kbd>Space</Kbd> lật thẻ <span className="mx-1">·</span> <Kbd>Enter</Kbd> nghe phát âm <span className="mx-1">·</span> <Kbd>←</Kbd> <Kbd>→</Kbd> chuyển từ</p>
  </>
}
