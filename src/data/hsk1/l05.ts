import type { CourseLesson } from '../types'
import { s, w } from './helpers'

const num = (id: string, hanzi: string, pinyin: string, hanViet: string, meaning: string, mnemonic: string, ex: [string, string, string]) =>
  w(id, hanzi, pinyin, hanViet, meaning, 'số từ', mnemonic, [s(...ex)])

export const lesson05: CourseLesson = {
  id: 'hsk1-05',
  level: 1,
  number: 5,
  title: '她女儿今年二十岁',
  titlePinyin: 'Tā nǚ\'ér jīnnián èrshí suì',
  titleVi: 'Con gái cô ấy năm nay hai mươi tuổi',
  words: [
    w('jia', '家', 'jiā', 'GIA', 'nhà, gia đình', 'danh từ',
      'Mái nhà 宀 che con lợn 豕: thời xưa nhà nào cũng nuôi lợn dưới mái nhà. Như "gia đình", "quốc gia".',
      [s('我家有三口人。', 'Wǒ jiā yǒu sān kǒu rén.', 'Nhà tôi có ba người.')],
      { parts: '宀 (miên, mái nhà) + 豕 (thỉ, con lợn)' }),
    w('you', '有', 'yǒu', 'HỮU', 'có', 'động từ',
      'Bàn tay ⺼ cầm miếng thịt 月: trong tay CÓ thịt. Như "sở hữu". Phủ định là 没有, không dùng 不有.',
      [s('她有女儿吗？', 'Tā yǒu nǚ\'ér ma?', 'Cô ấy có con gái không?')],
      { parts: '𠂇 (bàn tay) + 月 (nhục, thịt)' }),
    w('kou', '口', 'kǒu', 'KHẨU', 'miệng; (lượng từ đếm người trong nhà)', 'danh từ / lượng từ',
      'Hình cái miệng. Như "nhân khẩu", "hộ khẩu": mỗi người trong nhà là một miệng ăn, nên đếm thành viên gia đình bằng 口.',
      [s('你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'Nhà bạn có mấy người?')]),
    w('nver', '女儿', 'nǚ\'ér', 'NỮ NHI', 'con gái', 'danh từ',
      '女 (nữ) + 儿 (nhi, con trẻ): đứa con là con gái. Như "nữ nhi".',
      [s('她女儿今年八岁。', 'Tā nǚ\'ér jīnnián bā suì.', 'Con gái cô ấy năm nay tám tuổi.')],
      { parts: '女 (nữ) + 儿 (nhi, trẻ con)' }),
    w('ji', '几', 'jǐ', 'KỶ', 'mấy (hỏi số lượng nhỏ)', 'đại từ nghi vấn',
      'Hỏi số lượng thường dưới 10. Như "kỷ hà" (bao nhiêu). Sau 几 phải có lượng từ: 几口人, 几岁.',
      [s('你女儿几岁了？', 'Nǐ nǚ\'ér jǐ suì le?', 'Con gái bạn mấy tuổi rồi?')]),
    w('sui', '岁', 'suì', 'TUẾ', 'tuổi', 'lượng từ',
      'Như "vạn TUẾ", "niên TUẾ". Núi 山 trên, buổi chiều 夕 dưới: năm tháng trôi qua như núi đồi và hoàng hôn.',
      [s('我今年二十岁。', 'Wǒ jīnnián èrshí suì.', 'Năm nay tôi hai mươi tuổi.')],
      { parts: '山 (sơn, núi) + 夕 (tịch, buổi chiều)' }),
    w('le', '了', 'le', 'LIỄU', '(trợ từ: rồi, biểu thị thay đổi)', 'trợ từ',
      'Đặt cuối câu để nói một tình huống MỚI xuất hiện, giống "rồi" trong tiếng Việt: 二十岁了 = hai mươi tuổi rồi.',
      [s('她今年四十岁了。', 'Tā jīnnián sìshí suì le.', 'Năm nay cô ấy bốn mươi tuổi rồi.')]),
    w('jinnian', '今年', 'jīnnián', 'KIM NIÊN', 'năm nay', 'danh từ',
      'KIM (nay, như "kim cổ") + NIÊN (năm, như "niên khoá"). Từ chỉ thời gian đứng TRƯỚC động từ hoặc ngay sau chủ ngữ.',
      [s('你今年多大了？', 'Nǐ jīnnián duō dà le?', 'Năm nay bạn bao nhiêu tuổi?')]),
    w('duo', '多', 'duō', 'ĐA', 'nhiều; bao (nhiêu)', 'tính từ / phó từ',
      'Hai chữ 夕 (buổi tối) chồng lên nhau: nhiều buổi tối = NHIỀU. Như "đa số". 多 + tính từ để hỏi mức độ: 多大 (bao nhiêu tuổi).',
      [s('你今年多大了？', 'Nǐ jīnnián duō dà le?', 'Năm nay bạn bao nhiêu tuổi?')],
      { parts: '夕 (tịch) + 夕 (tịch)' }),
    w('da', '大', 'dà', 'ĐẠI', 'to, lớn; (tuổi) lớn', 'tính từ',
      'Hình người dang rộng hai tay: TO LỚN. Như "đại học", "vĩ đại". 多大 dùng hỏi tuổi người lớn.',
      [s('你女儿多大了？', 'Nǐ nǚ\'ér duō dà le?', 'Con gái bạn bao nhiêu tuổi rồi?')]),
    num('n1', '一', 'yī', 'NHẤT', 'một', 'Một nét ngang. Như "thống NHẤT".', ['一口人', 'yī kǒu rén', 'một người']),
    num('n2', '二', 'èr', 'NHỊ', 'hai', 'Hai nét ngang. Như "độc nhất vô NHỊ".', ['二十', 'èrshí', 'hai mươi']),
    num('n3', '三', 'sān', 'TAM', 'ba', 'Ba nét ngang. Như "TAM giác".', ['我家有三口人。', 'Wǒ jiā yǒu sān kǒu rén.', 'Nhà tôi có ba người.']),
    num('n4', '四', 'sì', 'TỨ', 'bốn', 'Khung có bốn góc. Như "TỨ phương".', ['四十', 'sìshí', 'bốn mươi']),
    num('n5', '五', 'wǔ', 'NGŨ', 'năm', 'Như "NGŨ hành", "ngũ quả".', ['十五', 'shíwǔ', 'mười lăm']),
    num('n6', '六', 'liù', 'LỤC', 'sáu', 'Người đội mũ dang hai chân. Như "LỤC bát".', ['六岁', 'liù suì', 'sáu tuổi']),
    num('n7', '七', 'qī', 'THẤT', 'bảy', 'Giống số 7 lật ngược. Như "THẤT tịch" (7/7).', ['七十', 'qīshí', 'bảy mươi']),
    num('n8', '八', 'bā', 'BÁT', 'tám', 'Hai nét tách ra như chữ V úp. Như "BÁT quái".', ['八岁', 'bā suì', 'tám tuổi']),
    num('n9', '九', 'jiǔ', 'CỬU', 'chín', 'Như "CỬU Long" (chín con rồng).', ['九十九', 'jiǔshíjiǔ', 'chín mươi chín']),
    num('n10', '十', 'shí', 'THẬP', 'mười', 'Dấu cộng: đủ mười. Như "THẬP tự".', ['二十岁', 'èrshí suì', 'hai mươi tuổi']),
  ],
  grammar: [
    {
      id: 'g-ji',
      title: 'Hỏi số lượng với 几',
      pattern: '… 有 + 几 + Lượng từ + Danh từ？',
      explanation:
        '几 hỏi số lượng nhỏ (thường dưới 10). Giữa 几 và danh từ BẮT BUỘC có lượng từ, giống "mấy NGƯỜI", "mấy CÁI" trong tiếng Việt. Đếm người trong gia đình dùng lượng từ 口.',
      examples: [
        s('你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'Nhà bạn có mấy người?'),
        s('我家有四口人。', 'Wǒ jiā yǒu sì kǒu rén.', 'Nhà tôi có bốn người.'),
      ],
      drills: [
        { type: 'order', vi: 'Nhà bạn có mấy người?', tokens: ['你', '家', '有', '几', '口', '人'], pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?' },
        { type: 'translate', vi: 'Nhà tôi có ba người.', hanzi: '我家有三口人。', pinyin: 'Wǒ jiā yǒu sān kǒu rén.' },
      ],
    },
    {
      id: 'g-numbers',
      title: 'Số đếm 11–99',
      pattern: 'Hàng chục + 十 + Hàng đơn vị',
      explanation:
        'Cách ghép giống hệt tiếng Việt: 十一 = mười một, 二十 = hai mươi, 二十五 = hai mươi lăm, 九十九 = chín mươi chín. Không cần thêm từ nối kiểu "mốt", "lăm".',
      examples: [
        s('十一', 'shíyī', 'mười một'),
        s('二十五', 'èrshíwǔ', 'hai mươi lăm'),
        s('九十九', 'jiǔshíjiǔ', 'chín mươi chín'),
      ],
      drills: [
        { type: 'translate', vi: 'Hai mươi tám', hanzi: '二十八', pinyin: 'èrshíbā' },
        { type: 'translate', vi: 'Sáu mươi ba', hanzi: '六十三', pinyin: 'liùshísān' },
      ],
    },
    {
      id: 'g-age',
      title: 'Hỏi tuổi: 多大 / 几岁 + 了',
      pattern: 'Người + 今年 + 多大了？  ·  Trẻ nhỏ: 几岁了？',
      explanation:
        'Hỏi tuổi người lớn hoặc người ngang hàng thì dùng 多大了. Hỏi tuổi trẻ em (dưới 10) thì dùng 几岁了. Khi trả lời, 岁 là "tuổi". 了 ở cuối câu mang nghĩa "rồi". Với người lớn tuổi nên hỏi lịch sự hơn (sẽ học sau).',
      examples: [
        s('你今年多大了？', 'Nǐ jīnnián duō dà le?', 'Năm nay bạn bao nhiêu tuổi?'),
        s('我今年二十岁了。', 'Wǒ jīnnián èrshí suì le.', 'Năm nay tôi hai mươi tuổi rồi.'),
        s('你女儿几岁了？', 'Nǐ nǚ\'ér jǐ suì le?', 'Con gái bạn mấy tuổi rồi?'),
      ],
      drills: [
        { type: 'order', vi: 'Con gái bạn năm nay mấy tuổi rồi?', tokens: ['你', '女儿', '今年', '几', '岁', '了'], pinyin: 'Nǐ nǚ\'ér jīnnián jǐ suì le?' },
        { type: 'translate', vi: 'Năm nay bạn bao nhiêu tuổi?', hanzi: '你今年多大了？', pinyin: 'Nǐ jīnnián duō dà le?' },
      ],
    },
  ],
  dialogues: [
    {
      id: 'd1',
      title: 'Gia đình',
      scene: 'Anna hỏi Vương Minh về gia đình.',
      lines: [
        { speaker: 'Anna', ...s('你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'Nhà bạn có mấy người?') },
        { speaker: 'Vương Minh', ...s('我家有三口人。你家呢？', 'Wǒ jiā yǒu sān kǒu rén. Nǐ jiā ne?', 'Nhà mình có ba người. Còn nhà bạn?') },
        { speaker: 'Anna', ...s('我家有四口人。', 'Wǒ jiā yǒu sì kǒu rén.', 'Nhà mình có bốn người.') },
      ],
    },
    {
      id: 'd2',
      title: 'Cô giáo bao nhiêu tuổi?',
      scene: 'Hai bạn nói chuyện về cô giáo tiếng Hán.',
      lines: [
        { speaker: 'Anna', ...s('你的汉语老师今年多大了？', 'Nǐ de Hànyǔ lǎoshī jīnnián duō dà le?', 'Cô giáo tiếng Hán của bạn năm nay bao nhiêu tuổi?') },
        { speaker: 'Vương Minh', ...s('她今年四十岁了。', 'Tā jīnnián sìshí suì le.', 'Năm nay cô ấy bốn mươi tuổi rồi.') },
        { speaker: 'Anna', ...s('她有女儿吗？', 'Tā yǒu nǚ\'ér ma?', 'Cô ấy có con gái không?') },
        { speaker: 'Vương Minh', ...s('有，她女儿今年二十岁。', 'Yǒu, tā nǚ\'ér jīnnián èrshí suì.', 'Có, con gái cô ấy năm nay hai mươi tuổi.') },
      ],
    },
  ],
}
