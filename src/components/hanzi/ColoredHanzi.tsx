import HanziWriter from 'hanzi-writer'

export interface CharData { strokes: string[]; /** Indices of the strokes that form the radical. */ radStrokes: number[] }

const cache = new Map<string, Promise<CharData | null>>()

/** Stroke outlines (and which belong to the radical) of a character from Hanzi Writer, cached; null when there is no data. */
export function charDataOf(char: string) {
  if (!cache.has(char)) {
    let load: Promise<CharData | null>
    try {
      load = HanziWriter.loadCharacterData(char).then(
        (data) => (data?.strokes ? { strokes: data.strokes, radStrokes: (data as { radStrokes?: number[] }).radStrokes ?? [] } : null),
        () => null)
    } catch {
      load = Promise.resolve(null)
    }
    cache.set(char, load)
  }
  return cache.get(char)!
}

/** Stroke outlines of a character from Hanzi Writer, cached; null when there is no data. */
export const strokesOf = (char: string) => charDataOf(char).then((d) => d?.strokes ?? null)
