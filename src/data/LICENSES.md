# Nguồn dữ liệu giáo trình

Cả hai giáo trình lấy từ vựng từ hai file CSV do người dùng cung cấp, chuyển sang JSON bằng `scripts/build-book-vocab.mjs`. Mỗi file giữ chữ Hán, pinyin, từ loại, nghĩa tiếng Anh và phân bài. Cột `Source` của CSV ghi trang tham khảo cho từng dòng. Ứng dụng không đóng gói PDF, bài khóa, ngữ pháp hoặc bài tập của sách.

## HSK 2.0 · HSK Standard Course 1–6

- Từ vựng: `HSK2_0_full.csv` → `src/data/hsk2Vocabulary.json`, 146 bài.
- Tên bài: `src/data/hsk2Titles.ts`, chép từ mục lục HSK Standard Course. Tên tiếng Việt là bản dịch của website để tiện tra cứu.

## HSK 3.0 · New HSK Course 1–4

- Từ vựng: `HSK3_0_full.csv` → `src/data/newHskCourseVocabulary.json`, 68 bài.
- Tên bài trong `src/data/course.ts` được đối chiếu với trang thông tin sách [New HSK Course 1](https://www.aijiaocai.com/textbook/details?textbook_id=14062742), [2](https://www.aijiaocai.com/textbook/details?textbook_id=14062743), [3](https://www.aijiaocai.com/textbook/details?textbook_id=14062744) và mục lục các PDF 4A/4B người dùng cung cấp.
