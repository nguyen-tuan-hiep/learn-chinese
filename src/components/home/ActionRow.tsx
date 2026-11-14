import { Link } from 'react-router-dom'
import { ArrowRight, AudioLines, Grid3x3, Layers, type LucideIcon } from 'lucide-react'

function Tile({ to, icon: Icon, title, caption, pastel, dark, badge }: { to: string; icon: LucideIcon; title: string; caption: string; pastel: string; dark: string; badge?: number }) {
  return <Link to={to} className={`group relative flex min-h-[7rem] items-center gap-4 rounded-[2.25rem] p-5 text-[#15120f] shadow-[0_10px_28px_rgb(21_18_15/0.08)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:scale-[0.97] sm:px-7 dark:text-[#f5f1e8] ${pastel} ${dark}`}>
    <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-[#15120f] dark:bg-white/15 dark:text-[#f5f1e8]"><Icon className="size-6" strokeWidth={2} /></span>
    <span className="min-w-0 flex-1">
      <span className="block font-display text-title3 font-extrabold">{title}</span>
      <span className="mt-0.5 block text-subhead opacity-70">{caption}</span>
    </span>
    {badge ? <span className="sr-only">{badge} thẻ</span> : null}
    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[#15120f] text-white transition-transform group-hover:translate-x-0.5 dark:bg-[#f3eee4] dark:text-[#15120f]"><ArrowRight className="size-4" strokeWidth={2.4} /></span>
  </Link>
}

/** Three pastel shortcut cards beside the lesson card. */
export function ActionRow({ reviewCount }: { reviewCount: number }) {
  return <nav aria-label="Lối tắt" className="grid gap-4 sm:gap-5">
    <Tile to="/review" icon={Layers} title="Ôn từ vựng" caption={reviewCount > 0 ? `${reviewCount} thẻ đang chờ bạn` : 'Chưa có thẻ cần ôn'} badge={reviewCount} pastel="bg-[var(--pastel-lilac)]" dark="dark:bg-[#352c4a]" />
    <Tile to="/radicals" icon={Grid3x3} title="Bộ thủ" caption="Học bộ thủ qua hình ảnh" pastel="bg-[var(--pastel-yellow)]" dark="dark:bg-[#4a4226]" />
    <Tile to="/pronunciation" icon={AudioLines} title="Phát âm" caption="Pinyin và thanh điệu" pastel="bg-[var(--pastel-pink)]" dark="dark:bg-[#4a2a38]" />
  </nav>
}
