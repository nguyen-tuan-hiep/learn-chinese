# Graph Report - hanyu-path  (2026-11-16)

## Corpus Check
- 158 files · ~99,325 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .csv 2, .css 2, (none) 1)

## Summary
- 999 nodes · 2904 edges · 46 communities (45 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.82)
- Token cost: 75,638 input · 0 output

## Graph Freshness
- Built from commit: `994a4786`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Notch.tsx
- generate-icons.mjs
- gen-char-data.mjs
- build-book-vocab.mjs
- charComponents.ts
- skeletons.tsx
- Deploy Workflow
- PronunciationPage.tsx
- Settings Page
- ReviewPage.tsx
- Radical Data and Ordering
- PronunciationActivity.tsx
- Tự học Hànyǔ (project README)
- Dev Dependencies
- LessonRow.tsx
- radicalFamily.ts
- TypeScript Config
- course.ts
- framer-motion
- generate-splash.mjs
- SearchPalette.tsx
- lessonRadicals.ts
- Runtime Dependencies
- db.ts
- Intro.tsx
- video/package.json
- RadicalsPage.tsx
- music.mjs
- CLAUDE.md
- courseModel.ts
- srs.ts
- vite.config.ts
- NPM Scripts
- pronunciation.ts
- compilerOptions
- lucide-react
- RadicalMindmap.tsx
- Layout.tsx
- App.tsx
- backup.ts
- useStudyData.ts
- main.tsx
- record.mjs
- chars.ts
- migrateProgress.ts
- nav.ts

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
- `startStudyPlan()` --calls--> `dateKey()`  [EXTRACTED]
  src/lib/studyPlan.ts → src/lib/progress.ts
- `src/data/course.ts (HSK 3.0 lesson titles)` --cites--> `New HSK Course (aijiaocai.com)`  [EXTRACTED]
  src/data/LICENSES.md → SOURCES.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radical and character-structure data sources** — readme_unicode_kangxi_radicals, readme_unihan_krsunicode, src_data_radicals, src_data_radicalmap, src_data_charcomponents, sources_make_me_a_hanzi [EXTRACTED 1.00]
- **CSV to JSON vocabulary build pipeline** — sources_hsk2_0_full_csv, sources_hsk3_0_full_csv, scripts_build_book_vocab, src_data_licenses_hsk2vocabulary_json, src_data_licenses_newhskcoursevocabulary_json [EXTRACTED 1.00]

## Communities (46 total, 1 thin omitted)

### Community 0 - "Notch.tsx"
Cohesion: 0.17
Nodes (14): zustand@^5.0.16, zustand, EventIcon(), HIDE, ICON_BG, Notch(), hold(), NotchEvent (+6 more)

### Community 1 - "generate-icons.mjs"
Cohesion: 0.20
Nodes (7): maskable, pub(), render(), root, square, STEAM, work

### Community 2 - "gen-char-data.mjs"
Cohesion: 0.18
Nodes (7): curriculum, curriculumDir, [dictionaryPath], groups, radicalMap, rows, wanted

### Community 3 - "build-book-vocab.mjs"
Cohesion: 0.27
Nodes (8): RFC-4180, convert(), parseCsv(), HSK2_0_full.csv (HSK Standard Course 1-6, 146 lessons, 4734 words), HSK3_0_full.csv (New HSK Course 1-4, 68 lessons, 1848 words), HSK Standard Course (BLCU Press / Chinese Testing International), src/data/hsk2Vocabulary.json, src/data/newHskCourseVocabulary.json

### Community 4 - "charComponents.ts"
Cohesion: 0.14
Nodes (13): Make Me a Hanzi (LGPL-3.0-or-later), ARITY, CHAR_COMPONENTS, CharComponents, CharType, Tree, TYPES, CHAR_NOTES (+5 more)

### Community 5 - "skeletons.tsx"
Cohesion: 0.20
Nodes (27): AsideCard(), BLANK_STATE, HomeSkeleton(), PageSkeleton(), PronunciationSkeleton(), RouteSkeleton(), CourseSkeleton(), LessonHeader() (+19 more)

### Community 6 - "Deploy Workflow"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 7 - "PronunciationPage.tsx"
Cohesion: 0.05
Nodes (82): MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley), Open University Pronunciation Guide, PronunciationPage(), RULES, Tab, TABS, TONE_ROWS, COLORS (+74 more)

### Community 8 - "Settings Page"
Cohesion: 0.14
Nodes (25): SettingsPage(), AudioStatus(), IconBadge(), SettingsSection(), StackedRow(), StudyBackup(), ListGroup(), ListRow() (+17 more)

### Community 9 - "ReviewPage.tsx"
Cohesion: 0.24
Nodes (15): BrowseDeck(), CountPill(), Mode, ReviewPage(), ScheduledReview(), useCardKeys(), FlashCard(), ReviewControls() (+7 more)

### Community 10 - "Radical Data and Ordering"
Cohesion: 0.13
Nodes (16): /radicals route (214 Kangxi radicals, 43 sessions), Unicode Kangxi Radicals, Unihan kRSUnicode, HSK2_LESSONS, CHARACTERS_BY_RADICAL, GROUPS, RADICAL_FOR_CHARACTER, CORE_GLYPHS (+8 more)

### Community 11 - "PronunciationActivity.tsx"
Cohesion: 0.29
Nodes (9): ActivityContent(), PronunciationActivity(), SHAKE, ValueBadge(), markPart(), cheer(), cheerAnswer(), MascotState (+1 more)

### Community 12 - "Tự học Hànyǔ (project README)"
Cohesion: 0.08
Nodes (22): index.html app shell, src/main.tsx entry, Pre-paint theme script (hanyu-settings localStorage), PWA / iOS safe-area meta config, Klee Project (Fontworks), LXGW WenKai GB font, SIL Open Font License 1.1, Hanzi Writer (+14 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.14
Nodes (19): devDependencies, opentype.js@^2.0.0, tailwindcss@^4.3.3, @types/node@^22.20.5, @types/react@^18.3.31, @types/react-dom@^18.3.7, typescript@5.6, workbox-window@^7.4.1 (+11 more)

### Community 14 - "LessonRow.tsx"
Cohesion: 0.20
Nodes (15): label(), LessonRow(), plainTitle(), RowMenu(), LevelPanel(), JourneyList(), NowBadge(), ProgressBar() (+7 more)

### Community 15 - "radicalFamily.ts"
Cohesion: 0.22
Nodes (15): ComposeQuiz(), componentsOf(), isPart(), charFamily(), charInfo(), radicalsIn(), taughtIn(), cache (+7 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 17 - "course.ts"
Cohesion: 0.11
Nodes (16): PracticePool(), ALL_LESSONS, books(), HSK2_BOOKS, HSK2_TEXTBOOKS, HSK3_BOOKS, lessonId(), Rows (+8 more)

### Community 18 - "framer-motion"
Cohesion: 0.25
Nodes (7): framer-motion, FAN_COLORS, EASE, popIn, riseIn, spring, RangeBar()

### Community 19 - "generate-splash.mjs"
Cohesion: 0.14
Nodes (9): fonts, out, root, screens, sizes, subtitle, THEMES, title (+1 more)

### Community 20 - "SearchPalette.tsx"
Cohesion: 0.10
Nodes (31): StrokeFrame(), StrokeOrderGuide(), StrokeSequence(), cssColor(), StrokeWriter(), WriterMode, CustomStudySheet(), plainTitle() (+23 more)

### Community 21 - "lessonRadicals.ts"
Cohesion: 0.16
Nodes (13): newCharacters(), Radical, COURSE_USES, INFO, LessonChar, LessonRadicalInfo, PartStatus, phoneticFamilies() (+5 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, dexie@^4.4.7, dexie-react-hooks@^1.1.7, framer-motion@^11.18.2, hanzi-writer@^3.7.3, lucide-react@^1.65.0, react@^18.3.1, react-dom@^18.3.1 (+8 more)

### Community 23 - "db.ts"
Cohesion: 0.12
Nodes (16): StudyBackup, DayLog, db, HanyuDB, LessonPart, LessonState, PlanDay, PlanWeek (+8 more)

### Community 24 - "Intro.tsx"
Cohesion: 0.06
Nodes (50): remotion, remotion@4.0.540, Aurora(), Bun(), Caption(), ClipInfo, CUTS, DARK (+42 more)

### Community 25 - "video/package.json"
Cohesion: 0.10
Nodes (24): playwright, @remotion/cli, dependencies, playwright@1.56.1, react@18.3.1, react-dom@18.3.1, @remotion/cli@4.0.540, description (+16 more)

### Community 26 - "RadicalsPage.tsx"
Cohesion: 0.06
Nodes (73): CoursePage(), HomePage(), HidePinyinSwitch(), LessonPage(), Filter, FILTERS, FitnessRing(), PracticeSessions() (+65 more)

### Community 27 - "music.mjs"
Cohesion: 0.15
Nodes (21): BASS, bell(), CHORDS, clap(), COUNTER, CUTS, data, gliss() (+13 more)

### Community 29 - "courseModel.ts"
Cohesion: 0.23
Nodes (12): StartPage(), booksFor(), PRONUNCIATION_UNIT_TABS, pronunciationProgress(), PronunciationQuestion, PronunciationUnit, pronunciationUnitLink(), build() (+4 more)

### Community 30 - "srs.ts"
Cohesion: 0.16
Nodes (17): ReviewWord, CardKind, buildQueue(), isLearning(), LEARN_AHEAD_MS, NEW_PER_DAY, QueueItem, ReviewQueue (+9 more)

### Community 31 - "vite.config.ts"
Cohesion: 0.17
Nodes (9): @tailwindcss/vite@^4.3.3, vite@^6.4.5, vite-plugin-pwa@^2.0.0, @vitejs/plugin-react@^4.7.0, @tailwindcss/vite, vite, vite-plugin-pwa, @vitejs/plugin-react (+1 more)

### Community 32 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 33 - "pronunciation.ts"
Cohesion: 0.14
Nodes (12): finals, finals2, initials1, initials2, initials3, PRON_ITEMS, PRON_LESSONS, TONE_PAIRS (+4 more)

### Community 34 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, module, moduleResolution, noEmit, resolveJsonModule, skipLibCheck, strict (+3 more)

### Community 35 - "lucide-react"
Cohesion: 0.19
Nodes (13): lucide-react, react-router-dom, Label(), BODY, BrandMark(), Face(), PLEATS, useBlink() (+5 more)

### Community 36 - "RadicalMindmap.tsx"
Cohesion: 0.21
Nodes (12): cache, ColoredHanzi(), strokesOf(), Branch(), clip(), RadicalMindmap(), ROLE, parseIds() (+4 more)

### Community 37 - "Layout.tsx"
Cohesion: 0.23
Nodes (12): Brand(), Layout(), SearchPalette, Corner(), DesktopFrame(), VersionMenu(), UpdatePrompt(), featurePastel() (+4 more)

### Community 38 - "App.tsx"
Cohesion: 0.27
Nodes (13): App(), LessonRoute(), RadicalLessonPage, CoursePage, LessonPage, PronunciationPage, RadicalsPage, ReviewPage (+5 more)

### Community 39 - "backup.ts"
Cohesion: 0.37
Nodes (13): date(), day(), integer(), invalid(), kind(), list(), num(), parseBackup() (+5 more)

### Community 40 - "useStudyData.ts"
Cohesion: 0.29
Nodes (10): ChartRange, fmtDay(), MONTHS, ScrubChart(), dateKey(), streakFrom(), computeStats(), StudyContext (+2 more)

### Community 41 - "main.tsx"
Cohesion: 0.18
Nodes (6): @fontsource/nunito@^5.3.0, lxgw-wenkai-gb-web@^1.530.0, @fontsource/nunito, lxgw-wenkai-gb-web, StudyErrorBoundary, migrateLegacyDatabase()

### Community 42 - "record.mjs"
Cohesion: 0.25
Nodes (7): browserFor(), browsers, clip(), DEVICES, only, seed(), sleep()

### Community 43 - "chars.ts"
Cohesion: 0.28
Nodes (8): Book, CourseLesson, Word, byPart, CharInfo, COURSE_CHARS, index, TRIVIAL

### Community 44 - "migrateProgress.ts"
Cohesion: 0.31
Nodes (8): legacyHsk3WordId(), legacyIds(), legacy2, legacy3, migrateCourseProgress(), OLD_PARTS, remembered(), renameLegacyIds()

### Community 45 - "nav.ts"
Cohesion: 0.67
Nodes (3): NAV, NavItem, Feature

## Knowledge Gaps
- **11 isolated node(s):** `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `foundation-01..foundation-07 activities`, `Open University Pronunciation Guide`, `src/lib/migrateProgress.ts (legacy progress migration)` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 317 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `lucide-react` to `Notch.tsx`, `RadicalMindmap.tsx`, `Layout.tsx`, `skeletons.tsx`, `PronunciationPage.tsx`, `Settings Page`, `ReviewPage.tsx`, `PronunciationActivity.tsx`, `Dev Dependencies`, `LessonRow.tsx`, `nav.ts`, `framer-motion`, `SearchPalette.tsx`, `Runtime Dependencies`, `RadicalsPage.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `foundation-01..foundation-07 activities` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `charComponents.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `framer-motion` to `Notch.tsx`, `lucide-react`, `Layout.tsx`, `App.tsx`, `PronunciationPage.tsx`, `useStudyData.ts`, `PronunciationActivity.tsx`, `Dev Dependencies`, `LessonRow.tsx`, `SearchPalette.tsx`, `Runtime Dependencies`, `RadicalsPage.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Deploy Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._
- **Why does `remotion` connect `Intro.tsx` to `video/package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `PronunciationPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05078416728902166 - nodes in this community are weakly interconnected._