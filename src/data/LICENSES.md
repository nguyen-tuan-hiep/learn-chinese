# Course data sources

Both courses take their vocabulary from two user-supplied CSV files, converted to JSON by `scripts/build-book-vocab.mjs`. Each file keeps the characters, pinyin, part of speech, English meaning and lesson split. The CSV `Source` column records the reference page for each row. The app does not bundle the books' PDFs, texts, grammar or exercises.

## HSK 2.0 · HSK Standard Course 1–6

- Vocabulary: `HSK2_0_full.csv` → `src/data/hsk2Vocabulary.json`, 146 lessons.
- Lesson titles: `src/data/hsk2Titles.ts`, copied from the HSK Standard Course tables of contents. The English titles are the website's own translation for easy lookup.

## HSK 3.0 · New HSK Course 1–4

- Vocabulary: `HSK3_0_full.csv` → `src/data/newHskCourseVocabulary.json`, 68 lessons.
- Lesson titles in `src/data/course.ts` were checked against the book pages [New HSK Course 1](https://www.aijiaocai.com/textbook/details?textbook_id=14062742), [2](https://www.aijiaocai.com/textbook/details?textbook_id=14062743), [3](https://www.aijiaocai.com/textbook/details?textbook_id=14062744) and the tables of contents of the user-supplied 4A/4B PDFs.
