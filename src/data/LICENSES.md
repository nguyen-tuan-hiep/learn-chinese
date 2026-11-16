# Course data sources

Both courses take their vocabulary from two user-supplied CSV files, converted to JSON by `scripts/build-book-vocab.mjs`. Each file keeps the characters, pinyin, part of speech, English meaning and lesson split. The CSV `Source` column records the reference page for each row. The app does not bundle the books' PDFs, texts, grammar or exercises.

## HSK 2.0 · HSK Standard Course 1–6

- Vocabulary: `HSK2_0_full.csv` → `src/data/hsk2Vocabulary.json`, 146 lessons.
- Lesson titles: `src/data/hsk2Titles.ts`

## HSK 3.0 · New HSK Course 1–4

- Vocabulary: `HSK3_0_full.csv` → `src/data/hsk3Vocabulary.json`, 68 lessons.
- Lesson titles: `src/data/hsk3Titles.ts`