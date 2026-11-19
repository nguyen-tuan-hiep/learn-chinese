# Nguồn dữ liệu

## Giáo trình HSK 2.0 và HSK 3.0

- Từ vựng theo bài của cả hai giáo trình lấy từ hai file CSV do người dùng cung cấp. `HSK2_0_full.csv` gồm HSK Standard Course 1–6, 146 bài, 4.734 từ. `HSK3_0_full.csv` gồm New HSK Course 1–4, 68 bài, 1.848 từ. Mỗi dòng có chữ Hán, pinyin, từ loại, nghĩa tiếng Anh và trang tham khảo (cột `Source`, trang từ vựng theo bài của HanziStroke). Script [`scripts/build-book-vocab.mjs`](scripts/build-book-vocab.mjs) chuyển CSV sang JSON trong `src/data/`; chạy lại sau khi sửa CSV.
- Hai giáo trình dùng chung một kiểu bài: danh sách thẻ từ, nghe, xem cách viết và đánh dấu đã nhớ. Từ đã nhớ vào thẻ ôn tập. Học liệu HSK 2.0 cũ (ngữ pháp, hội thoại, bài đọc, bài tập, nghĩa tiếng Việt và Hán Việt từ CVDICT) đã được gỡ khỏi ứng dụng.
- Số bài và tên bài HSK 2.0 theo bộ **HSK Standard Course** (BLCU Press và Chinese Testing International): HSK 1: 15; HSK 2: 15; HSK 3: 20; HSK 4: 20 (4A–4B); HSK 5: 36 (5A–5B); HSK 6: 40 (6A–6B). Tên bài trong [`src/data/hsk2Titles.ts`](src/data/hsk2Titles.ts) được đối chiếu với trang giới thiệu sách: [HSK Standard Course 1](https://www.hskstandardcourse.com/hsk-standard-course-level-1/hsk-standard-course-1-textbook/), [2](https://www.hskstandardcourse.com/hsk-standard-course-level-2/hsk-standard-course-2-textbook/), [3](https://www.hskstandardcourse.com/hsk-standard-course-level-3/hsk-standard-course-3-textbook/). Tên tiếng Việt là bản dịch của website. HSK 4–6 chia quyển A/B ở bài 10, 18 và 20.
- Tên bài HSK 3.0 được đối chiếu với trang thông tin sách New HSK Course trên aijiaocai.com và mục lục các PDF 4A/4B người dùng cung cấp. Xem thêm [`src/data/LICENSES.md`](src/data/LICENSES.md).

## Cách viết chữ và giao diện

- [Hanzi Writer](https://hanziwriter.org/docs.html): hoạt ảnh và luyện thứ tự nét; dữ liệu nét chữ được tải qua jsDelivr.
- [Google Fonts](https://fonts.google.com/): Be Vietnam Pro và Noto Serif SC.

## Phát âm và bảng tra cứu

- Trình tự phát âm, khẩu hình và quy ước pinyin được đối chiếu với [Open University — Pronunciation Guide](https://www.open.edu/openlearn/mod/oucontent/view.php?id=106435) và [MIT OCW — Sounds and symbols: An overview of pinyin, Julian K. Wheatley](https://ocw.mit.edu/courses/res-21g-003-learning-chinese-a-foundation-course-in-mandarin-spring-2011/01af9a25b804b7d58a26fa580691df4f_MITRES_21G_003S11_pinyin.pdf).
- Cột gợi âm tiếng Việt là mẹo ghi nhớ do website biên soạn, không phải phiên âm IPA hay bản dịch chính thức; luôn đi kèm khẩu hình và chú ý khác biệt. Không đồng nhất thanh điệu với dấu tiếng Việt.
- `src/data/pronunciationGuide.ts` là dữ liệu hướng dẫn dùng chung cho trang Phát âm và bảng tra. Âm mẫu dùng giọng zh-CN trên thiết bị đọc chữ/từ tiếng Trung; chất lượng phụ thuộc giọng được cài. Âm đầu được minh họa trong âm tiết, thanh nhẹ được nghe trong từ.
- Các hoạt động nền tảng trên `/pronunciation` dùng định danh `foundation-01`–`foundation-07`. Lộ trình giáo trình chỉ đếm 146 bài HSK.
