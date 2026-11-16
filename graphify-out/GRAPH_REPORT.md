# Graph Report - hanyu-path  (2026-11-16)

## Corpus Check
- 151 files · ~91,281 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .csv 2, .css 2, (none) 1)

## Summary
- 861 nodes · 2671 edges · 41 communities (40 shown, 1 thin omitted)
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
- charComponents.ts
- skeletons.tsx
- Deploy Workflow
- PinyinGuide.tsx
- Settings Page
- ReviewPage
- Radical Data and Ordering
- RadicalsPage.tsx
- Tự học Hànyǔ (project README)
- Dev Dependencies
- useSettings
- radicalFamily.ts
- TypeScript Config
- course.ts
- chars.ts
- generate-splash.mjs
- SearchPalette.tsx
- lessonRadicals.ts
- Runtime Dependencies
- srs.ts
- HomePage.tsx
- StatsPage
- framer-motion
- lucide-react
- CLAUDE.md
- courseModel.ts
- Notch.tsx
- vite.config.ts
- NPM Scripts
- WordOfDay.tsx
- backup.ts
- db.ts
- RadicalMindmap.tsx
- useStudyData.ts
- studyPlan.ts
- migrateProgress.ts
- nav.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 71 edges
2. `ReviewPage` - 62 edges
3. `LessonPage` - 51 edges
4. `StatsPage` - 42 edges
5. `framer-motion` - 42 edges
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
- `startStudyPlan()` --calls--> `dateKey()`  [EXTRACTED]
  src/lib/studyPlan.ts → src/lib/progress.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radical and character-structure data sources** — readme_unicode_kangxi_radicals, readme_unihan_krsunicode, src_data_radicals, src_data_radicalmap, src_data_charcomponents, sources_make_me_a_hanzi [EXTRACTED 1.00]
- **CSV to JSON vocabulary build pipeline** — sources_hsk2_0_full_csv, sources_hsk3_0_full_csv, scripts_build_book_vocab, src_data_licenses_hsk2vocabulary_json, src_data_licenses_newhskcoursevocabulary_json [EXTRACTED 1.00]

## Communities (41 total, 1 thin omitted)

### Community 0 - "Layout.tsx"
Cohesion: 0.22
Nodes (12): Brand(), Layout(), SearchPalette, AudioStatus(), Corner(), DesktopFrame(), StreakFlame(), UpdatePrompt() (+4 more)

### Community 1 - "generate-icons.mjs"
Cohesion: 0.17
Nodes (7): maskable, pub(), render(), root, square, STEAM, work

### Community 2 - "gen-char-data.mjs"
Cohesion: 0.18
Nodes (7): curriculum, curriculumDir, [dictionaryPath], groups, radicalMap, rows, wanted

### Community 3 - "build-book-vocab.mjs"
Cohesion: 0.27
Nodes (8): RFC-4180, convert(), parseCsv(), HSK2_0_full.csv (HSK Standard Course 1-6, 146 lessons, 4734 words), HSK3_0_full.csv (New HSK Course 1-4, 68 lessons, 1848 words), HSK Standard Course (BLCU Press / Chinese Testing International), src/data/hsk2Vocabulary.json, src/data/newHskCourseVocabulary.json

### Community 4 - "charComponents.ts"
Cohesion: 0.13
Nodes (15): Make Me a Hanzi (LGPL-3.0-or-later), ARITY, CHAR_COMPONENTS, CharComponents, CharType, parseIds(), strokeParts(), Tree (+7 more)

### Community 5 - "skeletons.tsx"
Cohesion: 0.23
Nodes (25): AsideCard(), BLANK_STATE, HomeSkeleton(), PageSkeleton(), PronunciationSkeleton(), RouteSkeleton(), CourseSkeleton(), HeaderPlaceholder() (+17 more)

### Community 6 - "Deploy Workflow"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 7 - "PinyinGuide.tsx"
Cohesion: 0.07
Nodes (59): MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley), Open University Pronunciation Guide, PronunciationPage(), RULES, Tab, TABS, TONE_ROWS, COLORS (+51 more)

### Community 8 - "Settings Page"
Cohesion: 0.08
Nodes (38): react, App(), CoursePage, LessonRoute(), PronunciationPage, RadicalLessonPage, RadicalsPage, SettingsPage (+30 more)

### Community 9 - "ReviewPage"
Cohesion: 0.10
Nodes (45): CoursePage(), LessonPage, HidePinyinSwitch(), LessonPage(), ReviewPage, BrowseDeck(), CountPill(), Mode (+37 more)

### Community 10 - "Radical Data and Ordering"
Cohesion: 0.14
Nodes (15): RadicalLesson, HSK2_LESSONS, CHARACTERS_BY_RADICAL, GROUPS, RADICAL_FOR_CHARACTER, CORE_GLYPHS, CORE_RADICALS, FIRST_SEEN (+7 more)

### Community 11 - "RadicalsPage.tsx"
Cohesion: 0.18
Nodes (19): Filter, FILTERS, FitnessRing(), PracticeSessions(), RadicalDetails(), RadicalEntry(), RadicalHero(), RadicalNote() (+11 more)

### Community 12 - "Tự học Hànyǔ (project README)"
Cohesion: 0.07
Nodes (25): index.html app shell, src/main.tsx entry, Pre-paint theme script (hanyu-settings localStorage), PWA / iOS safe-area meta config, Klee Project (Fontworks), LXGW WenKai GB font, SIL Open Font License 1.1, Hanzi Writer (+17 more)

### Community 13 - "Dev Dependencies"
Cohesion: 0.12
Nodes (23): devDependencies, opentype.js@^2.0.0, tailwindcss@^4.3.3, @types/node@^22.20.5, @types/react@^18.3.31, @types/react-dom@^18.3.7, typescript@5.6, vite-plugin-pwa@^2.0.0 (+15 more)

### Community 14 - "useSettings"
Cohesion: 0.15
Nodes (16): zustand@^5.0.16, zustand, BODY, BrandMark(), Face(), PLEATS, useBlink(), OPTIONS (+8 more)

### Community 15 - "radicalFamily.ts"
Cohesion: 0.28
Nodes (13): RadicalLessonPage(), ComposeQuiz(), charInfo(), taughtIn(), cache, ComposeQuestion, composeQuestions(), FamilyWord (+5 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 17 - "course.ts"
Cohesion: 0.07
Nodes (27): PracticePool(), ALL_LESSONS, books(), HSK2_BOOKS, HSK2_TEXTBOOKS, HSK3_BOOKS, lessonId(), Rows (+19 more)

### Community 18 - "chars.ts"
Cohesion: 0.22
Nodes (10): componentsOf(), isPart(), Word, byPart, charFamily(), CharInfo, COURSE_CHARS, index (+2 more)

### Community 19 - "generate-splash.mjs"
Cohesion: 0.14
Nodes (9): fonts, out, root, screens, sizes, subtitle, THEMES, title (+1 more)

### Community 20 - "SearchPalette.tsx"
Cohesion: 0.20
Nodes (15): react-dom@^18.3.1, react-dom, CLOSE, fold(), glyphSize(), GROUP_TITLE, ISLAND_TOKENS, islandAnchor() (+7 more)

### Community 21 - "lessonRadicals.ts"
Cohesion: 0.15
Nodes (15): Book, newCharacters(), Radical, CourseLesson, COURSE_USES, INFO, LessonChar, LessonRadicalInfo (+7 more)

### Community 22 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, dexie@^4.4.7, dexie-react-hooks@^1.1.7, @fontsource/nunito@^5.3.0, framer-motion@^11.18.2, hanzi-writer@^3.7.3, lucide-react@^1.65.0, lxgw-wenkai-gb-web@^1.530.0 (+9 more)

### Community 23 - "srs.ts"
Cohesion: 0.13
Nodes (19): LABELS, ReviewWord, CardKind, StoredCard, isLearning(), LEARN_AHEAD_MS, NEW_PER_DAY, QueueItem (+11 more)

### Community 24 - "HomePage.tsx"
Cohesion: 0.26
Nodes (13): HomePage(), Label(), LessonHero(), MascotTalk(), LABELS, NAMES, WeekStreak(), WordOfDay() (+5 more)

### Community 25 - "StatsPage"
Cohesion: 0.15
Nodes (19): StatsPage, RANGES, StatsPage(), vn(), Cell(), Heatmap(), level(), OPACITY (+11 more)

### Community 26 - "framer-motion"
Cohesion: 0.07
Nodes (47): framer-motion, react-router-dom, label(), LessonRow(), plainTitle(), RowMenu(), LevelPanel(), SpeakButton() (+39 more)

### Community 27 - "lucide-react"
Cohesion: 0.21
Nodes (11): lucide-react, strokesOf(), StrokeFrame(), StrokeOrderGuide(), StrokeSequence(), cssColor(), StrokeWriter(), WriterMode (+3 more)

### Community 29 - "courseModel.ts"
Cohesion: 0.18
Nodes (16): StartPage(), booksFor(), HskVersion, PRONUNCIATION_UNIT_TABS, pronunciationProgress(), PronunciationQuestion, PronunciationUnit, pronunciationUnitLink() (+8 more)

### Community 30 - "Notch.tsx"
Cohesion: 0.20
Nodes (13): EventIcon(), HIDE, ICON_BG, Notch(), NotchProgressBridge(), hold(), NotchEvent, NotchIcon (+5 more)

### Community 31 - "vite.config.ts"
Cohesion: 0.25
Nodes (5): @tailwindcss/vite@^4.3.3, vite@^6.4.5, @tailwindcss/vite, vite, SplashSize

### Community 32 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 33 - "WordOfDay.tsx"
Cohesion: 0.36
Nodes (7): HSK3_LESSONS, RADICALS, fold(), search(), SearchEntry, searchIndex(), SearchKind

### Community 34 - "backup.ts"
Cohesion: 0.37
Nodes (13): date(), day(), integer(), invalid(), kind(), list(), num(), parseBackup() (+5 more)

### Community 35 - "db.ts"
Cohesion: 0.22
Nodes (9): StudyBackup, DayLog, HanyuDB, LessonPart, LessonState, PlanDay, PlanWeek, StoredReview (+1 more)

### Community 36 - "RadicalMindmap.tsx"
Cohesion: 0.25
Nodes (9): cache, ColoredHanzi(), Branch(), clip(), RadicalMindmap(), ROLE, RADICAL_BY_GLYPH, FamilyMember (+1 more)

### Community 37 - "useStudyData.ts"
Cohesion: 0.42
Nodes (7): db, dateKey(), streakFrom(), computeStats(), StudyContext, useSharedStudyData(), addStudySeconds()

### Community 38 - "studyPlan.ts"
Cohesion: 0.25
Nodes (5): DAILY_BLOCKS, PLAN_WEEKS, planWeek(), startStudyPlan(), utcDay()

### Community 39 - "migrateProgress.ts"
Cohesion: 0.32
Nodes (7): legacyHsk3WordId(), legacy2, legacy3, migrateCourseProgress(), OLD_PARTS, remembered(), renameLegacyIds()

### Community 40 - "nav.ts"
Cohesion: 0.67
Nodes (3): NAV, NavItem, Feature

## Knowledge Gaps
- **11 isolated node(s):** `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry`, `src/lib/migrateProgress.ts (legacy progress migration)`, `PWA / iOS safe-area meta config` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Settings Page` to `Layout.tsx`, `skeletons.tsx`, `PinyinGuide.tsx`, `ReviewPage`, `Radical Data and Ordering`, `RadicalsPage.tsx`, `Dev Dependencies`, `useSettings`, `radicalFamily.ts`, `course.ts`, `SearchPalette.tsx`, `Runtime Dependencies`, `srs.ts`, `HomePage.tsx`, `StatsPage`, `framer-motion`, `lucide-react`, `courseModel.ts`, `Notch.tsx`, `RadicalMindmap.tsx`, `useStudyData.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `MIT OCW Sounds and symbols: pinyin overview (Julian K. Wheatley)`, `src/main.tsx entry` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `charComponents.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Why does `ReviewPage` connect `ReviewPage` to `Layout.tsx`, `db.ts`, `skeletons.tsx`, `useStudyData.ts`, `Settings Page`, `useSettings`, `srs.ts`, `HomePage.tsx`, `framer-motion`, `lucide-react`, `courseModel.ts`, `Notch.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Deploy Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Layout.tsx`, `RadicalMindmap.tsx`, `PinyinGuide.tsx`, `Settings Page`, `ReviewPage`, `nav.ts`, `RadicalsPage.tsx`, `Radical Data and Ordering`, `Dev Dependencies`, `useSettings`, `radicalFamily.ts`, `SearchPalette.tsx`, `Runtime Dependencies`, `HomePage.tsx`, `StatsPage`, `framer-motion`, `Notch.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `PinyinGuide.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06516105146242132 - nodes in this community are weakly interconnected._