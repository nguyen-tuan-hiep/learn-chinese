# Graph Report - hanyu-path  (2026-11-16)

## Corpus Check
- 151 files · ~91,230 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .csv 2, .css 2, (none) 1)

## Summary
- 861 nodes · 2670 edges · 29 communities (28 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.82)
- Token cost: 75,638 input · 0 output

## Graph Freshness
- Built from commit: `4eabc8e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Layout.tsx
- generate-icons.mjs
- gen-char-data.mjs
- build-book-vocab.mjs
- charNotes.ts
- skeletons.tsx
- Deploy Workflow
- PinyinGuide.tsx
- Settings Page
- ReviewPage
- Radical Data and Ordering
- RadicalsPage.tsx
- Tự học Hànyǔ (project README)
- Dev Dependencies
- radicalFamily.ts
- TypeScript Config
- course.ts
- ToneDrills.tsx
- generate-splash.mjs
- lessonRadicals.ts
- Runtime Dependencies
- db.ts
- framer-motion
- lucide-react
- CLAUDE.md
- courseModel.ts
- Vite and PWA Config
- NPM Scripts
- WordOfDay.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 71 edges
2. `ReviewPage` - 62 edges
3. `LessonPage` - 51 edges
4. `framer-motion` - 42 edges
5. `StatsPage` - 42 edges
6. `lucide-react` - 37 edges
7. `useSettings` - 34 edges
8. `Pinyin()` - 32 edges
9. `Button()` - 31 edges
10. `useStudyData()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `LXGW WenKai GB font` --semantically_similar_to--> `Google Fonts (Be Vietnam Pro, Noto Serif SC)`  [INFERRED] [semantically similar]
  public/licenses/OFL-LXGW-WenKai-GB.txt → SOURCES.md
- `/course route (curriculum, daily vocab quota)` --shares_data_with--> `src/data/course.ts (HSK 3.0 lesson titles)`  [INFERRED]
  README.md → src/data/LICENSES.md
- `Nguồn dữ liệu (data sources)` --references--> `Course data sources (LICENSES.md)`  [EXTRACTED]
  SOURCES.md → src/data/LICENSES.md
- `Layout()` --calls--> `Settings`  [EXTRACTED]
  src/app/Layout.tsx → src/store/settings.ts
- `charFamily()` --calls--> `componentsOf()`  [EXTRACTED]
  src/lib/chars.ts → src/data/charComponents.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radical and character-structure data sources** — readme_unicode_kangxi_radicals, readme_unihan_krsunicode, src_data_radicals, src_data_radicalmap, src_data_charcomponents, sources_make_me_a_hanzi [EXTRACTED 1.00]
- **CSV to JSON vocabulary build pipeline** — sources_hsk2_0_full_csv, sources_hsk3_0_full_csv, scripts_build_book_vocab, src_data_licenses_hsk2vocabulary_json, src_data_licenses_newhskcoursevocabulary_json [EXTRACTED 1.00]

## Communities (29 total, 1 thin omitted)

### Community 0 - "Layout.tsx"
Cohesion: 0.09
Nodes (33): zustand@^5.0.16, zustand, Brand(), Layout(), SearchPalette, AudioStatus(), LABELS, NAMES (+25 more)

### Community 1 - "generate-icons.mjs"
Cohesion: 0.17
Nodes (7): maskable, pub(), render(), root, square, STEAM, work

### Community 2 - "gen-char-data.mjs"
Cohesion: 0.18
Nodes (7): curriculum, curriculumDir, [dictionaryPath], groups, radicalMap, rows, wanted

### Community 3 - "build-book-vocab.mjs"
Cohesion: 0.27
Nodes (8): RFC-4180, convert(), parseCsv(), HSK2_0_full.csv (HSK Standard Course 1-6, 146 lessons, 4734 words), HSK3_0_full.csv (New HSK Course 1-4, 68 lessons, 1848 words), HSK Standard Course (BLCU Press / Chinese Testing International), src/data/hsk2Vocabulary.json, src/data/newHskCourseVocabulary.json

### Community 4 - "charNotes.ts"
Cohesion: 0.25
Nodes (7): CharType, CHAR_NOTES, CHAR_TYPE_LABEL, CharNote, KINDS, NOTE_KIND_LABEL, NoteKind

### Community 5 - "skeletons.tsx"
Cohesion: 0.23
Nodes (25): AsideCard(), BLANK_STATE, HomeSkeleton(), PageSkeleton(), PronunciationSkeleton(), RouteSkeleton(), CourseSkeleton(), HeaderPlaceholder() (+17 more)

### Community 6 - "Deploy Workflow"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 7 - "PinyinGuide.tsx"
Cohesion: 0.06
Nodes (60): MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley), Open University Pronunciation Guide, PronunciationPage(), RULES, Tab, TABS, TONE_ROWS, COLORS (+52 more)

### Community 8 - "Settings Page"
Cohesion: 0.08
Nodes (38): react, App(), CoursePage, LessonRoute(), PronunciationPage, RadicalLessonPage, RadicalsPage, SettingsPage (+30 more)

### Community 9 - "ReviewPage"
Cohesion: 0.08
Nodes (53): LessonPage, HidePinyinSwitch(), LessonPage(), ReviewPage, BrowseDeck(), CountPill(), Mode, ReviewPage() (+45 more)

### Community 10 - "Radical Data and Ordering"
Cohesion: 0.12
Nodes (18): /radicals route (214 Kangxi radicals, 43 sessions), Unicode Kangxi Radicals, Unihan kRSUnicode, RadicalLesson, HSK2_LESSONS, CHARACTERS_BY_RADICAL, GROUPS, RADICAL_FOR_CHARACTER (+10 more)

### Community 11 - "RadicalsPage.tsx"
Cohesion: 0.18
Nodes (19): Filter, FILTERS, FitnessRing(), PracticeSessions(), RadicalDetails(), RadicalEntry(), RadicalHero(), RadicalNote() (+11 more)

### Community 12 - "Tự học Hànyǔ (project README)"
Cohesion: 0.08
Nodes (22): index.html app shell, src/main.tsx entry, Pre-paint theme script (hanyu-settings localStorage), PWA / iOS safe-area meta config, Klee Project (Fontworks), LXGW WenKai GB font, SIL Open Font License 1.1, Hanzi Writer (+14 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.12
Nodes (23): devDependencies, opentype.js@^2.0.0, tailwindcss@^4.3.3, @tailwindcss/vite@^4.3.3, @types/node@^22.20.5, @types/react@^18.3.31, @types/react-dom@^18.3.7, typescript@5.6 (+15 more)

### Community 15 - "radicalFamily.ts"
Cohesion: 0.18
Nodes (20): RadicalLessonPage(), ColoredHanzi(), Branch(), clip(), RadicalMindmap(), ROLE, ComposeQuiz(), charInfo() (+12 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 17 - "course.ts"
Cohesion: 0.14
Nodes (11): ALL_LESSONS, books(), HSK2_BOOKS, HSK2_TEXTBOOKS, HSK3_BOOKS, lessonId(), Rows, words() (+3 more)

### Community 18 - "ToneDrills.tsx"
Cohesion: 0.10
Nodes (20): Book, finals, finals2, initials1, initials2, initials3, PRON_ITEMS, TONE_PAIRS (+12 more)

### Community 19 - "generate-splash.mjs"
Cohesion: 0.14
Nodes (9): fonts, out, root, screens, sizes, subtitle, THEMES, title (+1 more)

### Community 21 - "lessonRadicals.ts"
Cohesion: 0.09
Nodes (26): Make Me a Hanzi (LGPL-3.0-or-later), cache, ARITY, CHAR_COMPONENTS, CharComponents, componentsOf(), isPart(), parseIds() (+18 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): dependencies, dexie@^4.4.7, dexie-react-hooks@^1.1.7, @fontsource/nunito@^5.3.0, framer-motion@^11.18.2, hanzi-writer@^3.7.3, lucide-react@^1.65.0, lxgw-wenkai-gb-web@^1.530.0 (+7 more)

### Community 23 - "db.ts"
Cohesion: 0.06
Nodes (62): ts-fsrs@^5.4.2, ts-fsrs, LABELS, legacyHsk3WordId(), date(), day(), integer(), invalid() (+54 more)

### Community 25 - "framer-motion"
Cohesion: 0.10
Nodes (32): framer-motion, react-router-dom, StatsPage, RANGES, StatsPage(), vn(), ActivityContent(), PronunciationActivity() (+24 more)

### Community 26 - "lucide-react"
Cohesion: 0.07
Nodes (45): lucide-react, CoursePage(), label(), LessonRow(), plainTitle(), RowMenu(), LevelPanel(), ProgressPanel() (+37 more)

### Community 29 - "courseModel.ts"
Cohesion: 0.07
Nodes (51): react-dom@^18.3.1, react-dom, HomePage(), StartPage(), strokesOf(), StrokeFrame(), StrokeOrderGuide(), StrokeSequence() (+43 more)

### Community 31 - "Vite and PWA Config"
Cohesion: 0.25
Nodes (5): vite-plugin-pwa@^2.0.0, @vitejs/plugin-react@^4.7.0, vite-plugin-pwa, @vitejs/plugin-react, SplashSize

### Community 32 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 33 - "WordOfDay.tsx"
Cohesion: 0.36
Nodes (7): HSK3_LESSONS, RADICALS, fold(), search(), SearchEntry, searchIndex(), SearchKind

## Knowledge Gaps
- **11 isolated node(s):** `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry`, `src/lib/migrateProgress.ts (legacy progress migration)`, `PWA / iOS safe-area meta config` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Settings Page` to `Layout.tsx`, `skeletons.tsx`, `PinyinGuide.tsx`, `ReviewPage`, `Radical Data and Ordering`, `RadicalsPage.tsx`, `Dev Dependencies`, `radicalFamily.ts`, `lessonRadicals.ts`, `Runtime Dependencies`, `db.ts`, `framer-motion`, `lucide-react`, `courseModel.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08527131782945736 - nodes in this community are weakly interconnected._
- **Why does `ReviewPage` connect `ReviewPage` to `Layout.tsx`, `skeletons.tsx`, `Settings Page`, `db.ts`, `framer-motion`, `lucide-react`, `courseModel.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Deploy Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Layout.tsx`, `PinyinGuide.tsx`, `Settings Page`, `ReviewPage`, `Radical Data and Ordering`, `RadicalsPage.tsx`, `Dev Dependencies`, `radicalFamily.ts`, `Runtime Dependencies`, `framer-motion`, `courseModel.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `PinyinGuide.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06210526315789474 - nodes in this community are weakly interconnected._