# Graph Report - hanyu-path  (2026-11-16)

## Corpus Check
- 160 files · ~99,016 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .csv 2, .css 2, (none) 1)

## Summary
- 965 nodes · 2838 edges · 43 communities (42 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.82)
- Token cost: 75,638 input · 0 output

## Graph Freshness
- Built from commit: `994a4786`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Layout.tsx
- generate-icons.mjs
- gen-char-data.mjs
- build-book-vocab.mjs
- charComponents.ts
- skeletons.tsx
- Deploy Workflow
- PinyinGuide.tsx
- Settings Page
- ReviewPage.tsx
- Radical Data and Ordering
- RadicalsPage.tsx
- Tự học Hànyǔ (project README)
- Dev Dependencies
- useSettings
- radicalFamily.ts
- TypeScript Config
- course.ts
- PronunciationPage.tsx
- generate-splash.mjs
- SearchPalette.tsx
- lessonRadicals.ts
- Runtime Dependencies
- db.ts
- Intro.tsx
- video/package.json
- LessonPage.tsx
- music.mjs
- CLAUDE.md
- courseModel.ts
- WordCard.tsx
- vite.config.ts
- NPM Scripts
- pronunciation.ts
- compilerOptions
- types.ts
- RadicalMindmap.tsx
- Nguồn dữ liệu (data sources)
- Root.tsx
- practicePool.ts
- index.html app shell
- scripts
- Hook

## God Nodes (most connected - your core abstractions)
1. `framer-motion` - 42 edges
2. `lucide-react` - 37 edges
3. `useSettings` - 34 edges
4. `Pinyin()` - 32 edges
5. `Button()` - 31 edges
6. `useStudyData()` - 29 edges
7. `react-router-dom` - 26 edges
8. `spring` - 25 edges
9. `LessonPage()` - 24 edges
10. `Layout()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `LXGW WenKai GB font` --semantically_similar_to--> `Google Fonts (Be Vietnam Pro, Noto Serif SC)`  [INFERRED] [semantically similar]
  public/licenses/OFL-LXGW-WenKai-GB.txt → SOURCES.md
- `/course route (curriculum, daily vocab quota)` --shares_data_with--> `src/data/course.ts (HSK 3.0 lesson titles)`  [INFERRED]
  README.md → src/data/LICENSES.md
- `Nguồn dữ liệu (data sources)` --references--> `Course data sources (LICENSES.md)`  [EXTRACTED]
  SOURCES.md → src/data/LICENSES.md
- `src/data/course.ts (HSK 3.0 lesson titles)` --cites--> `New HSK Course (aijiaocai.com)`  [EXTRACTED]
  src/data/LICENSES.md → SOURCES.md
- `Nguồn dữ liệu (data sources)` --references--> `Hanzi Writer`  [EXTRACTED]
  SOURCES.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radical and character-structure data sources** — readme_unicode_kangxi_radicals, readme_unihan_krsunicode, src_data_radicals, src_data_radicalmap, src_data_charcomponents, sources_make_me_a_hanzi [EXTRACTED 1.00]
- **CSV to JSON vocabulary build pipeline** — sources_hsk2_0_full_csv, sources_hsk3_0_full_csv, scripts_build_book_vocab, src_data_licenses_hsk2vocabulary_json, src_data_licenses_newhskcoursevocabulary_json [EXTRACTED 1.00]

## Communities (43 total, 1 thin omitted)

### Community 0 - "Layout.tsx"
Cohesion: 0.07
Nodes (41): zustand@^5.0.16, zustand, Brand(), Layout(), SearchPalette, BODY, BrandMark(), Face() (+33 more)

### Community 1 - "generate-icons.mjs"
Cohesion: 0.17
Nodes (7): maskable, pub(), render(), root, square, STEAM, work

### Community 2 - "gen-char-data.mjs"
Cohesion: 0.25
Nodes (7): curriculum, curriculumDir, [dictionaryPath], groups, radicalMap, rows, wanted

### Community 3 - "build-book-vocab.mjs"
Cohesion: 0.27
Nodes (8): RFC-4180, convert(), parseCsv(), HSK2_0_full.csv (HSK Standard Course 1-6, 146 lessons, 4734 words), HSK3_0_full.csv (New HSK Course 1-4, 68 lessons, 1848 words), HSK Standard Course (BLCU Press / Chinese Testing International), src/data/hsk2Vocabulary.json, src/data/newHskCourseVocabulary.json

### Community 4 - "charComponents.ts"
Cohesion: 0.11
Nodes (19): Make Me a Hanzi (LGPL-3.0-or-later), cache, ColoredHanzi(), strokesOf(), ARITY, CHAR_COMPONENTS, CharComponents, CharType (+11 more)

### Community 5 - "skeletons.tsx"
Cohesion: 0.20
Nodes (27): AsideCard(), BLANK_STATE, HomeSkeleton(), PageSkeleton(), PronunciationSkeleton(), RouteSkeleton(), CourseSkeleton(), HeaderPlaceholder() (+19 more)

### Community 6 - "Deploy Workflow"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 7 - "PinyinGuide.tsx"
Cohesion: 0.13
Nodes (30): PronunciationPage(), COLORS, Pinyin(), PinyinInput, PinyinInputHandle, VERDICT, IME, PinyinRules() (+22 more)

### Community 8 - "Settings Page"
Cohesion: 0.07
Nodes (42): App(), LessonRoute(), RadicalLessonPage, PracticeSessions(), SettingsPage(), CoursePage, LessonPage, PronunciationPage (+34 more)

### Community 9 - "ReviewPage.tsx"
Cohesion: 0.23
Nodes (19): BrowseDeck(), CountPill(), Mode, ReviewPage(), ScheduledReview(), SHAKE, TONE_NAME, TonePairDrill() (+11 more)

### Community 10 - "Radical Data and Ordering"
Cohesion: 0.13
Nodes (16): /radicals route (214 Kangxi radicals, 43 sessions), Unicode Kangxi Radicals, Unihan kRSUnicode, HSK2_LESSONS, CHARACTERS_BY_RADICAL, GROUPS, RADICAL_FOR_CHARACTER, CORE_GLYPHS (+8 more)

### Community 11 - "RadicalsPage.tsx"
Cohesion: 0.13
Nodes (25): Filter, FILTERS, FitnessRing(), RadicalDetails(), RadicalEntry(), RadicalHero(), RadicalLessonPage(), RadicalNote() (+17 more)

### Community 12 - "Tự học Hànyǔ (project README)"
Cohesion: 0.20
Nodes (9): Hanzi Writer, /course route (curriculum, daily vocab quota), /pronunciation route, /review route (FSRS spaced review), Tự học Hànyǔ (project README), Web Speech API (Mandarin voice), foundation-01..foundation-07 activities, New HSK Course (aijiaocai.com) (+1 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.12
Nodes (23): devDependencies, opentype.js@^2.0.0, tailwindcss@^4.3.3, @types/node@^22.20.5, @types/react@^18.3.31, @types/react-dom@^18.3.7, typescript@5.6, vite@^6.4.5 (+15 more)

### Community 14 - "useSettings"
Cohesion: 0.36
Nodes (7): useCardKeys(), Branch(), SpeakButton(), WordOfDay(), speak(), HskVersion, useSettings

### Community 15 - "radicalFamily.ts"
Cohesion: 0.16
Nodes (21): ComposeQuiz(), componentsOf(), isPart(), Word, byPart, charFamily(), CharInfo, charInfo() (+13 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 17 - "course.ts"
Cohesion: 0.18
Nodes (10): ALL_LESSONS, Book, books(), HSK2_BOOKS, HSK2_TEXTBOOKS, HSK3_BOOKS, lessonId(), Rows (+2 more)

### Community 18 - "PronunciationPage.tsx"
Cohesion: 0.12
Nodes (24): MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley), Open University Pronunciation Guide, RULES, Tab, TABS, TONE_ROWS, COLOR, ToneContour() (+16 more)

### Community 19 - "generate-splash.mjs"
Cohesion: 0.14
Nodes (9): fonts, out, root, screens, sizes, subtitle, THEMES, title (+1 more)

### Community 20 - "SearchPalette.tsx"
Cohesion: 0.10
Nodes (32): lucide-react, StrokeFrame(), StrokeOrderGuide(), StrokeSequence(), cssColor(), StrokeWriter(), WriterMode, FAN_COLORS (+24 more)

### Community 21 - "lessonRadicals.ts"
Cohesion: 0.16
Nodes (13): newCharacters(), Radical, COURSE_USES, INFO, LessonChar, LessonRadicalInfo, PartStatus, phoneticFamilies() (+5 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, dexie@^4.4.7, dexie-react-hooks@^1.1.7, @fontsource/nunito@^5.3.0, framer-motion@^11.18.2, hanzi-writer@^3.7.3, lucide-react@^1.65.0, lxgw-wenkai-gb-web@^1.530.0 (+10 more)

### Community 23 - "db.ts"
Cohesion: 0.05
Nodes (65): ts-fsrs@^5.4.2, ts-fsrs, LABELS, legacyHsk3WordId(), legacyIds(), date(), day(), integer() (+57 more)

### Community 24 - "Intro.tsx"
Cohesion: 0.14
Nodes (26): Aurora(), Caption(), card, End(), Flashcards(), IN, INOUT, Intro() (+18 more)

### Community 25 - "video/package.json"
Cohesion: 0.12
Nodes (19): playwright, @remotion/cli, seed(), dependencies, playwright@1.56.1, react@18.3.1, react-dom@18.3.1, @remotion/cli@4.0.540 (+11 more)

### Community 26 - "LessonPage.tsx"
Cohesion: 0.06
Nodes (68): framer-motion, react-router-dom, CoursePage(), HidePinyinSwitch(), LessonPage(), RANGES, StatsPage(), vn() (+60 more)

### Community 27 - "music.mjs"
Cohesion: 0.17
Nodes (19): BASS, bell(), CHORDS, clap(), data, gliss(), hz(), kick() (+11 more)

### Community 29 - "courseModel.ts"
Cohesion: 0.12
Nodes (26): HomePage(), StartPage(), MASCOT_LINES, MascotTalk(), MascotTip, LABELS, NAMES, WeekStreak() (+18 more)

### Community 30 - "WordCard.tsx"
Cohesion: 0.19
Nodes (14): Burst(), RowWord, SPARK_COLORS, WordCard(), WordCardProps, WriteButton(), Face(), FaceHeader() (+6 more)

### Community 31 - "vite.config.ts"
Cohesion: 0.18
Nodes (5): @tailwindcss/vite@^4.3.3, vite-plugin-pwa@^2.0.0, @tailwindcss/vite, vite-plugin-pwa, SplashSize

### Community 32 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 33 - "pronunciation.ts"
Cohesion: 0.15
Nodes (10): finals, finals2, initials1, initials2, initials3, PRON_ITEMS, PRON_LESSONS, TONE_PAIRS (+2 more)

### Community 34 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+3 more)

### Community 35 - "types.ts"
Cohesion: 0.24
Nodes (5): HSK2_TITLES, HSK3_TITLES, Item, Lesson, LessonTitle

### Community 36 - "RadicalMindmap.tsx"
Cohesion: 0.40
Nodes (5): clip(), RadicalMindmap(), ROLE, FamilyMember, FamilyRole

### Community 37 - "Nguồn dữ liệu (data sources)"
Cohesion: 0.25
Nodes (8): Klee Project (Fontworks), LXGW WenKai GB font, SIL Open Font License 1.1, Google Fonts (Be Vietnam Pro, Noto Serif SC), src/lib/migrateProgress.ts (legacy progress migration), Nguồn dữ liệu (data sources), Unicode 17.0 Chapter 18 Han, Course data sources (LICENSES.md)

### Community 38 - "Root.tsx"
Cohesion: 0.38
Nodes (5): remotion, remotion@4.0.540, DURATION, FPS, Root()

### Community 39 - "practicePool.ts"
Cohesion: 0.43
Nodes (5): PracticePool(), WORDS, practicePool(), PracticeWord, STARTER_SOUNDS

### Community 40 - "index.html app shell"
Cohesion: 0.33
Nodes (5): index.html app shell, src/main.tsx entry, Pre-paint theme script (hanyu-settings localStorage), PWA / iOS safe-area meta config, /stats route (stats, settings, JSON backup/restore)

### Community 41 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, capture, music, poster, render, studio

### Community 42 - "Hook"
Cohesion: 0.50
Nodes (4): Bun(), Face(), Hook(), Star()

## Knowledge Gaps
- **11 isolated node(s):** `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry`, `src/lib/migrateProgress.ts (legacy progress migration)`, `PWA / iOS safe-area meta config` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 290 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `SearchPalette.tsx` to `Layout.tsx`, `RadicalMindmap.tsx`, `skeletons.tsx`, `PinyinGuide.tsx`, `Settings Page`, `ReviewPage.tsx`, `RadicalsPage.tsx`, `Dev Dependencies`, `radicalFamily.ts`, `PronunciationPage.tsx`, `Runtime Dependencies`, `LessonPage.tsx`, `courseModel.ts`, `WordCard.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07402031930333818 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `LessonPage.tsx` to `Layout.tsx`, `skeletons.tsx`, `PinyinGuide.tsx`, `Settings Page`, `ReviewPage.tsx`, `RadicalsPage.tsx`, `Dev Dependencies`, `useSettings`, `radicalFamily.ts`, `PronunciationPage.tsx`, `SearchPalette.tsx`, `Runtime Dependencies`, `courseModel.ts`, `WordCard.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `charComponents.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._
- **Why does `remotion` connect `Root.tsx` to `Intro.tsx`, `video/package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `Deploy Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._