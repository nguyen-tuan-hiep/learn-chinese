import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'

function Group({ rows, tall = [] }: { rows: number; tall?: number[] }) {
  return <div className="mt-7">
    <Line className="px-4 pb-2 text-footnote" w="5rem" />
    <div className="glass rounded-card divide-y divide-separator overflow-hidden">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={`flex items-center gap-3 px-4 ${tall.includes(i) ? 'min-h-[100px]' : 'min-h-[52px]'}`}>
          <Block className="size-8 shrink-0 rounded-lg" />
          <Line className="flex-1 text-body" w="8rem" />
        </div>
      ))}
    </div>
  </div>
}

/** Placeholder with the same outline as SettingsPage: title, then five grouped sections. */
export function SettingsSkeleton() {
  return <SkeletonPage label="Đang tải cài đặt" className="mx-auto w-full max-w-3xl min-w-0 pt-6 pb-10 sm:pt-8">
    <Line className="text-large-title" w="9rem" />
    <Line className="mt-2 text-callout" w="16rem" />
    <Group rows={2} tall={[0, 1]} />
    <Group rows={3} tall={[0]} />
    <Group rows={1} tall={[0]} />
    <Group rows={2} />
    <Group rows={1} />
  </SkeletonPage>
}
