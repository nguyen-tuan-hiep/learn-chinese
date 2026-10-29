import type { LessonState } from '@/lib/db'

export interface PronunciationQuestion {
  prompt: string; choices: string[]; answer: number; feedback: string; say?: string; review?: string
}
export interface PronunciationUnit {
  id: string; title: string; goal: string; minutes: number; body: string; steps: string[]
  sample?: { say: string; pinyin: string }; chart?: 'initials' | 'finals' | 'tones'; questions: PronunciationQuestion[]
}
export const PRONUNCIATION_UNITS: PronunciationUnit[] = [
  { id: 'foundation-01', title: 'Tiếng Trung gồm những gì?', minutes: 5, sample: { say: '妈', pinyin: 'mā' },
    goal: 'Phân biệt chữ Hán, pinyin và nghĩa; biết cách bắt đầu học.',
    body: 'Chữ Hán ghi tiếng Trung; pinyin ghi cách đọc bằng chữ Latin và dấu thanh; nghĩa tiếng Việt giúp bạn hiểu. Ví dụ 妈 — mā — mẹ là ba cách nhìn cùng một từ, không phải ba từ cần học riêng. Bạn chưa cần nhớ cách viết chữ trong phần Phát âm. Hãy chuẩn bị âm thanh và tập nghe trước.',
    steps: ['Bật âm lượng; kiểm tra giọng tiếng Trung trong Cài đặt nếu nút nghe không hoạt động.', 'Trong mỗi hoạt động: nghe mẫu → xem hướng dẫn → đọc theo → thử phân biệt.', 'Mỗi lần học 10–15 phút hoặc một nhóm âm; ôn phần đến hạn rồi học tiếp. Bỏ qua dành cho nội dung đã biết.'],
    questions: [{ prompt: 'Pinyin giúp bạn làm gì?', choices: ['Biết cách đọc tiếng Trung', 'Thay thế nghĩa tiếng Việt trong mọi trường hợp'], answer: 0, feedback: 'Pinyin ghi âm đọc. Chữ Hán và nghĩa sẽ được học cùng từ trong bài HSK.' }] },
  { id: 'foundation-02', title: 'Một âm tiết pinyin', minutes: 5, sample: { say: '八', pinyin: 'bā' },
    goal: 'Nhận ra thanh mẫu, vận mẫu và dấu thanh.',
    body: 'Trong mā: m là thanh mẫu (âm đầu), a là vận mẫu, dấu ngang là thanh 1. Ba phần được đọc liền thành một âm tiết. Một số âm tiết không có thanh mẫu, như ài. Pinyin dùng chữ Latin nhưng nhiều chữ có cách đọc khác tiếng Việt.',
    steps: ['Nghe mā ở ví dụ trong bài tiếp theo; không đọc tên chữ cái mờ–a.', 'Nhìn bā: tách b + a + thanh 1 rồi đọc liền.', 'Với ài, nhận ra vận mẫu ai và thanh 4; không cần thêm một phụ âm đầu.'],
    questions: [{ prompt: 'Trong bā, đâu là vận mẫu?', choices: ['b', 'a', 'Dấu ngang'], answer: 1, feedback: 'b là thanh mẫu, a là vận mẫu; dấu ngang biểu thị thanh 1.' }] },
  { id: 'foundation-03', title: 'Bốn thanh điệu và thanh nhẹ', minutes: 10, chart: 'tones',
    goal: 'Nghe hướng cao độ và phân biệt các thanh cơ bản.',
    body: 'Cùng một phần âm nhưng đổi thanh điệu có thể đổi nghĩa. Đọc thoải mái trong quãng giọng của bạn, không cố bắt chước đúng độ cao giọng của người mẫu. Thanh nhẹ đọc ngắn và ít nhấn hơn, cao độ phụ thuộc âm trước.',
    steps: ['Nghe lần lượt mā, má, mǎ, mà và nhìn hướng cao độ.', 'Đọc theo mỗi âm vài lần; sau đó nghe mà không nhìn pinyin.', 'Nghe 妈妈: chú ý âm thứ hai nhẹ hơn. Chưa cần học thuộc chữ Hán trong ví dụ.'],
    questions: [{ prompt: 'Nghe mẫu rồi chọn thanh vừa nghe.', say: '骂', choices: ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], answer: 3, feedback: 'Mẫu mà đi từ cao xuống nhanh: thanh 4.', review: '/pronunciation?tab=tones' }] },
  { id: 'foundation-04', title: 'Thanh mẫu: nghe và đặt lưỡi', minutes: 15, chart: 'initials',
    goal: 'Đọc thử các nhóm âm đầu; phân biệt bật hơi và vị trí lưỡi.',
    body: 'Học từng nhóm nhỏ trong bảng, không cần thuộc hết một lần. Âm mẫu là một âm tiết hoàn chỉnh: khi nghe bō, bạn đang luyện âm đầu b trong âm tiết đó. So sánh các cặp b–p, d–t, g–k, j–q, zh–ch, z–c bằng luồng hơi.',
    steps: ['Luyện nhóm môi và đầu lưỡi trước. Đặt tờ giấy trước miệng để cảm nhận bật hơi.', 'Luyện g/k/h rồi j/q/x. So sánh điểm đặt lưỡi thay vì chỉ dựa vào gợi âm tiếng Việt.', 'Luyện zh/ch/sh/r và z/c/s ở lượt riêng; nghe lại khi chưa rõ khác biệt.'],
    questions: [{ prompt: 'Điểm khác chính của b và p trong pinyin là gì?', choices: ['p bật hơi rõ hơn b', 'p chỉ là b được đọc to hơn'], answer: 0, feedback: 'Giữ khẩu hình tương tự và so sánh luồng hơi khi nhả môi.', review: '/pronunciation?tab=initials' }] },
  { id: 'foundation-05', title: 'Vận mẫu: từ âm đơn đến âm ghép', minutes: 15, chart: 'finals',
    goal: 'Đọc thử vận mẫu, phân biệt u/ü và đuôi n/ng.',
    body: 'Bắt đầu bằng a/o/e/i/u/ü, sau đó mới luyện âm ghép và âm mũi. Bảng ghi dạng vận mẫu; nút nghe đọc một âm tiết chứa vận mẫu đó. Một số cách viết thay đổi khi ghép âm, nên hãy nhìn cả pinyin của ví dụ.',
    steps: ['Đọc i rồi giữ vị trí lưỡi và tròn môi để thử ü. Không tách thành u–i.', 'Lướt các âm ghép liền nhau trong một âm tiết.', 'So sánh an–ang, en–eng, in–ing; n đóng bằng đầu lưỡi, ng bằng phần sau lưỡi.'],
    questions: [{ prompt: 'Để thử âm ü, bạn bắt đầu thế nào?', choices: ['Đọc u rồi đọc i thành hai âm', 'Giữ lưỡi như i, tròn môi như u'], answer: 1, feedback: 'ü là một nguyên âm: giữ tư thế lưỡi của i rồi tròn môi.', review: '/pronunciation?tab=finals' }] },
  { id: 'foundation-06', title: 'Luyện gõ pinyin', minutes: 8,
    goal: 'Ghép âm tiết và nhập số thanh điệu trong bài tập.',
    body: 'Ghép m + a + thanh 1 thành mā. Trong bài tập của website, bạn có thể gõ ma1 để nhập mā, ma2 để nhập má. Với ü dùng v, ví dụ nv3 thành nǚ. Dạng số chỉ là cách nhập bàn phím; pinyin hiển thị vẫn có dấu thanh.',
    steps: ['Đọc liền b + a + thanh 1 thành bā. Một âm tiết không phải chuỗi tên chữ cái.', 'Nhớ các dạng viết gọn: iou → iu, uei → ui, uen → un sau thanh mẫu.', 'y/w dùng khi viết âm tiết không có phụ âm đầu: yi, wu, yu. Sau j/q/x/y, ü viết u; sau n/l vẫn giữ hai chấm.'],
    questions: [{ prompt: 'Cách gõ nào biểu thị mā?', choices: ['ma1', 'ma4'], answer: 0, feedback: 'Số 1 biểu thị thanh 1; số 4 biểu thị thanh 4.' }] },
  { id: 'foundation-07', title: 'Sẵn sàng vào HSK 1', minutes: 8,
    goal: 'Kiểm tra nghe ngắn và biết phần nào cần ôn thêm.',
    body: 'Bạn không cần phát âm hoàn hảo hay thuộc hết bảng trước khi vào HSK 1. Bài này kiểm tra nhận biết âm và cách đọc pinyin. Khả năng nói cần tiếp tục tự luyện bằng nghe và đọc theo; điểm trắc nghiệm không đánh giá độ chuẩn giọng nói.',
    steps: ['Nghe mẫu trước khi chọn đáp án. Nếu chưa nghe được, kiểm tra giọng đọc trong Cài đặt.', 'Nếu chọn sai, dùng liên kết ôn đúng nhóm âm rồi quay lại thử.', 'Hoàn thành rồi vào HSK 1 · Bài 1; bảng tổng bên dưới luôn sẵn để tra cứu.'],
    questions: [
      { prompt: 'Âm tiết vừa nghe mang thanh nào?', say: '妈', choices: ['Thanh 1', 'Thanh 4'], answer: 0, feedback: 'mā giữ cao độ cao và đều: thanh 1.', review: '/pronunciation?tab=tones' },
      { prompt: 'Chọn pinyin của âm tiết vừa nghe.', say: '七', choices: ['jī', 'qī'], answer: 1, feedback: 'qī có âm đầu bật hơi; so sánh j–q trong bảng thanh mẫu.', review: '/pronunciation?tab=initials' },
      { prompt: 'Âm tiết vừa nghe có đuôi nào?', say: '心', choices: ['in', 'ing'], answer: 0, feedback: 'xīn có vận mẫu in, kết thúc bằng n.', review: '/pronunciation?tab=finals' },
    ] },
]
export function pronunciationProgress(state: Map<string, LessonState>) {
  const completed = PRONUNCIATION_UNITS.filter(s => !!state.get(s.id)?.done.dialogue).length
  return { completed, next: PRONUNCIATION_UNITS.find(s => !state.get(s.id)?.done.dialogue && !state.get(s.id)?.skipped), total: PRONUNCIATION_UNITS.length }
}

export const PRONUNCIATION_UNIT_TABS: Record<string, string> = {
  'foundation-01': 'intro', 'foundation-02': 'intro', 'foundation-03': 'tones',
  'foundation-04': 'initials', 'foundation-05': 'finals', 'foundation-06': 'typing', 'foundation-07': 'check',
}
export const pronunciationUnitLink = (id: string) => `/pronunciation?tab=${PRONUNCIATION_UNIT_TABS[id] ?? 'intro'}`
