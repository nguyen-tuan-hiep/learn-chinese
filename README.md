# Hànyǔ Path

Website tự học tiếng Trung bằng tiếng Việt, từ nhập môn đến giáo trình HSK 1–3.

## Chạy tại máy

```sh
npm install
npm run dev
```

- `/`: buổi học hôm nay. Người mới được dẫn vào 7 buổi nhập môn ở `/start`.
- `/course`: giáo trình; từ vựng chia theo hạn mức mỗi ngày, viết chữ tối đa 3 chữ mỗi buổi.
- `/review`: ôn FSRS khi đến hạn, với thẻ gõ pinyin, nghe, nhận mặt chữ, viết và câu.
- `/pronunciation`: luyện âm và gõ; mặc định dùng từ đã học hoặc bốn âm mẫu khi chưa có tiến độ.
- `/stats`: thống kê, cài đặt, tải và khôi phục bản sao lưu JSON.

Mặc định cho người mới: 15 phút và 5 từ mới/ngày. Cài đặt đã lưu của người dùng cũ được giữ lại. Bài nhập môn có thể học lại, không khóa giáo trình.

Tiến độ lưu trong IndexedDB của trình duyệt, chưa có đồng bộ tài khoản. Bản sao lưu bao gồm dữ liệu học, lịch ôn và buổi nhập môn; cài đặt giọng đọc không nằm trong bản sao. Khôi phục yêu cầu xem trước và xác nhận thay thế, các thay đổi được ghi trong một transaction.

Giọng đọc dùng Web Speech API và cần giọng Mandarin trên thiết bị. Dữ liệu nét chữ được Hanzi Writer tải qua mạng. Chưa có chấm phát âm tự động; tính năng ghi âm giúp người học tự nghe và so sánh.

## Kiểm tra

```sh
npm test
npm run build
npm run test:e2e
```

Kiểm thử trình duyệt dùng Playwright với Google Chrome đã cài trên máy. Có thể thay `channel` trong `playwright.config.ts` theo trình duyệt của môi trường CI. Playwright tự chạy Vite tại localhost:5173 nếu chưa có server.

Các bài kiểm tra UI dùng giọng đọc giả lập; bài kiểm tra trạng thái tự viết dùng bộ vẽ giả lập. Cần kiểm tra thêm chất lượng âm thanh thật, micro và dữ liệu nét chữ thật trên các thiết bị mục tiêu.
