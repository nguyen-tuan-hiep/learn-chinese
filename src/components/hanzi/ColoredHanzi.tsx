import HanziWriter from 'hanzi-writer'

const cache = new Map<string, Promise<string[] | null>>()

/** Stroke outlines of a character from Hanzi Writer, cached; null when there is no data. */
export function strokesOf(char: string) {
  if (!cache.has(char)) {
    let load: Promise<string[] | null>
    try {
      load = HanziWriter.loadCharacterData(char).then((data) => data?.strokes ?? null, () => null)
    } catch {
      load = Promise.resolve(null)
    }
    cache.set(char, load)
  }
  return cache.get(char)!
}
