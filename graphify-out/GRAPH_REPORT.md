# Graph Report - hanyu-path  (2026-11-17)

## Corpus Check
- 148 files · ~89,839 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .csv 2, (none) 1, .css 1)

## Summary
- 867 nodes · 2551 edges · 29 communities (28 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.83)
- Token cost: 75,638 input · 0 output

## Graph Freshness
- Built from commit: `f46e3faa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- radicals.ts
- LessonPage.tsx
- Layout.tsx
- RadicalsPage.tsx
- db.ts
- charComponents.ts
- Deploy Workflow
- GlassNavIcons.tsx
- radicalFamily.ts
- courseModel.ts
- PronunciationPage.tsx
- WordOfDay.tsx
- Tự học Hànyǔ (project README)
- Dev Dependencies
- pronunciation.ts
- TypeScript Config
- course.ts
- RadicalMindmap.tsx
- generate-splash.mjs
- SettingsPage.tsx
- lessonRadicals.ts
- Runtime Dependencies
- ReviewPage.tsx
- SearchPalette.tsx
- CLAUDE.md
- vite.config.ts
- NPM Scripts
- react
- main.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 72 edges
2. `StatsPage` - 42 edges
3. `framer-motion` - 38 edges
4. `lucide-react` - 33 edges
5. `useSettings` - 32 edges
6. `Pinyin()` - 29 edges
7. `Button()` - 28 edges
8. `react-router-dom` - 25 edges
9. `LessonPage()` - 23 edges
10. `dateKey()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `LXGW WenKai GB font` --semantically_similar_to--> `Google Fonts (Be Vietnam Pro, Noto Serif SC)`  [INFERRED] [semantically similar]
  public/licenses/OFL-LXGW-WenKai-GB.txt → SOURCES.md
- `/course route (curriculum, daily vocab quota)` --shares_data_with--> `src/data/course.ts (HSK 3.0 lesson titles)`  [INFERRED]
  README.md → src/data/LICENSES.md
- `Nguồn dữ liệu (data sources)` --references--> `Course data sources (LICENSES.md)`  [EXTRACTED]
  SOURCES.md → src/data/LICENSES.md
- `src/data/course.ts (HSK 3.0 lesson titles)` --cites--> `New HSK Course (aijiaocai.com)`  [EXTRACTED]
  src/data/LICENSES.md → SOURCES.md
- `src/data/hsk2Vocabulary.json` --references--> `HSK2_0_full.csv (HSK Standard Course 1-6, 146 lessons, 4734 words)`  [EXTRACTED]
  src/data/LICENSES.md → SOURCES.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radical and character-structure data sources** — readme_unicode_kangxi_radicals, readme_unihan_krsunicode, src_data_radicals, src_data_radicalmap, src_data_charcomponents, sources_make_me_a_hanzi [EXTRACTED 1.00]
- **CSV to JSON vocabulary build pipeline** — sources_hsk2_0_full_csv, sources_hsk3_0_full_csv, scripts_build_book_vocab, src_data_licenses_hsk2vocabulary_json, src_data_licenses_newhskcoursevocabulary_json [EXTRACTED 1.00]

## Communities (29 total, 1 thin omitted)

### Community 0 - "radicals.ts"
Cohesion: 0.17
Nodes (12): RadicalLesson, CHARACTERS_BY_RADICAL, GROUPS, RADICAL_FOR_CHARACTER, CORE_GLYPHS, CORE_RADICALS, FIRST_SEEN, RADICAL_BY_ID (+4 more)

### Community 1 - "LessonPage.tsx"
Cohesion: 0.09
Nodes (33): HidePinyinSwitch(), LessonPage(), Burst(), RowWord, SPARK_COLORS, WordCard(), WordCardProps, WriteButton() (+25 more)

### Community 2 - "Layout.tsx"
Cohesion: 0.10
Nodes (36): zustand@^5.0.16, zustand, Brand(), Layout(), SearchPalette, AudioStatus(), BODY, BrandMark() (+28 more)

### Community 3 - "RadicalsPage.tsx"
Cohesion: 0.11
Nodes (48): Filter, FILTERS, FitnessRing(), PracticeSessions(), RadicalDetails(), RadicalEntry(), RadicalHero(), RadicalLessonPage() (+40 more)

### Community 4 - "db.ts"
Cohesion: 0.06
Nodes (53): LABELS, NAMES, WeekStreak(), Cell(), Heatmap(), level(), OPACITY, WEEKDAYS (+45 more)

### Community 5 - "charComponents.ts"
Cohesion: 0.14
Nodes (13): Make Me a Hanzi (LGPL-3.0-or-later), ARITY, CHAR_COMPONENTS, CharComponents, CharType, Tree, TYPES, CHAR_NOTES (+5 more)

### Community 6 - "Deploy Workflow"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 7 - "GlassNavIcons.tsx"
Cohesion: 0.16
Nodes (14): Art, GlassIcon, HomeIcon, icon(), LessonsIcon, PlayIcon, PronunciationIcon, RadicalsIcon (+6 more)

### Community 8 - "radicalFamily.ts"
Cohesion: 0.22
Nodes (15): ComposeQuiz(), componentsOf(), isPart(), charFamily(), charInfo(), radicalsIn(), taughtIn(), cache (+7 more)

### Community 9 - "courseModel.ts"
Cohesion: 0.19
Nodes (15): StartPage(), booksFor(), HskVersion, PRONUNCIATION_UNIT_TABS, PRONUNCIATION_UNITS, pronunciationProgress(), PronunciationQuestion, PronunciationUnit (+7 more)

### Community 10 - "PronunciationPage.tsx"
Cohesion: 0.06
Nodes (61): MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley), Open University Pronunciation Guide, PronunciationPage(), RULES, Tab, TABS, TONE_ROWS, COLORS (+53 more)

### Community 11 - "WordOfDay.tsx"
Cohesion: 0.18
Nodes (10): HSK2_LESSONS, HSK3_LESSONS, Word, byPart, CharInfo, COURSE_CHARS, index, TRIVIAL (+2 more)

### Community 12 - "Tự học Hànyǔ (project README)"
Cohesion: 0.07
Nodes (25): index.html app shell, src/main.tsx entry, Pre-paint theme script (hanyu-settings localStorage), PWA / iOS safe-area meta config, Klee Project (Fontworks), LXGW WenKai GB font, SIL Open Font License 1.1, Hanzi Writer (+17 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.14
Nodes (19): devDependencies, opentype.js@^2.0.0, tailwindcss@^4.3.3, @types/node@^22.20.5, @types/react@^18.3.31, @types/react-dom@^18.3.7, typescript@5.6, workbox-window@^7.4.1 (+11 more)

### Community 14 - "pronunciation.ts"
Cohesion: 0.15
Nodes (11): finals, finals2, initials1, initials2, initials3, PRON_ITEMS, TONE_PAIRS, TonePair (+3 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 17 - "course.ts"
Cohesion: 0.10
Nodes (16): ALL_LESSONS, Book, books(), HSK2_BOOKS, HSK2_TEXTBOOKS, HSK3_BOOKS, lessonId(), Rows (+8 more)

### Community 18 - "RadicalMindmap.tsx"
Cohesion: 0.22
Nodes (11): cache, ColoredHanzi(), Branch(), clip(), RadicalMindmap(), ROLE, parseIds(), strokeParts() (+3 more)

### Community 19 - "generate-splash.mjs"
Cohesion: 0.05
Nodes (31): RFC-4180, convert(), parseCsv(), curriculum, curriculumDir, [dictionaryPath], groups, radicalMap (+23 more)

### Community 20 - "SettingsPage.tsx"
Cohesion: 0.10
Nodes (35): App(), LessonRoute(), RadicalLessonPage, RATES, SettingsPage(), StartPage, useTheme(), useVoice() (+27 more)

### Community 21 - "lessonRadicals.ts"
Cohesion: 0.16
Nodes (13): newCharacters(), Radical, COURSE_USES, INFO, LessonChar, LessonRadicalInfo, PartStatus, phoneticFamilies() (+5 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, dexie@^4.4.7, dexie-react-hooks@^1.1.7, framer-motion@^11.18.2, hanzi-writer@^3.7.3, lucide-react@^1.65.0, react@^18.3.1, react-router-dom@^6.30.6 (+5 more)

### Community 23 - "ReviewPage.tsx"
Cohesion: 0.07
Nodes (47): BrowseDeck(), CountPill(), Mode, ReviewPage(), ScheduledReview(), useCardKeys(), strokesOf(), FreehandWriter() (+39 more)

### Community 24 - "SearchPalette.tsx"
Cohesion: 0.13
Nodes (24): react-dom@^18.3.1, react-dom, CLOSE, fold(), glyphSize(), GROUP_TITLE, ISLAND_TOKENS, islandAnchor() (+16 more)

### Community 31 - "vite.config.ts"
Cohesion: 0.17
Nodes (9): @tailwindcss/vite@^4.3.3, vite@^6.4.5, vite-plugin-pwa@^2.0.0, @vitejs/plugin-react@^4.7.0, @tailwindcss/vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 32 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 33 - "react"
Cohesion: 0.07
Nodes (55): framer-motion, lucide-react, react, react-router-dom, CoursePage(), HomePage(), StatsPage, RANGES (+47 more)

### Community 37 - "main.tsx"
Cohesion: 0.20
Nodes (6): @fontsource/nunito@^5.3.0, lxgw-wenkai-gb-web@^1.530.0, @fontsource/nunito, lxgw-wenkai-gb-web, StudyErrorBoundary, migrateLegacyDatabase()

## Knowledge Gaps
- **11 isolated node(s):** `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `Open University Pronunciation Guide`, `src/main.tsx entry`, `src/lib/migrateProgress.ts (legacy progress migration)` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 264 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `radicals.ts`, `LessonPage.tsx`, `Layout.tsx`, `RadicalsPage.tsx`, `db.ts`, `main.tsx`, `GlassNavIcons.tsx`, `radicalFamily.ts`, `courseModel.ts`, `PronunciationPage.tsx`, `WordOfDay.tsx`, `Dev Dependencies`, `RadicalMindmap.tsx`, `SettingsPage.tsx`, `Runtime Dependencies`, `ReviewPage.tsx`, `SearchPalette.tsx`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `Open University Pronunciation Guide` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LessonPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09102564102564102 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `radicals.ts`, `LessonPage.tsx`, `Layout.tsx`, `RadicalsPage.tsx`, `db.ts`, `radicalFamily.ts`, `PronunciationPage.tsx`, `WordOfDay.tsx`, `Dev Dependencies`, `RadicalMindmap.tsx`, `SettingsPage.tsx`, `Runtime Dependencies`, `ReviewPage.tsx`, `SearchPalette.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `Layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10042283298097252 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `react` to `LessonPage.tsx`, `Layout.tsx`, `RadicalsPage.tsx`, `radicalFamily.ts`, `PronunciationPage.tsx`, `WordOfDay.tsx`, `Dev Dependencies`, `SettingsPage.tsx`, `Runtime Dependencies`, `ReviewPage.tsx`, `SearchPalette.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `RadicalsPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10847457627118644 - nodes in this community are weakly interconnected._