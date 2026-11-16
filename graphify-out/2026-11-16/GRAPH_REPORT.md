# Graph Report - hanyu-path  (2026-11-16)

## Corpus Check
- 150 files · ~88,976 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .csv 2, .css 2, (none) 1)

## Summary
- 850 nodes · 2640 edges · 31 communities (30 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.82)
- Token cost: 75,638 input · 0 output

## Graph Freshness
- Built from commit: `35a199ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LessonRow.tsx
- db.ts
- Pinyin
- react
- PronunciationPage.tsx
- Loading Skeletons
- Deploy Workflow
- pinyin.ts
- Settings Page
- ReviewPage.tsx
- Radical Data and Ordering
- RadicalsPage.tsx
- Tự học Hànyǔ (project README)
- Dev Dependencies
- RadicalMindmap.tsx
- radicalFamily.ts
- TypeScript Config
- course.ts
- Pronunciation Syllable Data
- generate-splash.mjs
- ToneDrills.tsx
- Lesson Radicals Logic
- Runtime Dependencies
- pronunciationLearning.ts
- Fonts and Error Boundary
- Glass
- CLAUDE.md
- Vite and PWA Config
- NPM Scripts
- searchIndex.ts
- PinyinGuide.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 71 edges
2. `framer-motion` - 42 edges
3. `lucide-react` - 37 edges
4. `useSettings` - 34 edges
5. `Pinyin()` - 32 edges
6. `Button()` - 31 edges
7. `useStudyData()` - 29 edges
8. `spring` - 26 edges
9. `react-router-dom` - 25 edges
10. `LessonPage()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `LXGW WenKai GB font` --semantically_similar_to--> `Google Fonts (Be Vietnam Pro, Noto Serif SC)`  [INFERRED] [semantically similar]
  public/licenses/OFL-LXGW-WenKai-GB.txt → SOURCES.md
- `/course route (curriculum, daily vocab quota)` --shares_data_with--> `src/data/course.ts (HSK 3.0 lesson titles)`  [INFERRED]
  README.md → src/data/LICENSES.md
- `Nguồn dữ liệu (data sources)` --references--> `Course data sources (LICENSES.md)`  [EXTRACTED]
  SOURCES.md → src/data/LICENSES.md
- `Layout()` --calls--> `Settings`  [EXTRACTED]
  src/app/Layout.tsx → src/store/settings.ts
- `src/data/course.ts (HSK 3.0 lesson titles)` --cites--> `New HSK Course (aijiaocai.com)`  [EXTRACTED]
  src/data/LICENSES.md → SOURCES.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radical and character-structure data sources** — readme_unicode_kangxi_radicals, readme_unihan_krsunicode, src_data_radicals, src_data_radicalmap, src_data_charcomponents, sources_make_me_a_hanzi [EXTRACTED 1.00]
- **CSV to JSON vocabulary build pipeline** — sources_hsk2_0_full_csv, sources_hsk3_0_full_csv, scripts_build_book_vocab, src_data_licenses_hsk2vocabulary_json, src_data_licenses_newhskcoursevocabulary_json [EXTRACTED 1.00]

## Communities (31 total, 1 thin omitted)

### Community 0 - "LessonRow.tsx"
Cohesion: 0.11
Nodes (27): label(), LessonRow(), plainTitle(), RowMenu(), LevelPanel(), JourneyList(), NAV, NavItem (+19 more)

### Community 1 - "db.ts"
Cohesion: 0.05
Nodes (65): ts-fsrs@^5.4.2, ts-fsrs, LABELS, NAMES, WeekStreak(), LABELS, legacyHsk3WordId(), date() (+57 more)

### Community 2 - "Pinyin"
Cohesion: 0.38
Nodes (9): COLORS, Pinyin(), Playground(), TypingGuide(), getTone(), marksToNumbers(), PINYIN_WORD, splitSyllables() (+1 more)

### Community 3 - "react"
Cohesion: 0.06
Nodes (73): framer-motion, lucide-react, react, react-router-dom, CoursePage(), Brand(), Layout(), SearchPalette (+65 more)

### Community 4 - "PronunciationPage.tsx"
Cohesion: 0.14
Nodes (18): MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley), Open University Pronunciation Guide, RULES, Tab, TABS, TONE_ROWS, SoundTile(), ToneCard() (+10 more)

### Community 5 - "Loading Skeletons"
Cohesion: 0.23
Nodes (25): AsideCard(), BLANK_STATE, HomeSkeleton(), PageSkeleton(), PronunciationSkeleton(), RouteSkeleton(), CourseSkeleton(), HeaderPlaceholder() (+17 more)

### Community 6 - "Deploy Workflow"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 7 - "pinyin.ts"
Cohesion: 0.15
Nodes (16): PinyinInputHandle, VERDICT, COLOR, ToneContour(), checkPinyin(), contourPath(), groups, LOOSE (+8 more)

### Community 8 - "Settings Page"
Cohesion: 0.09
Nodes (42): App(), HomePage(), LessonRoute(), RadicalLessonPage, SettingsPage(), CoursePage, LessonPage, PronunciationPage (+34 more)

### Community 9 - "ReviewPage.tsx"
Cohesion: 0.06
Nodes (61): hanzi-writer@^3.7.3, hanzi-writer, HidePinyinSwitch(), LessonPage(), BrowseDeck(), CountPill(), Mode, ReviewPage() (+53 more)

### Community 10 - "Radical Data and Ordering"
Cohesion: 0.13
Nodes (16): /radicals route (214 Kangxi radicals, 43 sessions), Unicode Kangxi Radicals, Unihan kRSUnicode, LESSONS, CHARACTERS_BY_RADICAL, GROUPS, RADICAL_FOR_CHARACTER, CORE_GLYPHS (+8 more)

### Community 11 - "RadicalsPage.tsx"
Cohesion: 0.12
Nodes (30): Filter, FILTERS, FitnessRing(), PracticeSessions(), RadicalDetails(), RadicalEntry(), RadicalHero(), RadicalLessonPage() (+22 more)

### Community 12 - "Tự học Hànyǔ (project README)"
Cohesion: 0.08
Nodes (22): index.html app shell, src/main.tsx entry, Pre-paint theme script (hanyu-settings localStorage), PWA / iOS safe-area meta config, Klee Project (Fontworks), LXGW WenKai GB font, SIL Open Font License 1.1, Hanzi Writer (+14 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.14
Nodes (19): devDependencies, opentype.js@^2.0.0, tailwindcss@^4.3.3, @types/node@^22.20.5, @types/react@^18.3.31, @types/react-dom@^18.3.7, typescript@5.6, workbox-window@^7.4.1 (+11 more)

### Community 14 - "RadicalMindmap.tsx"
Cohesion: 0.27
Nodes (9): ColoredHanzi(), Branch(), clip(), RadicalMindmap(), ROLE, parseIds(), strokeParts(), FamilyMember (+1 more)

### Community 15 - "radicalFamily.ts"
Cohesion: 0.09
Nodes (30): Make Me a Hanzi (LGPL-3.0-or-later), ARITY, CHAR_COMPONENTS, CharComponents, CharType, componentsOf(), isPart(), Tree (+22 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 17 - "course.ts"
Cohesion: 0.14
Nodes (11): ALL_LESSONS, HSK2_BOOKS, HSK2_LESSON_COUNTS, HSK2_TEXTBOOKS, HSK3_BOOKS, HSK3_TITLES, Rows, words() (+3 more)

### Community 18 - "Pronunciation Syllable Data"
Cohesion: 0.14
Nodes (12): finals, finals2, initials1, initials2, initials3, PRON_ITEMS, PRON_LESSONS, TONE_PAIRS (+4 more)

### Community 19 - "generate-splash.mjs"
Cohesion: 0.05
Nodes (30): RFC-4180, convert(), parseCsv(), curriculum, curriculumDir, [dictionaryPath], groups, radicalMap (+22 more)

### Community 20 - "ToneDrills.tsx"
Cohesion: 0.20
Nodes (17): PronunciationPage(), SpeakButton(), PinyinRules(), ActivityContent(), PronunciationActivity(), SHAKE, PronunciationChart(), SHAKE (+9 more)

### Community 21 - "Lesson Radicals Logic"
Cohesion: 0.15
Nodes (15): Book, newCharacters(), Radical, CourseLesson, COURSE_USES, INFO, LessonChar, LessonRadicalInfo (+7 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, dexie@^4.4.7, dexie-react-hooks@^1.1.7, framer-motion@^11.18.2, lucide-react@^1.65.0, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^6.30.6 (+5 more)

### Community 23 - "pronunciationLearning.ts"
Cohesion: 0.29
Nodes (9): StartPage(), PRONUNCIATION_UNIT_TABS, PRONUNCIATION_UNITS, pronunciationProgress(), PronunciationQuestion, PronunciationUnit, pronunciationUnitLink(), HomeAction (+1 more)

### Community 24 - "Fonts and Error Boundary"
Cohesion: 0.20
Nodes (6): @fontsource/nunito@^5.3.0, lxgw-wenkai-gb-web@^1.530.0, @fontsource/nunito, lxgw-wenkai-gb-web, StudyErrorBoundary, migrateLegacyDatabase()

### Community 26 - "Glass"
Cohesion: 0.25
Nodes (9): Cell(), Heatmap(), level(), OPACITY, WEEKDAYS, Glass(), GlassMaterial, GlassProps (+1 more)

### Community 31 - "Vite and PWA Config"
Cohesion: 0.17
Nodes (9): @tailwindcss/vite@^4.3.3, vite@^6.4.5, vite-plugin-pwa@^2.0.0, @vitejs/plugin-react@^4.7.0, @tailwindcss/vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 32 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 38 - "searchIndex.ts"
Cohesion: 0.36
Nodes (7): HSK3_LESSONS, RADICALS, fold(), search(), SearchEntry, searchIndex(), SearchKind

### Community 41 - "PinyinGuide.tsx"
Cohesion: 0.19
Nodes (13): PinyinInput, IME, Trainer(), TYPING_EXAMPLES, TypingDeck(), PracticePool(), Rule, RuleExample (+5 more)

## Knowledge Gaps
- **11 isolated node(s):** `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry`, `src/lib/migrateProgress.ts (legacy progress migration)`, `PWA / iOS safe-area meta config` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 247 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `LessonRow.tsx`, `db.ts`, `PronunciationPage.tsx`, `Loading Skeletons`, `pinyin.ts`, `Settings Page`, `ReviewPage.tsx`, `PinyinGuide.tsx`, `RadicalsPage.tsx`, `Dev Dependencies`, `RadicalMindmap.tsx`, `ToneDrills.tsx`, `Runtime Dependencies`, `Fonts and Error Boundary`, `Glass`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LessonRow.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `LessonRow.tsx`, `db.ts`, `PronunciationPage.tsx`, `pinyin.ts`, `Settings Page`, `ReviewPage.tsx`, `RadicalsPage.tsx`, `Dev Dependencies`, `RadicalMindmap.tsx`, `ToneDrills.tsx`, `Runtime Dependencies`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05238095238095238 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `react` to `LessonRow.tsx`, `PronunciationPage.tsx`, `Loading Skeletons`, `pinyin.ts`, `Settings Page`, `ReviewPage.tsx`, `RadicalsPage.tsx`, `Dev Dependencies`, `ToneDrills.tsx`, `Runtime Dependencies`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05815423514538559 - nodes in this community are weakly interconnected._