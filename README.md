# Tự học Hànyǔ

Website: https://nguyen-tuan-hiep.github.io/learn-chinese/

Repository: https://github.com/nguyen-tuan-hiep/learn-chinese


Website tự học tiếng Trung bằng tiếng Việt, từ nhập môn đến danh sách từ vựng HSK 2.0 cấp 1–6.

## Chạy tại máy

```sh
npm install
npm run dev
```

- `/`: trang chủ giới thiệu các phần học và gợi ý bắt đầu hoặc tiếp tục theo tiến độ. Người mới làm quen phát âm tại `/pronunciation`; giáo trình bắt đầu trực tiếp từ HSK 1. `/start` chuyển tiếp tới mục phát âm tương ứng.
- `/radicals`: 43 buổi bao phủ đủ 214 bộ thủ Kangxi, có tra cứu dạng biến thể, luyện nhận diện và viết. HSK vẫn mở song song.
- `/course`: giáo trình; từ vựng chia theo hạn mức mỗi ngày, viết chữ tối đa 3 chữ mỗi buổi.
- `/review`: ôn FSRS khi đến hạn, với thẻ gõ pinyin, nghe, nhận mặt chữ, viết, bộ thủ và câu.
- `/pronunciation`: luyện âm và gõ; mặc định dùng từ đã học hoặc bốn âm mẫu khi chưa có tiến độ.
- `/stats`: thống kê, cài đặt, tải và khôi phục bản sao lưu JSON.

Mặc định cho người mới: 15 phút và 5 từ mới/ngày. Cài đặt đã lưu của người dùng cũ được giữ lại. Bài nhập môn có thể học lại, không khóa giáo trình.

Tiến độ lưu trong IndexedDB của trình duyệt, chưa có đồng bộ tài khoản. Bản sao lưu bao gồm dữ liệu học, lịch ôn, buổi nhập môn và bộ thủ; cài đặt giọng đọc không nằm trong bản sao. Khôi phục yêu cầu xem trước và xác nhận thay thế, các thay đổi được ghi trong một transaction.

Giọng đọc dùng Web Speech API và cần giọng Mandarin trên thiết bị. Dữ liệu nét chữ được Hanzi Writer tải qua mạng; dạng hiếm không có dữ liệu nét chuyển sang bảng tự viết và tự đánh giá. Danh sách bộ thủ theo [Unicode Kangxi Radicals](https://www.unicode.org/charts/PDF/U2F00.pdf), ánh xạ chữ HSK theo Unihan `kRSUnicode`. Chưa có chấm phát âm tự động; tính năng ghi âm giúp người học tự nghe và so sánh.

## Kiểm tra

```sh
npm test
npm run build
npm run test:e2e
```

Kiểm thử trình duyệt dùng Playwright với Google Chrome đã cài trên máy. Có thể thay `channel` trong `playwright.config.ts` theo trình duyệt của môi trường CI. Playwright tự chạy Vite tại localhost:5173 nếu chưa có server.

Các bài kiểm tra UI dùng giọng đọc giả lập; bài kiểm tra trạng thái tự viết dùng bộ vẽ giả lập. Cần kiểm tra thêm chất lượng âm thanh thật, micro và dữ liệu nét chữ thật trên các thiết bị mục tiêu.
