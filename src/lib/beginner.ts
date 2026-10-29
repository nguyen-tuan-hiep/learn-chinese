import type { LessonState } from './db'

export const BEGINNER_SESSIONS = [
  { id: 'start-01', title: 'Làm quen với âm thanh', goal: 'Nghe câu chào đầu tiên và hiểu pinyin là gì.', minutes: 5,
    body: 'Tiếng Trung có chữ Hán (你好) và pinyin (nǐ hǎo), cách ghi âm đọc bằng chữ Latin. Dấu trên nguyên âm chỉ thanh điệu. Hôm nay bạn chỉ cần nghe và nhắc lại, chưa cần nhớ mặt chữ.',
    examples: [{ hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'Xin chào' }],
    question: 'Bạn đã nghe rõ câu chào từ nút Nghe chưa?', choices: ['Đã nghe rõ, tôi sẵn sàng', 'Chưa nghe được âm thanh'], answer: 0,
    feedback: 'Nếu chưa có âm thanh, mở Cài đặt ở trang Thống kê để chọn hoặc cài giọng đọc tiếng Trung rồi thử lại.' },
  { id: 'start-02', title: 'Nghe bốn thanh điệu', goal: 'Phân biệt hướng đi của bốn thanh.', minutes: 8,
    body: 'Thanh 1 cao và đều; thanh 2 đi lên; thanh 3 xuống thấp (khi đọc riêng có thể lên lại); thanh 4 rơi nhanh. Thanh điệu làm thay đổi nghĩa. Hãy nghe từng âm, đừng cố ghép chúng với dấu tiếng Việt.',
    examples: [{ hanzi: '妈', pinyin: 'mā', vi: 'mẹ · thanh 1' }, { hanzi: '麻', pinyin: 'má', vi: 'cây gai · thanh 2' }, { hanzi: '马', pinyin: 'mǎ', vi: 'ngựa · thanh 3' }, { hanzi: '骂', pinyin: 'mà', vi: 'mắng · thanh 4' }],
    question: 'Thanh nào đi từ cao xuống nhanh?', choices: ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], answer: 3,
    feedback: 'Thanh 4 rơi nhanh từ cao xuống. Hãy nghe lại mà rồi chọn lại.' },
  { id: 'start-03', title: 'Đọc câu chào đầu tiên', goal: 'Đọc được nǐ hǎo và nhận biết biến điệu.', minutes: 8,
    body: 'n trong nǐ bắt đầu bằng đầu lưỡi chạm lợi trên; h trong hǎo bật hơi nhẹ ở phía sau miệng. Hai thanh 3 cạnh nhau: âm đầu đọc thành thanh 2. Vì vậy nǐ hǎo được đọc gần ní hǎo, nhưng ở bài tập gõ vẫn viết nǐ hǎo.',
    examples: [{ hanzi: '你', pinyin: 'nǐ', vi: 'bạn' }, { hanzi: '好', pinyin: 'hǎo', vi: 'tốt, khỏe' }, { hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'xin chào · đọc ní hǎo' }],
    question: 'Khi nói 你好, thanh của âm đầu thay đổi thế nào?', choices: ['Đọc thành thanh 2', 'Đọc thành thanh 4', 'Bỏ hẳn âm đầu'], answer: 0,
    feedback: 'Hai thanh 3 đứng cạnh nhau: thanh đầu đọc thành thanh 2. Pinyin của câu này vẫn viết nǐ hǎo.' },
  { id: 'start-04', title: 'Gõ pinyin bằng bàn phím thường', goal: 'Gõ được ni3 hao3 để trả lời bài tập.', minutes: 5,
    body: 'Gõ chữ cái rồi thêm số thanh điệu: 1, 2, 3, 4. Ví dụ nǐ = ni3, hǎo = hao3. Không cần cài bàn phím tiếng Trung cho bài tập trong ứng dụng. Bạn có thể dùng dấu cách giữa các âm.',
    examples: [{ hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'Cách gõ: ni3 hao3' }],
    question: 'Gõ lại câu Xin chào bằng pinyin.', expected: 'nǐ hǎo' },
  { id: 'start-05', title: 'Chào đúng người', goal: 'Chọn cách chào bạn bè và người lớn tuổi.', minutes: 8,
    body: '你好 dùng để chào một người. 您好 (nín hǎo) là cách chào kính trọng. Hãy nghe, nhắc lại hai câu rồi chọn câu phù hợp với tình huống.',
    examples: [{ hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'Chào bạn' }, { hanzi: '您好', pinyin: 'nín hǎo', vi: 'Chào ông/bà, thầy/cô (kính trọng)' }],
    question: 'Gặp một người lớn tuổi lần đầu, bạn chọn câu nào?', choices: ['你好 · nǐ hǎo', '您好 · nín hǎo'], answer: 1,
    feedback: '您 là cách gọi kính trọng, nên chọn 您好 trong tình huống này.' },
  { id: 'start-06', title: 'Cảm ơn và đáp lời', goal: 'Hiểu một cặp câu thường gặp.', minutes: 8,
    body: '谢谢 (xièxie) nghĩa là cảm ơn. Âm xie thứ hai đọc nhẹ, ngắn và không cần số thanh khi gõ. 不客气 (bú kèqi) là câu đáp: không có gì, đừng khách sáo. Hãy nghe và đọc theo, mỗi câu vài lần.',
    examples: [{ hanzi: '谢谢', pinyin: 'xièxie', vi: 'Cảm ơn · gõ xie4xie' }, { hanzi: '不客气', pinyin: 'bú kèqi', vi: 'Không có gì' }],
    question: 'Một người nói 谢谢 với bạn. Bạn đáp thế nào?', choices: ['不客气 · bú kèqi', '你好 · nǐ hǎo'], answer: 0,
    feedback: '不客气 dùng để đáp lời cảm ơn. Hãy nghe lại cặp câu này.' },
  { id: 'start-07', title: 'Cuộc hội thoại đầu tiên', goal: 'Chào, cảm ơn và tạm biệt trong một tình huống ngắn.', minutes: 10,
    body: 'Bạn gặp một người bạn: chào hỏi, cảm ơn khi được giúp và tạm biệt. Nghe từng câu rồi tự nói lại khi không nhìn mẫu. Bài kiểm tra bên dưới kiểm tra cách nhớ và gõ; bạn có thể luyện ghi âm khi vào phần hội thoại của giáo trình.',
    examples: [{ hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'Xin chào' }, { hanzi: '谢谢你', pinyin: 'xièxie nǐ', vi: 'Cảm ơn bạn' }, { hanzi: '不客气', pinyin: 'bú kèqi', vi: 'Không có gì' }, { hanzi: '再见', pinyin: 'zàijiàn', vi: 'Tạm biệt' }],
    question: 'Bạn vừa được giúp đỡ. Gõ câu “Cảm ơn bạn” bằng pinyin.', expected: 'xièxie nǐ' },
] as const

export function beginnerProgress(state: Map<string, LessonState>) {
  const completed = BEGINNER_SESSIONS.filter((s) => !!state.get(s.id)?.done.dialogue).length
  return { completed, next: BEGINNER_SESSIONS.find((s) => !state.get(s.id)?.done.dialogue), total: BEGINNER_SESSIONS.length }
}
