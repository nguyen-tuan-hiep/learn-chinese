# Tự học Hànyǔ

Web app tự học từ vựng tiếng Trung: phát âm, từ vựng theo giáo trình HSK 2.0 và 3.0, ôn tập bằng FSRS. Chạy hoàn toàn trên trình duyệt, cài được như PWA.

- Website: https://nguyen-tuan-hiep.github.io/learn-chinese/
- Repository: https://github.com/nguyen-tuan-hiep/learn-chinese

## Tính năng

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang chủ: gợi ý học tiếp theo tiến độ. |
| `/pronunciation` | Luyện âm, thanh điệu và gõ pinyin. Người mới nên bắt đầu ở đây (`/start` chuyển tới phần phù hợp). |
| `/lesson` | Giáo trình HSK 2.0 / 3.0 (chọn trong Cài đặt). Mỗi bài là một danh sách từ mới kèm nghe, nét chữ. |
| `/review` | Ôn tập ngắt quãng theo thuật toán FSRS. |
| `/stats` | Thống kê thời gian học, chuỗi ngày, lịch sử ôn. |
| `/settings` | Mục tiêu hằng ngày, tham số lặp lại ngắt quãng, giọng đọc, giao diện, sao lưu và xoá tiến độ. |

### Cách học từ vựng

- Trong bài, nghe và đọc to từng từ, rồi chạm đúp vào thẻ (hoặc chạm vòng tròn) khi đã nhớ. Từ đã nhớ sẽ vào bộ ôn tập.
- Nút **I learned these words** đánh dấu toàn bộ từ trong bài; **Unmark** bỏ đánh dấu tất cả.
- Bài hoàn thành khi mọi từ đã được đánh dấu. Bỏ đánh dấu một từ thì tiến độ bài giảm theo.
- Ôn tập ngắt quãng theo thuật toán FSRS, dựa trên mức nhớ mong muốn và số thẻ mới mỗi ngày. Custom study mode: chọn thẻ và nhấn **Review** để ôn tập theo từng bài.

### Lặp lại ngắt quãng

Dùng [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs). Trong Cài đặt có thể chọn mức nhớ mong muốn, số thẻ mới mỗi ngày, khoảng cách tối đa và giới hạn học trước. Thay đổi chỉ áp dụng cho các lần trả lời sau, lịch đã có không bị đổi.

## Dữ liệu và quyền riêng tư

- Tiến độ lưu trong IndexedDB của trình duyệt (Dexie), không có tài khoản hay đồng bộ.
- Sao lưu: tải file JSON ở Cài đặt. Bản sao gồm tiến độ bài, thời gian học, lịch sử ôn và cài đặt lặp lại ngắt quãng; không gồm giọng đọc và giao diện.
- Khôi phục có bước xem trước và xác nhận thay thế; mọi thay đổi ghi trong một transaction.

## Chạy tại máy

Yêu cầu Node.js 24 trở lên.

```sh
npm install
npm run dev
```

Build và kiểm tra kiểu:

```sh
npm run build
```

## Cấu trúc

```
src/app/         các trang (Home, Lesson, Review, Settings, ...)
src/components/  thành phần giao diện dùng chung
src/data/        dữ liệu giáo trình và tiêu đề bài
src/lib/         logic: SRS, sao lưu, di chuyển dữ liệu, mô hình giáo trình
src/store/       trạng thái cài đặt (zustand)
scripts/         tạo dữ liệu từ vựng, nét chữ, icon, splash
video/           công cụ quay video giới thiệu
```

Nguồn dữ liệu và giấy phép: xem [SOURCES.md](SOURCES.md).

## Công nghệ

React 18, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Dexie, ts-fsrs, Hanzi Writer, vite-plugin-pwa.

## Lưu ý

- Giọng đọc dùng Web Speech API và cần có giọng Mandarin trên thiết bị (macOS: Cài đặt hệ thống → Trợ năng → Nội dung được đọc → Giọng nói hệ thống).
- Dữ liệu nét chữ do Hanzi Writer tải qua mạng; chữ hiếm không có dữ liệu sẽ chuyển sang bảng tự viết và tự đánh giá.
- Chưa có chấm phát âm tự động; ghi âm để tự nghe và so sánh.
- Cần kiểm tra thủ công giao diện, âm thanh, micro và nét chữ trên các thiết bị mục tiêu.
