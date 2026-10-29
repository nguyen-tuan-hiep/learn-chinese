// macOS lists voices that are not downloaded yet (often Tingting). Speaking with one
// "finishes" almost instantly and silently, so such voices are skipped for the rest of
// the session. Not persisted: once the user downloads the voice, a reload picks it up.
const PREFERRED = [/Tingting/i, /Flo/i, /Shelley/i, /Sandy/i, /Google 普通话/i, /Xiaoxiao/i, /Eddy/i, /Reed/i]
const NOVELTY = /Grandma|Grandpa|Rocko/i

let preferredName: string | null = null
const broken = new Set<string>()

/** Mainland Mandarin voices, best first. */
export function chineseVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return []
  const voices = speechSynthesis.getVoices().filter((v) => /^zh[-_](CN|Hans)/i.test(v.lang))
  const rank = (v: SpeechSynthesisVoice) => {
    const i = PREFERRED.findIndex((re) => re.test(v.name))
    return (i === -1 ? PREFERRED.length : i) + (NOVELTY.test(v.name) ? 100 : 0)
  }
  return voices.sort((a, b) => rank(a) - rank(b))
}

export type Gender = 'm' | 'f'

// Apple's multilingual zh-CN voices, male ones; the default pick (Tingting, Flo…) is female.
const MALE_VOICES = [/Reed/i, /Eddy/i, /Rocko/i, /Grandpa/i]

function pickMaleVoice(): SpeechSynthesisVoice | null {
  const voices = chineseVoices().filter((v) => !broken.has(v.name))
  for (const re of MALE_VOICES) {
    const v = voices.find((x) => re.test(x.name))
    if (v) return v
  }
  return null
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = chineseVoices().filter((v) => !broken.has(v.name))
  return voices.find((v) => v.name === preferredName) ?? voices[0] ?? null
}

export function setPreferredVoice(name: string | null) {
  preferredName = name
  if (name) broken.delete(name)
}

export function currentVoiceName(): string | null {
  return pickVoice()?.name ?? null
}

export function hasChineseVoice(): boolean {
  return !!pickVoice()
}

// Chrome can garbage-collect an utterance mid-speech and never fire `end`; keep a reference.
export let active: SpeechSynthesisUtterance | null = null

function speakOnce(text: string, rate: number, pitch: number, voice: SpeechSynthesisVoice | null): Promise<number> {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'
    u.rate = rate
    u.pitch = pitch
    if (voice) u.voice = voice
    let started = 0
    u.onstart = () => (started = performance.now())
    u.onend = () => resolve(started ? performance.now() - started : 0)
    u.onerror = () => resolve(-1)
    active = u
    speechSynthesis.speak(u)
  })
}

/** `gender` gives dialogue speakers different voices; without a male voice installed it just lowers the pitch. */
export async function speak(text: string, rate = 0.8, gender?: Gender): Promise<void> {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  for (let attempt = 0; attempt < 4; attempt++) {
    const male = gender === 'm' ? pickMaleVoice() : null
    const voice = male ?? pickVoice()
    const pitch = gender === 'm' && !male ? 0.7 : 1
    const ms = await speakOnce(text, rate, pitch, voice)
    // Real speech of even one syllable takes well over 150ms.
    if (ms < 0 || ms >= 150 || !voice) return
    broken.add(voice.name)
  }
  active = null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.getVoices() // warm up the list; Chrome loads it asynchronously
}
