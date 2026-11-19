import type { LessonState } from '@/lib/db'

export interface PronunciationQuestion {
  prompt: string; choices: string[]; answer: number; feedback: string; say?: string; review?: string
}
export interface PronunciationUnit {
  id: string; title: string; goal: string; minutes: number; body: string; steps: string[]
  sample?: { say: string; pinyin: string }; chart?: 'initials' | 'finals' | 'tones'; questions: PronunciationQuestion[]
}
export const PRONUNCIATION_UNITS: PronunciationUnit[] = [
  { id: 'foundation-01', title: 'What makes up Chinese?', minutes: 5, sample: { say: '妈', pinyin: 'mā' },
    goal: 'Tell characters, pinyin and meaning apart, and know how to start.',
    body: 'Characters write Chinese; pinyin writes the pronunciation with Latin letters and tone marks; the English meaning helps you understand. 妈 — mā — mum are three views of one word, not three things to learn separately. You don\'t need to write characters in the Pronunciation section yet. Get your audio ready and start by listening.',
    steps: ['Turn the volume up; check the Chinese voice in Settings if the play button does nothing.', 'In each activity: listen to the model → read the guide → repeat → try telling sounds apart.', 'Study 10–15 minutes or one sound group at a time; review what is due, then continue. Skip is for content you already know.'],
    questions: [{ prompt: 'What does pinyin help you do?', choices: ['Know how to pronounce Chinese', 'Replace the English meaning in every case'], answer: 0, feedback: 'Pinyin records pronunciation. Characters and meanings are learned with words in the HSK lessons.' }] },
  { id: 'foundation-02', title: 'One pinyin syllable', minutes: 5, sample: { say: '八', pinyin: 'bā' },
    goal: 'Spot the initial, the final and the tone mark.',
    body: 'In mā, m is the initial (the opening consonant), a is the final, and the flat mark is tone 1. The three parts are said together as one syllable. Some syllables have no initial, like ài. Pinyin uses Latin letters, but many of them sound different from English.',
    steps: ['Listen to mā in the next lesson; don\'t spell it out as “em–ay”.', 'Look at bā: split it into b + a + tone 1, then say it in one go.', 'In ài, spot the final ai and tone 4; no opening consonant is needed.'],
    questions: [{ prompt: 'In bā, which part is the final?', choices: ['b', 'a', 'The flat mark'], answer: 1, feedback: 'b is the initial, a is the final; the flat mark shows tone 1.' }] },
  { id: 'foundation-03', title: 'The four tones and the neutral tone', minutes: 10, chart: 'tones',
    goal: 'Hear the pitch direction and tell the basic tones apart.',
    body: 'The same sounds with a different tone can mean something different. Speak comfortably within your own range; don\'t try to copy the model\'s exact pitch. The neutral tone is short and unstressed, and its pitch depends on the syllable before it.',
    steps: ['Listen to mā, má, mǎ, mà in turn and watch the pitch direction.', 'Repeat each one a few times; then listen without looking at the pinyin.', 'Listen to 妈妈: notice the second syllable is lighter. No need to memorise the characters in the examples.'],
    questions: [{ prompt: 'Listen, then choose the tone you heard.', say: '骂', choices: ['Tone 1', 'Tone 2', 'Tone 3', 'Tone 4'], answer: 3, feedback: 'The model mà drops quickly from high to low: tone 4.', review: '/pronunciation?tab=tones' }] },
  { id: 'foundation-04', title: 'Initials: listen and place the tongue', minutes: 15, chart: 'initials',
    goal: 'Try each group of initials; hear aspiration and tongue position.',
    body: 'Learn one small group of the chart at a time; you don\'t need them all at once. Each model is a full syllable: when you hear bō, you are practising the initial b in that syllable. Compare the pairs b–p, d–t, g–k, j–q, zh–ch, z–c by the puff of air.',
    steps: ['Start with the lip and tongue-tip groups. Hold a sheet of paper in front of your mouth to feel the puff of air.', 'Practise g/k/h, then j/q/x. Compare where the tongue sits instead of relying only on English look-alikes.', 'Practise zh/ch/sh/r and z/c/s in a separate round; listen again until the difference is clear.'],
    questions: [{ prompt: 'What is the main difference between pinyin b and p?', choices: ['p has a clear puff of air; b does not', 'p is just b said louder'], answer: 0, feedback: 'Keep the same mouth shape and compare the air when the lips open.', review: '/pronunciation?tab=initials' }] },
  { id: 'foundation-05', title: 'Finals: from simple to compound', minutes: 15, chart: 'finals',
    goal: 'Try the finals; tell u from ü and the endings n from ng.',
    body: 'Start with a/o/e/i/u/ü, then move on to compound and nasal finals. The chart shows the final; the play button reads a syllable that contains it. Some spellings change when sounds combine, so look at the example\'s pinyin too.',
    steps: ['Say i, then keep the tongue still and round your lips to try ü. Don\'t split it into u–i.', 'Glide compound finals together inside one syllable.', 'Compare an–ang, en–eng, in–ing; n closes with the tongue tip, ng with the back of the tongue.'],
    questions: [{ prompt: 'How do you start the sound ü?', choices: ['Say u and then i as two sounds', 'Hold the tongue as for i, round the lips as for u'], answer: 1, feedback: 'ü is a single vowel: hold the tongue position of i and round your lips.', review: '/pronunciation?tab=finals' }] },
  { id: 'foundation-06', title: 'Typing pinyin', minutes: 8,
    goal: 'Build syllables and type tone numbers in exercises.',
    body: 'm + a + tone 1 make mā. In this site\'s exercises you can type ma1 for mā and ma2 for má. Use v for ü, so nv3 becomes nǚ. The numbers are only a keyboard shortcut; pinyin is still shown with tone marks.',
    steps: ['Say b + a + tone 1 in one go as bā. A syllable is not a string of letter names.', 'Remember the short spellings: iou → iu, uei → ui, uen → un after an initial.', 'y/w are written for syllables with no initial: yi, wu, yu. After j/q/x/y, ü is written u; after n/l it keeps its dots.'],
    questions: [{ prompt: 'Which input gives mā?', choices: ['ma1', 'ma4'], answer: 0, feedback: '1 marks tone 1; 4 marks tone 4.' }] },
  { id: 'foundation-07', title: 'Ready for HSK 1', minutes: 8,
    goal: 'A short listening check, and knowing what to review.',
    body: 'You don\'t need perfect pronunciation or the whole chart memorised before HSK 1. This check tests recognising sounds and reading pinyin. Speaking keeps improving as you listen and repeat; the quiz score does not grade your accent.',
    steps: ['Listen to the model before choosing. If you hear nothing, check the voice in Settings.', 'If you get one wrong, follow the link to review that sound group, then try again.', 'Finish, then go to HSK 1 · Lesson 1; the full chart below is always there for reference.'],
    questions: [
      { prompt: 'Which tone does this syllable have?', say: '妈', choices: ['Tone 1', 'Tone 4'], answer: 0, feedback: 'mā stays high and level: tone 1.', review: '/pronunciation?tab=tones' },
      { prompt: 'Choose the pinyin of the syllable you heard.', say: '七', choices: ['jī', 'qī'], answer: 1, feedback: 'qī has an aspirated initial; compare j–q in the initials chart.', review: '/pronunciation?tab=initials' },
      { prompt: 'Which ending does this syllable have?', say: '心', choices: ['in', 'ing'], answer: 0, feedback: 'xīn has the final in, ending in n.', review: '/pronunciation?tab=finals' },
    ] },
]
export function pronunciationProgress(state: Map<string, LessonState>) {
  const completed = PRONUNCIATION_UNITS.filter(s => !!state.get(s.id)?.done.pronunciation).length
  return { completed, next: PRONUNCIATION_UNITS.find(s => !state.get(s.id)?.done.pronunciation && !state.get(s.id)?.skipped), total: PRONUNCIATION_UNITS.length }
}

export const PRONUNCIATION_UNIT_TABS: Record<string, string> = {
  'foundation-01': 'intro', 'foundation-02': 'intro', 'foundation-03': 'tones',
  'foundation-04': 'initials', 'foundation-05': 'finals', 'foundation-06': 'typing', 'foundation-07': 'check',
}
export const pronunciationUnitLink = (id: string) => `/pronunciation?tab=${PRONUNCIATION_UNIT_TABS[id] ?? 'intro'}`
