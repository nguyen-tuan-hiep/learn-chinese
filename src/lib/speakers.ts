import type { Gender } from './speech'

const MALE = new Set(['Vương Minh', 'Lâm', 'Bạn cùng phòng'])

/** Dialogue speakers are fictional; this decides which voice reads their lines. */
export function speakerGender(name: string): Gender {
  return MALE.has(name) ? 'm' : 'f'
}
