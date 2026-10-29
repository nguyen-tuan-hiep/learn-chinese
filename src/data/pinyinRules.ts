export interface RuleExample {
  pinyin: string
  hanzi: string
  note?: string
}

export interface Rule {
  id: string
  title: string
  body: string
  examples: RuleExample[]
}

/** Spelling and reading rules that trip up Vietnamese learners, in the order they are useful. */
export const RULES: Rule[] = [
  {
    id: 'syllable',
    title: 'Một âm tiết gồm 3 phần',
    body: 'Mỗi âm tiết pinyin = thanh mẫu (phụ âm đầu) + vận mẫu (phần vần) + thanh điệu. Có 21 thanh mẫu và khoảng 36 vận mẫu. Một số âm tiết không có thanh mẫu và bắt đầu thẳng bằng vận mẫu. Hãy tập tách âm tiết trong đầu khi đọc.',
    examples: [
      { pinyin: 'zhōng', hanzi: '中', note: 'zh + ong + thanh 1' },
      { pinyin: 'xué', hanzi: '学', note: 'x + üe + thanh 2' },
      { pinyin: 'shēng', hanzi: '生', note: 'sh + eng + thanh 1' },
      { pinyin: 'ài', hanzi: '爱', note: 'không có thanh mẫu: ai + thanh 4' },
    ],
  },
  {
    id: 'tone-mark',
    title: 'Dấu thanh đặt ở đâu?',
    body: 'Ưu tiên theo thứ tự a, rồi e, rồi o: có a thì đánh dấu trên a, không có a thì trên e hoặc o. Riêng iu và ui thì đánh dấu trên chữ đứng SAU. Còn lại (chỉ có một nguyên âm) thì đánh dấu trên nguyên âm đó.',
    examples: [
      { pinyin: 'hǎo', hanzi: '好', note: 'có a → dấu trên a' },
      { pinyin: 'xiè', hanzi: '谢', note: 'không có a → dấu trên e' },
      { pinyin: 'gǒu', hanzi: '狗', note: 'ou → dấu trên o' },
      { pinyin: 'liù', hanzi: '六', note: 'iu → dấu trên u' },
      { pinyin: 'duì', hanzi: '对', note: 'ui → dấu trên i' },
    ],
  },
  {
    id: 'abbrev',
    title: 'Ba vần viết tắt: iu, ui, un',
    body: 'Sau thanh mẫu, iou được viết là iu, uei viết là ui, uen viết là un. Chỉ VIẾT tắt thôi, khi ĐỌC vẫn đọc đủ âm ở giữa.',
    examples: [
      { pinyin: 'liù', hanzi: '六', note: 'viết iu, đọc liou' },
      { pinyin: 'duì', hanzi: '对', note: 'viết ui, đọc duei' },
      { pinyin: 'chūn', hanzi: '春', note: 'viết un, đọc chuen' },
    ],
  },
  {
    id: 'y-w',
    title: 'Chữ y và w đứng đầu âm tiết',
    body: 'Khi vần bắt đầu bằng i, u hoặc ü mà không có thanh mẫu, ta viết thêm y hoặc w: i → yi, ia → ya, ie → ye, in → yin, ing → ying, u → wu, ua → wa, uo → wo, uan → wan, ü → yu, üe → yue. Đây chỉ là cách viết, y và w không phải thanh mẫu thật: yī đọc như "i", wǔ đọc như "u".',
    examples: [
      { pinyin: 'yī', hanzi: '一', note: 'i → yi' },
      { pinyin: 'yǒu', hanzi: '有', note: 'iou → you' },
      { pinyin: 'wǒ', hanzi: '我', note: 'uo → wo' },
      { pinyin: 'wèn', hanzi: '问', note: 'uen → wen' },
      { pinyin: 'yuè', hanzi: '月', note: 'üe → yue' },
    ],
  },
  {
    id: 'umlaut',
    title: 'ü và chữ u sau j, q, x, y',
    body: 'Sau j, q, x, y thì chữ u luôn đọc là ü (môi tròn, lưỡi đọc "i"): qù = qü, xué = xüé. Pinyin bỏ hai chấm để viết cho gọn. Chỉ sau l và n mới viết đủ ü để phân biệt với u thật: lù (đường) khác lǜ (xanh). Khi gõ bàn phím, ü gõ là v: nǚ gõ nv3, lǜ gõ lv4.',
    examples: [
      { pinyin: 'qù', hanzi: '去', note: 'đọc qü' },
      { pinyin: 'xué', hanzi: '学', note: 'đọc xüé' },
      { pinyin: 'nǚ', hanzi: '女', note: 'gõ nv3' },
      { pinyin: 'lǜ', hanzi: '绿', note: 'ü thật, gõ lv4' },
      { pinyin: 'lù', hanzi: '路', note: 'u thật, môi tròn kiểu "u"' },
    ],
  },
  {
    id: 'i-silent',
    title: 'Chữ i "đặc biệt" sau zh ch sh r z c s',
    body: 'Sau 7 thanh mẫu này, chữ i KHÔNG đọc là "i". Nó chỉ kéo dài tiếng của phụ âm, nghe gần "ư" (zhi ≈ "trư" uốn lưỡi, zi ≈ "tư"). Lỗi rất hay gặp: đọc chī (ăn) thành "chi".',
    examples: [
      { pinyin: 'zhī', hanzi: '知', note: 'uốn lưỡi, gần "trư"' },
      { pinyin: 'chī', hanzi: '吃', note: 'uốn lưỡi, bật hơi' },
      { pinyin: 'shì', hanzi: '是', note: 'uốn lưỡi' },
      { pinyin: 'rì', hanzi: '日', note: 'uốn lưỡi, rung' },
      { pinyin: 'sì', hanzi: '四', note: 'đầu lưỡi, gần "sư"' },
    ],
  },
  {
    id: 'nasal',
    title: 'Vần mũi: -n và -ng',
    body: 'Vần -n kết thúc bằng đầu lưỡi chạm lợi trên, như "n" tiếng Việt. Vần -ng kết thúc bằng cuống lưỡi, miệng vẫn mở và âm vang lên mũi, như "ng" trong "nghe". Đọc nhầm là ra từ khác.',
    examples: [
      { pinyin: 'xīn', hanzi: '新', note: 'mới' },
      { pinyin: 'xīng', hanzi: '星', note: 'ngôi sao' },
      { pinyin: 'mín', hanzi: '民', note: 'dân' },
      { pinyin: 'míng', hanzi: '明', note: 'sáng' },
      { pinyin: 'bān', hanzi: '班', note: 'lớp' },
      { pinyin: 'bāng', hanzi: '帮', note: 'giúp' },
    ],
  },
  {
    id: 'aspirated',
    title: 'Âm bật hơi và không bật hơi',
    body: 'Có 6 cặp: b/p, d/t, g/k, j/q, zh/ch, z/c. Âm đầu của mỗi cặp KHÔNG bật hơi, âm sau bật ra một luồng hơi mạnh. Đặt tờ giấy trước miệng: đọc p, t, k, q, ch, c thì giấy bay, đọc b, d, g, j, zh, z thì giấy gần như đứng yên. Tiếng Việt không phân biệt kiểu này nên cần luyện kỹ.',
    examples: [
      { pinyin: 'bà', hanzi: '爸', note: 'bố, không bật hơi' },
      { pinyin: 'pà', hanzi: '怕', note: 'sợ, bật hơi' },
      { pinyin: 'gē', hanzi: '哥', note: 'anh trai' },
      { pinyin: 'kē', hanzi: '科', note: 'khoa, bật hơi' },
    ],
  },
  {
    id: 'neutral',
    title: 'Thanh nhẹ: không có dấu',
    body: 'Một số âm tiết đọc nhẹ và ngắn, pinyin không đánh dấu: māma, xièxie, shénme, wǒmen. Không có quy tắc chung, bạn học thuộc theo từng từ (giáo trình đã đánh sẵn). Khi gõ trong app, âm nhẹ không cần số.',
    examples: [
      { pinyin: 'māma', hanzi: '妈妈', note: 'gõ ma1ma' },
      { pinyin: 'xièxie', hanzi: '谢谢', note: 'gõ xie4xie' },
      { pinyin: 'shénme', hanzi: '什么', note: 'gõ shen2me' },
      { pinyin: 'péngyou', hanzi: '朋友', note: 'gõ peng2you' },
    ],
  },
  {
    id: 'apostrophe',
    title: "Dấu cách âm (')",
    body: "Khi âm tiết sau bắt đầu bằng a, o, e và đứng ngay sau âm tiết khác, pinyin thêm dấu ' để biết ranh giới. Ví dụ xī'ān (Tây An, hai âm tiết) khác xiān (trước, một âm tiết).",
    examples: [
      { pinyin: "xī'ān", hanzi: '西安', note: 'xī + ān' },
      { pinyin: 'xiān', hanzi: '先', note: 'một âm tiết' },
      { pinyin: "nǚ'ér", hanzi: '女儿', note: 'nǚ + ér' },
    ],
  },
  {
    id: 'erhua',
    title: 'Âm cuốn lưỡi 儿 (r)',
    body: 'Ở giọng Bắc Kinh, 儿 ở cuối từ không đọc thành âm tiết "er" riêng mà cuốn lưỡi, dính vào âm tiết trước: nǎr, zhèr. Khi gõ, nǎr gõ nar3 hoặc na3r đều được.',
    examples: [
      { pinyin: 'nǎr', hanzi: '哪儿', note: 'ở đâu' },
      { pinyin: 'zhèr', hanzi: '这儿', note: 'ở đây' },
      { pinyin: 'yìdiǎnr', hanzi: '一点儿', note: 'một chút' },
    ],
  },
]
