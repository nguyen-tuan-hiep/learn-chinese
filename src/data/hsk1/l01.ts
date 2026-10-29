import type { CourseLesson } from '../types'
import { s, w } from './helpers'

export const lesson01: CourseLesson = {
  id: 'hsk1-01',
  level: 1,
  number: 1,
  title: '你好',
  titlePinyin: 'Nǐ hǎo',
  titleVi: 'Xin chào',
  words: [
    w('ni', '你', 'nǐ', 'NHĨ', 'bạn, anh, chị (ngôi thứ hai)', 'đại từ',
      'Bộ nhân đứng 亻 bên trái: chỉ một NGƯỜI đang đứng trước mặt mình.',
      [s('你好！', 'Nǐ hǎo!', 'Chào bạn!')],
      { parts: '亻(nhân, người) + 尔 (nhĩ, ngươi)' }),
    w('hao', '好', 'hǎo', 'HẢO', 'tốt, khỏe, hay', 'tính từ',
      'Người phụ nữ 女 bế đứa con 子: có mẹ có con là điều TỐT đẹp. Như "hảo hạng", "hữu hảo".',
      [s('你好！', 'Nǐ hǎo!', 'Chào bạn!'), s('很好。', 'Hěn hǎo.', 'Rất tốt.')],
      { parts: '女 (nữ, phụ nữ) + 子 (tử, con)' }),
    w('nin', '您', 'nín', 'NÂM', 'ngài, ông, bà (kính trọng)', 'đại từ',
      'Chữ 你 đặt trên 心 (tim): người mình để trong lòng mà kính trọng. Dùng với thầy cô, người lớn tuổi.',
      [s('您好！', 'Nín hǎo!', 'Cháu chào ông/bà! (kính trọng)')],
      { parts: '你 (nhĩ, bạn) + 心 (tâm, trái tim)' }),
    w('nimen', '你们', 'nǐmen', 'NHĨ MÔN', 'các bạn', 'đại từ',
      '们 (môn) gắn sau đại từ chỉ người để thành số nhiều: 你 → 你们, 我 → 我们.',
      [s('你们好！', 'Nǐmen hǎo!', 'Chào các bạn!')],
      { parts: '你 + 们 (亻người + 门 cửa: một nhóm người)' }),
    w('duibuqi', '对不起', 'duìbuqǐ', 'ĐỐI BẤT KHỞI', 'xin lỗi', 'động từ',
      'Nghĩa đen: "không dám đối mặt" vì thấy mình có lỗi.',
      [s('对不起！', 'Duìbuqǐ!', 'Xin lỗi!')]),
    w('meiguanxi', '没关系', 'méi guānxi', 'MỘT QUAN HỆ', 'không sao, không có gì', 'cụm từ',
      'Nghĩa đen: "không có quan hệ gì", tức là chuyện đó chẳng ảnh hưởng gì. Câu đáp lại 对不起.',
      [s('没关系。', 'Méi guānxi.', 'Không sao đâu.')]),
    w('zaoan', '早安', 'zǎo ān', 'TẢO AN', 'chào buổi sáng', 'cụm từ',
      '早 (tảo, sớm) + 安 (an, yên): lời chúc một buổi sáng bình an.',
      [s('早安！', 'Zǎo ān!', 'Chào buổi sáng!')]),
    w('wanan', '晚安', 'wǎn ān', 'VÃN AN', 'chúc ngủ ngon', 'cụm từ',
      '晚 (vãn, muộn) + 安 (an, yên): chúc một đêm yên lành.',
      [s('晚安！', 'Wǎn ān!', 'Chúc ngủ ngon!')]),
    w('gewei', '各位', 'gèwèi', 'CÁC VỊ', 'quý vị, mọi người', 'đại từ',
      '各 (các, mỗi) + 位 (vị, người): cách gọi lịch sự một nhóm người.',
      [s('各位好！', 'Gèwèi hǎo!', 'Xin chào quý vị!')]),
    w('nihaoya', '你好呀', 'nǐ hǎo ya', 'NHĨ HẢO GIA', 'xin chào nhé', 'cụm từ',
      '呀 là trợ từ cuối câu, làm lời chào nghe thân mật và vui vẻ hơn.',
      [s('你好呀！', 'Nǐ hǎo ya!', 'Xin chào nhé!')]),
  ],
  grammar: [
    {
      id: 'g-greet',
      title: 'Chào hỏi: Đại từ + 好',
      pattern: 'Đại từ chỉ người + 好！',
      explanation:
        'Câu chào cơ bản nhất: đặt người được chào phía trước 好. Với người lớn tuổi, thầy cô, khách hàng thì dùng 您 để thể hiện sự kính trọng. Chào một nhóm thì dùng 你们.',
      examples: [
        s('你好！', 'Nǐ hǎo!', 'Chào bạn!'),
        s('您好！', 'Nín hǎo!', 'Chào ông/bà! (kính trọng)'),
        s('你们好！', 'Nǐmen hǎo!', 'Chào các bạn!'),
      ],
      drills: [
        { type: 'order', vi: 'Chào các bạn!', tokens: ['你们', '好'], pinyin: 'Nǐmen hǎo!' },
        { type: 'translate', vi: 'Chào ông/bà (kính trọng)!', hanzi: '您好！', pinyin: 'Nín hǎo!' },
      ],
    },
    {
      id: 'g-33',
      title: 'Biến điệu: hai thanh 3 đi liền nhau',
      pattern: 'Thanh 3 + Thanh 3 → đọc Thanh 2 + Thanh 3',
      explanation:
        'Khi hai âm tiết thanh 3 đứng cạnh nhau, âm đầu được đọc thành thanh 2 cho dễ nói. Pinyin vẫn VIẾT là thanh 3, chỉ thay đổi khi ĐỌC. Ví dụ 你好 viết nǐ hǎo nhưng đọc là ní hǎo. Hãy nghe kỹ và bắt chước.',
      examples: [
        s('你好！', 'Nǐ hǎo!', 'đọc: ní hǎo'),
        s('很好。', 'Hěn hǎo.', 'đọc: hén hǎo · rất tốt'),
      ],
      drills: [{ type: 'translate', vi: 'Xin chào!', hanzi: '你好！', pinyin: 'Nǐ hǎo!' }],
    },
  ],
  dialogues: [
    {
      id: 'd1',
      title: 'Gặp nhau',
      scene: 'Hai bạn trẻ gặp nhau lần đầu.',
      lines: [
        { speaker: 'Vương Minh', ...s('你好！', 'Nǐ hǎo!', 'Chào bạn!') },
        { speaker: 'Anna', ...s('你好！', 'Nǐ hǎo!', 'Chào bạn!') },
      ],
    },
    {
      id: 'd2',
      title: 'Chào cô giáo',
      scene: 'Hai học sinh chào cô giáo khi vào lớp.',
      lines: [
        { speaker: 'Học sinh', ...s('您好！', 'Nín hǎo!', 'Chào cô ạ!') },
        { speaker: 'Cô giáo', ...s('你们好！', 'Nǐmen hǎo!', 'Chào các em!') },
      ],
    },
    {
      id: 'd3',
      title: 'Va phải nhau',
      scene: 'Vương Minh vô tình va vào Anna.',
      lines: [
        { speaker: 'Vương Minh', ...s('对不起！', 'Duìbuqǐ!', 'Xin lỗi!') },
        { speaker: 'Anna', ...s('没关系。', 'Méi guānxi.', 'Không sao đâu.') },
      ],
    },
  ],
}
