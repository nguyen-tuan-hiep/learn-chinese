import type { CourseLesson } from '../types'
import { s, w } from './helpers'

export const lesson15: CourseLesson = {
  id: 'hsk1-15',
  level: 1,
  number: 15,
  title: '我是坐飞机来的',
  titlePinyin: 'Wǒ shì zuò fēijī lái de',
  titleVi: 'Tôi đến bằng máy bay',
  words: [
    w('renshi', '认识', 'rènshi', 'NHẬN THỨC', 'quen biết, nhận ra', 'động từ',
      'Như "NHẬN THỨC" nhưng nghĩa là quen biết một người, hoặc nhận ra một chữ: 认识你很高兴.',
      [s('我认识他。', 'Wǒ rènshi tā.', 'Tôi quen anh ấy.')]),
    w('nian', '年', 'nián', 'NIÊN', 'năm', 'danh từ',
      'Như "NIÊN khoá", "thanh niên". Đọc năm theo từng chữ số: 2026 = 二〇二六年 (èr líng èr liù nián).',
      [s('我是今年来的。', 'Wǒ shì jīnnián lái de.', 'Tôi đến vào năm nay.')]),
    w('daxue', '大学', 'dàxué', 'ĐẠI HỌC', 'đại học', 'danh từ',
      'Giống hệt tiếng Việt: ĐẠI HỌC. 北京大学 = Đại học Bắc Kinh.',
      [s('我在北京大学学习。', 'Wǒ zài Běijīng Dàxué xuéxí.', 'Tôi học ở Đại học Bắc Kinh.')]),
    w('fandian', '饭店', 'fàndiàn', 'PHẠN ĐIẾM', 'nhà hàng; khách sạn', 'danh từ',
      'Như "PHẠN ĐIẾM" (quán cơm). 饭 (cơm) + 店 (tiệm).',
      [s('我们去饭店吃饭吧。', 'Wǒmen qù fàndiàn chīfàn ba.', 'Chúng ta đi nhà hàng ăn đi.')]),
    w('chuzuche', '出租车', 'chūzūchē', 'XUẤT TÔ XA', 'taxi', 'danh từ',
      '出 (ra) + 租 (thuê, như "TÔ" thuế) + 车 (xe): xe cho thuê = taxi.',
      [s('我们坐出租车去吧。', 'Wǒmen zuò chūzūchē qù ba.', 'Chúng ta đi taxi đi.')]),
    w('yiqi', '一起', 'yìqǐ', 'NHẤT KHỞI', 'cùng nhau', 'phó từ',
      '一 (một) + 起 (khởi): cùng khởi đầu = cùng nhau. Đặt trước động từ: 一起去.',
      [s('我们一起去吧。', 'Wǒmen yìqǐ qù ba.', 'Chúng ta cùng đi nhé.')]),
    w('gaoxing', '高兴', 'gāoxìng', 'CAO HỨNG', 'vui, vui mừng', 'tính từ',
      'Giống "CAO HỨNG" (hứng khởi) trong tiếng Việt.',
      [s('认识你很高兴。', 'Rènshi nǐ hěn gāoxìng.', 'Rất vui được làm quen với bạn.')]),
    w('ting', '听', 'tīng', 'THÍNH', 'nghe', 'động từ',
      'Như "THÍNH giả", "thính giác". Bộ khẩu 口 + 斤.',
      [s('我喜欢听中国音乐。', 'Wǒ xǐhuan tīng Zhōngguó yīnyuè.', 'Tôi thích nghe nhạc Trung Quốc.')]),
    w('feiji', '飞机', 'fēijī', 'PHI CƠ', 'máy bay', 'danh từ',
      'Giống hệt tiếng Việt: PHI CƠ. 坐飞机 = đi máy bay.',
      [s('我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'Tôi đến bằng máy bay.')]),
  ],
  grammar: [
    {
      id: 'g-shi-de',
      title: 'Cấu trúc 是 … 的: nhấn mạnh chi tiết của việc đã xảy ra',
      pattern: 'S + 是 + Thời gian / Nơi chốn / Cách thức + V + 的',
      explanation:
        'Khi mọi người đã biết việc gì đó xảy ra rồi và muốn hỏi hoặc nhấn mạnh KHI NÀO, Ở ĐÂU, BẰNG CÁCH NÀO thì đặt phần đó giữa 是 và 的. Ví dụ: đã biết bạn đến Bắc Kinh rồi, hỏi đến lúc nào: 你是什么时候来的？ Trong văn nói, 是 có thể lược bỏ, nhưng 的 thì không.',
      examples: [
        s('你是什么时候来北京的？', 'Nǐ shì shénme shíhou lái Běijīng de?', 'Bạn đến Bắc Kinh khi nào?'),
        s('我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'Tôi đến bằng máy bay.'),
        s('我是和朋友一起来的。', 'Wǒ shì hé péngyou yìqǐ lái de.', 'Tôi đến cùng với bạn.'),
      ],
      drills: [
        { type: 'order', vi: 'Tôi đến bằng máy bay.', tokens: ['我', '是', '坐', '飞机', '来', '的'], pinyin: 'Wǒ shì zuò fēijī lái de.' },
        { type: 'translate', vi: 'Bạn đến bằng taxi à?', hanzi: '你是坐出租车来的吗？', pinyin: 'Nǐ shì zuò chūzūchē lái de ma?' },
      ],
    },
    {
      id: 'g-gaoxing',
      title: 'Làm quen: 认识你很高兴',
      pattern: '认识 + người + 很高兴',
      explanation: 'Câu xã giao khi lần đầu gặp: 认识你很高兴 (rất vui được làm quen với bạn). Đáp lại: 我也很高兴. Rủ đi đâu cùng nhau: 我们一起 + V + 吧.',
      examples: [
        s('认识你很高兴。', 'Rènshi nǐ hěn gāoxìng.', 'Rất vui được làm quen với bạn.'),
        s('我们一起去饭店吃饭吧。', 'Wǒmen yìqǐ qù fàndiàn chīfàn ba.', 'Chúng ta cùng đi nhà hàng ăn nhé.'),
      ],
      drills: [
        { type: 'order', vi: 'Chúng ta cùng đi nhà hàng ăn nhé.', tokens: ['我们', '一起', '去', '饭店', '吃饭', '吧'], pinyin: 'Wǒmen yìqǐ qù fàndiàn chīfàn ba.' },
        { type: 'translate', vi: 'Rất vui được làm quen với bạn.', hanzi: '认识你很高兴。', pinyin: 'Rènshi nǐ hěn gāoxìng.' },
      ],
    },
  ],
  dialogues: [
    {
      id: 'd1',
      title: 'Lần đầu gặp mặt',
      scene: 'Ở buổi gặp mặt tân sinh viên.',
      lines: [
        { speaker: 'Vương Minh', ...s('你好！我叫王明。', 'Nǐ hǎo! Wǒ jiào Wáng Míng.', 'Chào bạn! Mình tên là Vương Minh.') },
        { speaker: 'Anna', ...s('你好！我叫安娜。认识你很高兴。', 'Nǐ hǎo! Wǒ jiào Ānnà. Rènshi nǐ hěn gāoxìng.', 'Chào bạn! Mình là Anna. Rất vui được làm quen.') },
        { speaker: 'Vương Minh', ...s('我也很高兴。你是什么时候来北京的？', 'Wǒ yě hěn gāoxìng. Nǐ shì shénme shíhou lái Běijīng de?', 'Mình cũng rất vui. Bạn đến Bắc Kinh khi nào?') },
        { speaker: 'Anna', ...s('我是今年九月来的。', 'Wǒ shì jīnnián jiǔ yuè lái de.', 'Mình đến vào tháng 9 năm nay.') },
        { speaker: 'Vương Minh', ...s('你是怎么来的？', 'Nǐ shì zěnme lái de?', 'Bạn đến bằng gì?') },
        { speaker: 'Anna', ...s('我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'Mình đến bằng máy bay.') },
      ],
    },
    {
      id: 'd2',
      title: 'Cùng đi ăn',
      scene: 'Sau buổi gặp mặt.',
      lines: [
        { speaker: 'Anna', ...s('你在哪儿学习？', 'Nǐ zài nǎr xuéxí?', 'Bạn học ở đâu?') },
        { speaker: 'Vương Minh', ...s('我在北京大学学习。', 'Wǒ zài Běijīng Dàxué xuéxí.', 'Mình học ở Đại học Bắc Kinh.') },
        { speaker: 'Anna', ...s('中午我们一起去饭店吃饭吧。', 'Zhōngwǔ wǒmen yìqǐ qù fàndiàn chīfàn ba.', 'Trưa nay chúng mình cùng đi nhà hàng ăn nhé.') },
        { speaker: 'Vương Minh', ...s('好啊！我们坐出租车去吧。', 'Hǎo a! Wǒmen zuò chūzūchē qù ba.', 'Được đấy! Chúng mình đi taxi nhé.') },
      ],
    },
  ],
}
